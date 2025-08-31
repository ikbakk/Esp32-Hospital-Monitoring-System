import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  QueryConstraint,
  DocumentSnapshot,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  DeviceReading,
  Device,
  ReadingFilters,
  PaginationOptions,
} from "@/types/deviceMonitoring";

const DEVICES_COLLECTION = "devices";
const VITALS_COLLECTION = "vitals";

export class DeviceMonitoringService {
  // Get all devices
  static async getDevices(): Promise<Device[]> {
    const devicesRef = collection(db, DEVICES_COLLECTION);
    const q = query(devicesRef, orderBy("updatedAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Device[];
  }

  // Get device by ID
  static async getDeviceById(deviceId: string): Promise<Device | null> {
    const deviceRef = doc(db, DEVICES_COLLECTION, deviceId);
    const snapshot = await getDoc(deviceRef);

    if (!snapshot.exists()) return null;

    const data = snapshot.data();
    return {
      id: snapshot.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Device;
  }

  // Get device readings with filters and pagination
  static async getDeviceReadings(
    filters: ReadingFilters = {},
    pagination: PaginationOptions = { limit: 50 },
  ): Promise<{ readings: DeviceReading[]; lastDoc: DocumentSnapshot | null }> {
    const readingsRef = collection(db, VITALS_COLLECTION);
    const constraints: QueryConstraint[] = [];

    // Apply filters
    if (filters.deviceId) {
      constraints.push(where("deviceId", "==", filters.deviceId));
    }

    if (filters.patientId) {
      constraints.push(where("patientId", "==", filters.patientId));
    }

    if (filters.dateFrom) {
      constraints.push(
        where("timestamp", ">=", Timestamp.fromDate(filters.dateFrom)),
      );
    }

    if (filters.dateTo) {
      constraints.push(
        where("timestamp", "<=", Timestamp.fromDate(filters.dateTo)),
      );
    }

    if (filters.dataQuality) {
      constraints.push(where("dataQuality", "==", filters.dataQuality));
    }

    // Order by timestamp (most recent first)
    constraints.push(orderBy("timestamp", "desc"));

    // Add pagination
    constraints.push(limit(pagination.limit));

    if (pagination.lastDoc) {
      constraints.push(startAfter(pagination.lastDoc));
    }

    const q = query(readingsRef, ...constraints);
    const snapshot = await getDocs(q);

    const readings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date(),
    })) as DeviceReading[];

    // Filter for alerts if specified (client-side since Firestore doesn't support complex nested queries easily)
    let filteredReadings = readings;
    if (filters.hasAlerts !== undefined) {
      filteredReadings = readings.filter((reading) => {
        const hasAlert =
          reading.alerts.hrAlert ||
          reading.alerts.spo2Alert ||
          reading.alerts.tempAlert;
        return filters.hasAlerts ? hasAlert : !hasAlert;
      });
    }

    const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;

    return { readings: filteredReadings, lastDoc };
  }

  // Get latest reading for a specific device
  static async getLatestDeviceReading(
    deviceId: string,
  ): Promise<DeviceReading | null> {
    const readingsRef = collection(db, VITALS_COLLECTION);
    const q = query(
      readingsRef,
      where("deviceId", "==", deviceId),
      orderBy("timestamp", "desc"),
      limit(1),
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date(),
    } as DeviceReading;
  }

  // Get readings with active alerts
  static async getActiveAlerts(): Promise<DeviceReading[]> {
    const readingsRef = collection(db, VITALS_COLLECTION);
    const q = query(
      readingsRef,
      orderBy("timestamp", "desc"),
      limit(100), // Get recent readings to check for alerts
    );

    const snapshot = await getDocs(q);
    const readings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date(),
    })) as DeviceReading[];

    // Filter for active alerts
    return readings.filter(
      (reading) =>
        reading.alerts.hrAlert ||
        reading.alerts.spo2Alert ||
        reading.alerts.tempAlert,
    );
  }

  // Real-time subscription to device readings
  static subscribeToDeviceReadings(
    deviceId: string,
    callback: (readings: DeviceReading[]) => void,
  ): Unsubscribe {
    const readingsRef = collection(db, VITALS_COLLECTION);
    const q = query(
      readingsRef,
      where("deviceId", "==", deviceId),
      orderBy("timestamp", "desc"),
      limit(20),
    );

    return onSnapshot(q, (snapshot) => {
      const readings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as DeviceReading[];

      callback(readings);
    });
  }

  // Get device statistics
  static async getDeviceStats(
    deviceId: string,
    hours: number = 24,
  ): Promise<{
    totalReadings: number;
    alertCount: number;
    avgHeartRate: number;
    avgSpo2: number;
    avgBodyTemp: number;
  }> {
    const fromDate = new Date(Date.now() - hours * 60 * 60 * 1000);
    const readingsRef = collection(db, VITALS_COLLECTION);
    const q = query(
      readingsRef,
      where("deviceId", "==", deviceId),
      where("timestamp", ">=", Timestamp.fromDate(fromDate)),
      orderBy("timestamp", "desc"),
    );

    const snapshot = await getDocs(q);
    const readings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date(),
    })) as DeviceReading[];

    const totalReadings = readings.length;
    const alertCount = readings.filter(
      (r) => r.alerts.hrAlert || r.alerts.spo2Alert || r.alerts.tempAlert,
    ).length;

    const avgHeartRate =
      readings.reduce((sum, r) => sum + r.heartRate, 0) / totalReadings || 0;
    const avgSpo2 =
      readings.reduce((sum, r) => sum + r.spo2, 0) / totalReadings || 0;
    const avgBodyTemp =
      readings.reduce((sum, r) => sum + r.bodyTemp, 0) / totalReadings || 0;

    return {
      totalReadings,
      alertCount,
      avgHeartRate: Math.round(avgHeartRate * 10) / 10,
      avgSpo2: Math.round(avgSpo2 * 10) / 10,
      avgBodyTemp: Math.round(avgBodyTemp * 10) / 10,
    };
  }
}
