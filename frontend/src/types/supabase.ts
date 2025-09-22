export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type PatientTable = Database["public"]["Tables"]["patients"]["Row"];
export type RoomsTable = Database["public"]["Tables"]["rooms"]["Row"];
export type ReadingsTable = Database["public"]["Tables"]["readings"]["Row"];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4";
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      admissions: {
        Row: {
          admitted_at: string | null;
          created_at: string | null;
          discharged_at: string | null;
          id: string;
          patient_id: string | null;
          room_id: string | null;
        };
        Insert: {
          admitted_at?: string | null;
          created_at?: string | null;
          discharged_at?: string | null;
          id?: string;
          patient_id?: string | null;
          room_id?: string | null;
        };
        Update: {
          admitted_at?: string | null;
          created_at?: string | null;
          discharged_at?: string | null;
          id?: string;
          patient_id?: string | null;
          room_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "admissions_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "admissions_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "rooms";
            referencedColumns: ["id"];
          },
        ];
      };
      alerts: {
        Row: {
          acknowledged: boolean | null;
          acknowledged_at: string | null;
          acknowledged_by: string | null;
          alert_type: string;
          created_at: string | null;
          id: string;
          message: string | null;
          patient_id: string | null;
          reading_id: string | null;
          severity: string;
        };
        Insert: {
          acknowledged?: boolean | null;
          acknowledged_at?: string | null;
          acknowledged_by?: string | null;
          alert_type: string;
          created_at?: string | null;
          id?: string;
          message?: string | null;
          patient_id?: string | null;
          reading_id?: string | null;
          severity: string;
        };
        Update: {
          acknowledged?: boolean | null;
          acknowledged_at?: string | null;
          acknowledged_by?: string | null;
          alert_type?: string;
          created_at?: string | null;
          id?: string;
          message?: string | null;
          patient_id?: string | null;
          reading_id?: string | null;
          severity?: string;
        };
        Relationships: [
          {
            foreignKeyName: "alerts_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "alerts_reading_id_fkey";
            columns: ["reading_id"];
            isOneToOne: false;
            referencedRelation: "readings";
            referencedColumns: ["id"];
          },
        ];
      };
      allergies: {
        Row: {
          allergen: string;
          created_at: string | null;
          discovered_date: string | null;
          id: string;
          patient_id: string | null;
          reaction: string | null;
          severity: Database["public"]["Enums"]["allergy_severity"] | null;
        };
        Insert: {
          allergen: string;
          created_at?: string | null;
          discovered_date?: string | null;
          id?: string;
          patient_id?: string | null;
          reaction?: string | null;
          severity?: Database["public"]["Enums"]["allergy_severity"] | null;
        };
        Update: {
          allergen?: string;
          created_at?: string | null;
          discovered_date?: string | null;
          id?: string;
          patient_id?: string | null;
          reaction?: string | null;
          severity?: Database["public"]["Enums"]["allergy_severity"] | null;
        };
        Relationships: [
          {
            foreignKeyName: "allergies_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["id"];
          },
        ];
      };
      devices: {
        Row: {
          battery_level: number | null;
          created_at: string | null;
          device_id: string;
          firmware_version: string | null;
          id: string;
          last_seen: string | null;
          location: string | null;
          mac_address: string | null;
          patient_id: string | null;
          status: string | null;
        };
        Insert: {
          battery_level?: number | null;
          created_at?: string | null;
          device_id: string;
          firmware_version?: string | null;
          id?: string;
          last_seen?: string | null;
          location?: string | null;
          mac_address?: string | null;
          patient_id?: string | null;
          status?: string | null;
        };
        Update: {
          battery_level?: number | null;
          created_at?: string | null;
          device_id?: string;
          firmware_version?: string | null;
          id?: string;
          last_seen?: string | null;
          location?: string | null;
          mac_address?: string | null;
          patient_id?: string | null;
          status?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "devices_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["id"];
          },
        ];
      };
      medical_history: {
        Row: {
          condition: string;
          created_at: string | null;
          diagnosed_date: string | null;
          id: string;
          notes: string | null;
          patient_id: string | null;
          status: Database["public"]["Enums"]["medical_status"] | null;
        };
        Insert: {
          condition: string;
          created_at?: string | null;
          diagnosed_date?: string | null;
          id?: string;
          notes?: string | null;
          patient_id?: string | null;
          status?: Database["public"]["Enums"]["medical_status"] | null;
        };
        Update: {
          condition?: string;
          created_at?: string | null;
          diagnosed_date?: string | null;
          id?: string;
          notes?: string | null;
          patient_id?: string | null;
          status?: Database["public"]["Enums"]["medical_status"] | null;
        };
        Relationships: [
          {
            foreignKeyName: "medical_history_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["id"];
          },
        ];
      };
      medications: {
        Row: {
          created_at: string | null;
          dosage: string | null;
          frequency: string | null;
          id: string;
          name: string;
          patient_id: string | null;
          prescribed_by: string | null;
          prescribed_date: string | null;
          status: Database["public"]["Enums"]["medication_status"] | null;
        };
        Insert: {
          created_at?: string | null;
          dosage?: string | null;
          frequency?: string | null;
          id?: string;
          name: string;
          patient_id?: string | null;
          prescribed_by?: string | null;
          prescribed_date?: string | null;
          status?: Database["public"]["Enums"]["medication_status"] | null;
        };
        Update: {
          created_at?: string | null;
          dosage?: string | null;
          frequency?: string | null;
          id?: string;
          name?: string;
          patient_id?: string | null;
          prescribed_by?: string | null;
          prescribed_date?: string | null;
          status?: Database["public"]["Enums"]["medication_status"] | null;
        };
        Relationships: [
          {
            foreignKeyName: "medications_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["id"];
          },
        ];
      };
      patients: {
        Row: {
          admission_date: string | null;
          age: number;
          assigned_nurse: string | null;
          attending_physician: string | null;
          bed_number: string | null;
          blood_type: string | null;
          care_plan: string | null;
          condition: Database["public"]["Enums"]["condition_status"] | null;
          contact_info: Json | null;
          created_at: string | null;
          date_of_birth: string;
          gender: string;
          id: string;
          insurance: string | null;
          name: string;
          room_location: string | null;
          updated_at: string | null;
        };
        Insert: {
          admission_date?: string | null;
          age: number;
          assigned_nurse?: string | null;
          attending_physician?: string | null;
          bed_number?: string | null;
          blood_type?: string | null;
          care_plan?: string | null;
          condition?: Database["public"]["Enums"]["condition_status"] | null;
          contact_info?: Json | null;
          created_at?: string | null;
          date_of_birth: string;
          gender: string;
          id?: string;
          insurance?: string | null;
          name: string;
          room_location?: string | null;
          updated_at?: string | null;
        };
        Update: {
          admission_date?: string | null;
          age?: number;
          assigned_nurse?: string | null;
          attending_physician?: string | null;
          bed_number?: string | null;
          blood_type?: string | null;
          care_plan?: string | null;
          condition?: Database["public"]["Enums"]["condition_status"] | null;
          contact_info?: Json | null;
          created_at?: string | null;
          date_of_birth?: string;
          gender?: string;
          id?: string;
          insurance?: string | null;
          name?: string;
          room_location?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "patients_room_location_fkey";
            columns: ["room_location"];
            isOneToOne: false;
            referencedRelation: "rooms";
            referencedColumns: ["room_number"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string | null;
          id: string;
          role: Database["public"]["Enums"]["profile_role"] | null;
        };
        Insert: {
          created_at?: string | null;
          id: string;
          role?: Database["public"]["Enums"]["profile_role"] | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          role?: Database["public"]["Enums"]["profile_role"] | null;
        };
        Relationships: [];
      };
      readings: {
        Row: {
          body_temp: number | null;
          created_at: string | null;
          device_id: string | null;
          heart_rate: number | null;
          id: string;
          patient_id: string | null;
          spo2: number | null;
          timestamp: string | null;
        };
        Insert: {
          body_temp?: number | null;
          created_at?: string | null;
          device_id?: string | null;
          heart_rate?: number | null;
          id?: string;
          patient_id?: string | null;
          spo2?: number | null;
          timestamp?: string | null;
        };
        Update: {
          body_temp?: number | null;
          created_at?: string | null;
          device_id?: string | null;
          heart_rate?: number | null;
          id?: string;
          patient_id?: string | null;
          spo2?: number | null;
          timestamp?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "readings_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["id"];
          },
        ];
      };
      rooms: {
        Row: {
          created_at: string | null;
          id: string;
          room_number: string;
          status: Database["public"]["Enums"]["room_status"];
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          room_number: string;
          status?: Database["public"]["Enums"]["room_status"];
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          room_number?: string;
          status?: Database["public"]["Enums"]["room_status"];
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      allergy_severity: "mild" | "moderate" | "severe";
      condition_status: "normal" | "warning" | "critical";
      medical_status: "active" | "resolved" | "chronic";
      medication_status: "active" | "discontinued";
      profile_role: "doctor" | "admin" | "nurse";
      room_status: "available" | "disabled" | "maintenance" | "occupied";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      allergy_severity: ["mild", "moderate", "severe"],
      condition_status: ["normal", "warning", "critical"],
      medical_status: ["active", "resolved", "chronic"],
      medication_status: ["active", "discontinued"],
      profile_role: ["doctor", "admin", "nurse"],
      room_status: ["available", "disabled", "maintenance", "occupied"],
    },
  },
} as const;
