export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      accounts: {
        Row: {
          id: string
          name: string
          email: string
          is_personal_account: boolean
          primary_owner_user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          is_personal_account?: boolean
          primary_owner_user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          is_personal_account?: boolean
          primary_owner_user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          category: string
          venue_id: string | null
          start_datetime: string
          end_datetime: string | null
          price_min: number
          price_max: number
          capacity: number | null
          status: string
          visibility: string
          image_url: string | null
          organizer_id: string
          community_id: string | null
          account_id: string
          slug: string
          timezone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category: string
          venue_id?: string | null
          start_datetime: string
          end_datetime?: string | null
          price_min?: number
          price_max?: number
          capacity?: number | null
          status?: string
          visibility?: string
          image_url?: string | null
          organizer_id: string
          community_id?: string | null
          account_id: string
          slug: string
          timezone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category?: string
          venue_id?: string | null
          start_datetime?: string
          end_datetime?: string | null
          price_min?: number
          price_max?: number
          capacity?: number | null
          status?: string
          visibility?: string
          image_url?: string | null
          organizer_id?: string
          community_id?: string | null
          account_id?: string
          slug?: string
          timezone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      venues: {
        Row: {
          id: string
          name: string
          address: string
          city: string
          state: string
          capacity: number | null
          amenities: string[]
          price_range: string | null
          rating: number | null
          image_url: string | null
          description: string | null
          contact_phone: string | null
          contact_email: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          city: string
          state: string
          capacity?: number | null
          amenities?: string[]
          price_range?: string | null
          rating?: number | null
          image_url?: string | null
          description?: string | null
          contact_phone?: string | null
          contact_email?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          city?: string
          state?: string
          capacity?: number | null
          amenities?: string[]
          price_range?: string | null
          rating?: number | null
          image_url?: string | null
          description?: string | null
          contact_phone?: string | null
          contact_email?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          user_id: string
          name: string
          email: string
          user_type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          name: string
          email: string
          user_type: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          name?: string
          email?: string
          user_type?: string
          created_at?: string
          updated_at?: string
        }
      }
      roles: {
        Row: {
          name: string
          hierarchy_level: number
        }
        Insert: {
          name: string
          hierarchy_level: number
        }
        Update: {
          name?: string
          hierarchy_level?: number
        }
      }
      role_permissions: {
        Row: {
          role: string
          permission: string
        }
        Insert: {
          role: string
          permission: string
        }
        Update: {
          role?: string
          permission?: string
        }
      }
      accounts_memberships: {
        Row: {
          user_id: string
          account_id: string
          account_role: string
          created_at: string
        }
        Insert: {
          user_id: string
          account_id: string
          account_role: string
          created_at?: string
        }
        Update: {
          user_id?: string
          account_id?: string
          account_role?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"])
  ? (Database["public"]["Tables"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
