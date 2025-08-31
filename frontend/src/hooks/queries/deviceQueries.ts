import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { DeviceMonitoringService } from "@/services/devicesService";
import {
  Device,
  DeviceReading,
  ReadingFilters,
  PaginationOptions,
} from "@/types/deviceMonitoring";

// Query Keys Factory
export const deviceQueryKeys = {
  all: ["devices"] as const,
  devices: () => [...deviceQueryKeys.all, "list"] as const,
  device: (id: string) => [...deviceQueryKeys.all, "detail", id] as const,
  readings: () => [...deviceQueryKeys.all, "readings"] as const,
  readingsList: (filters: ReadingFilters) =>
    [...deviceQueryKeys.readings(), filters] as const,
  deviceReadings: (deviceId: string) =>
    [...deviceQueryKeys.readings(), "device", deviceId] as const,
  latestReading: (deviceId: string) =>
    [...deviceQueryKeys.readings(), "latest", deviceId] as const,
  alerts: () => [...deviceQueryKeys.all, "alerts"] as const,
  deviceStats: (deviceId: string, hours: number) =>
    [...deviceQueryKeys.all, "stats", deviceId, hours] as const,
};

// Get all devices
export const useDevices = (
  options?: Omit<UseQueryOptions<Device[], Error>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: deviceQueryKeys.devices(),
    queryFn: DeviceMonitoringService.getDevices,
    staleTime: 1000 * 60 * 2, // 2 minutes
    ...options,
  });
};

// Get single device
export const useDevice = (
  deviceId: string,
  options?: Omit<UseQueryOptions<Device | null, Error>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: deviceQueryKeys.device(deviceId),
    queryFn: () => DeviceMonitoringService.getDeviceById(deviceId),
    enabled: !!deviceId,
    ...options,
  });
};

// Get device readings with filters
export const useDeviceReadings = (
  filters: ReadingFilters = {},
  pagination: PaginationOptions = { limit: 50 },
  options?: Omit<
    UseQueryOptions<{ readings: DeviceReading[]; lastDoc: any }, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: deviceQueryKeys.readingsList({ ...filters, ...pagination }),
    queryFn: () =>
      DeviceMonitoringService.getDeviceReadings(filters, pagination),
    staleTime: 1000 * 30, // 30 seconds
    ...options,
  });
};

// Get latest reading for device
export const useLatestDeviceReading = (
  deviceId: string,
  options?: Omit<
    UseQueryOptions<DeviceReading | null, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: deviceQueryKeys.latestReading(deviceId),
    queryFn: () => DeviceMonitoringService.getLatestDeviceReading(deviceId),
    enabled: !!deviceId,
    refetchInterval: 1000 * 10, // Refetch every 10 seconds for real-time feel
    ...options,
  });
};

// Get active alerts
export const useActiveAlerts = (
  options?: Omit<
    UseQueryOptions<DeviceReading[], Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: deviceQueryKeys.alerts(),
    queryFn: DeviceMonitoringService.getActiveAlerts,
    refetchInterval: 1000 * 15, // Check for alerts every 15 seconds
    ...options,
  });
};

// Get device statistics
export const useDeviceStats = (
  deviceId: string,
  hours: number = 24,
  options?: Omit<UseQueryOptions<any, Error>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: deviceQueryKeys.deviceStats(deviceId, hours),
    queryFn: () => DeviceMonitoringService.getDeviceStats(deviceId, hours),
    enabled: !!deviceId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};
