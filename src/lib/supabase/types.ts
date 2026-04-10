// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.4'
  }
  public: {
    Tables: {
      engineering_feedback: {
        Row: {
          created_at: string | null
          engineer_id: string
          feedback_type: string
          id: string
          message: string | null
          quote_id: string
        }
        Insert: {
          created_at?: string | null
          engineer_id: string
          feedback_type: string
          id?: string
          message?: string | null
          quote_id: string
        }
        Update: {
          created_at?: string | null
          engineer_id?: string
          feedback_type?: string
          id?: string
          message?: string | null
          quote_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'engineering_feedback_quote_id_fkey'
            columns: ['quote_id']
            isOneToOne: false
            referencedRelation: 'quotes'
            referencedColumns: ['id']
          },
        ]
      }
      quote_engineering_status: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          deadline: string | null
          engineer_notes: string | null
          id: string
          priority: string | null
          quote_id: string
          sales_notes: string | null
          start_date: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          deadline?: string | null
          engineer_notes?: string | null
          id?: string
          priority?: string | null
          quote_id: string
          sales_notes?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          deadline?: string | null
          engineer_notes?: string | null
          id?: string
          priority?: string | null
          quote_id?: string
          sales_notes?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'quote_engineering_status_quote_id_fkey'
            columns: ['quote_id']
            isOneToOne: true
            referencedRelation: 'quotes'
            referencedColumns: ['id']
          },
        ]
      }
      quote_status_history: {
        Row: {
          changed_by: string | null
          created_at: string | null
          id: string
          new_status: string
          previous_status: string | null
          quote_id: string
          reason: string | null
        }
        Insert: {
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_status: string
          previous_status?: string | null
          quote_id: string
          reason?: string | null
        }
        Update: {
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_status?: string
          previous_status?: string | null
          quote_id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'quote_status_history_quote_id_fkey'
            columns: ['quote_id']
            isOneToOne: false
            referencedRelation: 'quotes'
            referencedColumns: ['id']
          },
        ]
      }
      quotes: {
        Row: {
          clickup_task_id: string | null
          client_cnpj: string | null
          client_name: string | null
          created_at: string | null
          data: Json | null
          engineering_deadline: string | null
          id: string
          order_number: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          clickup_task_id?: string | null
          client_cnpj?: string | null
          client_name?: string | null
          created_at?: string | null
          data?: Json | null
          engineering_deadline?: string | null
          id?: string
          order_number: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          clickup_task_id?: string | null
          client_cnpj?: string | null
          client_name?: string | null
          created_at?: string | null
          data?: Json | null
          engineering_deadline?: string | null
          id?: string
          order_number?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      engineering_workload: {
        Row: {
          active_projects: number | null
          assigned_to: string | null
          furthest_deadline: string | null
          oldest_project: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: engineering_feedback
//   id: uuid (not null, default: gen_random_uuid())
//   quote_id: uuid (not null)
//   engineer_id: uuid (not null)
//   feedback_type: text (not null)
//   message: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: engineering_workload
//   assigned_to: uuid (nullable)
//   active_projects: bigint (nullable)
//   oldest_project: timestamp with time zone (nullable)
//   furthest_deadline: timestamp with time zone (nullable)
// Table: quote_engineering_status
//   id: uuid (not null, default: gen_random_uuid())
//   quote_id: uuid (not null)
//   status: text (not null, default: 'briefing'::text)
//   assigned_to: uuid (nullable)
//   priority: text (nullable, default: 'normal'::text)
//   deadline: timestamp with time zone (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   engineer_notes: text (nullable)
//   sales_notes: text (nullable)
//   start_date: timestamp with time zone (nullable)
// Table: quote_status_history
//   id: uuid (not null, default: gen_random_uuid())
//   quote_id: uuid (not null)
//   previous_status: text (nullable)
//   new_status: text (not null)
//   changed_by: uuid (nullable)
//   reason: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: quotes
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (nullable)
//   order_number: text (not null)
//   client_cnpj: text (nullable)
//   client_name: text (nullable)
//   status: text (nullable, default: 'briefing'::text)
//   clickup_task_id: text (nullable)
//   engineering_deadline: timestamp with time zone (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   data: jsonb (nullable)

// --- CONSTRAINTS ---
// Table: engineering_feedback
//   FOREIGN KEY engineering_feedback_engineer_id_fkey: FOREIGN KEY (engineer_id) REFERENCES auth.users(id)
//   PRIMARY KEY engineering_feedback_pkey: PRIMARY KEY (id)
//   FOREIGN KEY engineering_feedback_quote_id_fkey: FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE
// Table: quote_engineering_status
//   FOREIGN KEY quote_engineering_status_assigned_to_fkey: FOREIGN KEY (assigned_to) REFERENCES auth.users(id)
//   PRIMARY KEY quote_engineering_status_pkey: PRIMARY KEY (id)
//   FOREIGN KEY quote_engineering_status_quote_id_fkey: FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE
//   UNIQUE quote_engineering_status_quote_id_key: UNIQUE (quote_id)
// Table: quote_status_history
//   FOREIGN KEY quote_status_history_changed_by_fkey: FOREIGN KEY (changed_by) REFERENCES auth.users(id)
//   PRIMARY KEY quote_status_history_pkey: PRIMARY KEY (id)
//   FOREIGN KEY quote_status_history_quote_id_fkey: FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE
// Table: quotes
//   PRIMARY KEY quotes_pkey: PRIMARY KEY (id)
//   FOREIGN KEY quotes_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: engineering_feedback
//   Policy "Acesso total para usuários autenticados feedback" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
//   Policy "Admin vê feedbacks" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'::text)
// Table: quote_engineering_status
//   Policy "Acesso total para usuários autenticados" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
//   Policy "Admin vê tudo" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'::text)
// Table: quote_status_history
//   Policy "Acesso total para usuários autenticados historico" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: quotes
//   Policy "Acesso total para usuários autenticados" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true

// --- INDEXES ---
// Table: quote_engineering_status
//   CREATE UNIQUE INDEX quote_engineering_status_quote_id_key ON public.quote_engineering_status USING btree (quote_id)
