export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          start_datetime: string
          end_datetime: string
          venue_id: string | null
          organizer_id: string | null
          category: string | null
          ticket_price: number | null
          price_min: number | null
          price_max: number | null
          is_free: boolean
          status: string
          created_at: string
          updated_at: string
          image_url: string | null
          highlights: string[] | null
          amenities: string[] | null
          age_restriction: string | null
          ticket_url: string | null
          series_id: string | null
          series_name: string | null
          max_capacity: number | null
          current_attendees: number | null
          city: string | null
          location_name: string | null
          location_address: string | null
          location: Json | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          start_datetime: string
          end_datetime: string
          venue_id?: string | null
          organizer_id?: string | null
          category?: string | null
          ticket_price?: number | null
          price_min?: number | null
          price_max?: number | null
          is_free?: boolean
          status?: string
          created_at?: string
          updated_at?: string
          image_url?: string | null
          highlights?: string[] | null
          amenities?: string[] | null
          age_restriction?: string | null
          ticket_url?: string | null
          series_id?: string | null
          series_name?: string | null
          max_capacity?: number | null
          current_attendees?: number | null
          city?: string | null
          location_name?: string | null
          location_address?: string | null
          location?: Json | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          start_datetime?: string
          end_datetime?: string
          venue_id?: string | null
          organizer_id?: string | null
          category?: string | null
          ticket_price?: number | null
          price_min?: number | null
          price_max?: number | null
          is_free?: boolean
          status?: string
          created_at?: string
          updated_at?: string
          image_url?: string | null
          highlights?: string[] | null
          amenities?: string[] | null
          age_restriction?: string | null
          ticket_url?: string | null
          series_id?: string | null
          series_name?: string | null
          max_capacity?: number | null
          current_attendees?: number | null
          city?: string | null
          location_name?: string | null
          location_address?: string | null
          location?: Json | null
        }
        Relationships: []
      }
      venues: {
        Row: {
          id: string
          name: string
          description: string | null
          address: string | null
          city: string | null
          state: string | null
          latitude: number | null
          longitude: number | null
          capacity: number | null
          price_per_hour: number | null
          base_hourly_rate: number | null
          amenities: string[] | null
          is_active: boolean
          created_at: string
          updated_at: string
          image_url: string | null
          profile_image_url: string | null
          venue_type: string | null
          rating: number | null
          review_count: number | null
          is_verified: boolean | null
          gallery_images: string[] | null
          floor_plans: string[] | null
          virtual_tour_url: string | null
          rules_and_restrictions: string | null
          operating_hours: Json | null
          blackout_dates: Json | null
          minimum_notice_hours: number | null
          parking_info: Json | null
          transit_options: Json | null
          nearby_amenities: Json | null
          rentable_amenities: Json | null
          minimum_booking_hours: number | null
          deposit_percentage: number | null
          cancellation_policy: string | null
          insurance_required: boolean | null
          security_deposit: number | null
          seated_capacity: number | null
          cocktail_capacity: number | null
          total_events: number | null
          occupancy_rate: number | null
          repeat_booking_rate: number | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          latitude?: number | null
          longitude?: number | null
          capacity?: number | null
          price_per_hour?: number | null
          base_hourly_rate?: number | null
          amenities?: string[] | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          image_url?: string | null
          profile_image_url?: string | null
          venue_type?: string | null
          rating?: number | null
          review_count?: number | null
          is_verified?: boolean | null
          gallery_images?: string[] | null
          floor_plans?: string[] | null
          virtual_tour_url?: string | null
          rules_and_restrictions?: string | null
          operating_hours?: Json | null
          blackout_dates?: Json | null
          minimum_notice_hours?: number | null
          parking_info?: Json | null
          transit_options?: Json | null
          nearby_amenities?: Json | null
          rentable_amenities?: Json | null
          minimum_booking_hours?: number | null
          deposit_percentage?: number | null
          cancellation_policy?: string | null
          insurance_required?: boolean | null
          security_deposit?: number | null
          seated_capacity?: number | null
          cocktail_capacity?: number | null
          total_events?: number | null
          occupancy_rate?: number | null
          repeat_booking_rate?: number | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          latitude?: number | null
          longitude?: number | null
          capacity?: number | null
          price_per_hour?: number | null
          base_hourly_rate?: number | null
          amenities?: string[] | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          image_url?: string | null
          profile_image_url?: string | null
          venue_type?: string | null
          rating?: number | null
          review_count?: number | null
          is_verified?: boolean | null
          gallery_images?: string[] | null
          floor_plans?: string[] | null
          virtual_tour_url?: string | null
          rules_and_restrictions?: string | null
          operating_hours?: Json | null
          blackout_dates?: Json | null
          minimum_notice_hours?: number | null
          parking_info?: Json | null
          transit_options?: Json | null
          nearby_amenities?: Json | null
          rentable_amenities?: Json | null
          minimum_booking_hours?: number | null
          deposit_percentage?: number | null
          cancellation_policy?: string | null
          insurance_required?: boolean | null
          security_deposit?: number | null
          seated_capacity?: number | null
          cocktail_capacity?: number | null
          total_events?: number | null
          occupancy_rate?: number | null
          repeat_booking_rate?: number | null
        }
        Relationships: []
      }
      performers: {
        Row: {
          id: string
          name: string
          stage_name: string | null
          bio: string | null
          category: string | null
          genres: string[] | null
          instruments: string[] | null
          profile_image_url: string | null
          image_url: string | null
          base_rate: number | null
          is_verified: boolean
          is_available: boolean
          created_at: string
          updated_at: string
          rating: number | null
          total_performances: number | null
          social_media: Json | null
          media_gallery: Json | null
          technical_requirements: string | null
          availability: Json | null
          min_booking_hours: number | null
          max_travel_distance: number | null
          setup_time_required: number | null
          equipment_provided: boolean | null
          insurance_coverage: boolean | null
          years_experience: number | null
          repeat_booking_rate: number | null
          monthly_bookings: number | null
          average_response_time: string | null
        }
        Insert: {
          id?: string
          name: string
          stage_name?: string | null
          bio?: string | null
          category?: string | null
          genres?: string[] | null
          instruments?: string[] | null
          profile_image_url?: string | null
          image_url?: string | null
          base_rate?: number | null
          is_verified?: boolean
          is_available?: boolean
          created_at?: string
          updated_at?: string
          rating?: number | null
          total_performances?: number | null
          social_media?: Json | null
          media_gallery?: Json | null
          technical_requirements?: string | null
          availability?: Json | null
          min_booking_hours?: number | null
          max_travel_distance?: number | null
          setup_time_required?: number | null
          equipment_provided?: boolean | null
          insurance_coverage?: boolean | null
          years_experience?: number | null
          repeat_booking_rate?: number | null
          monthly_bookings?: number | null
          average_response_time?: string | null
        }
        Update: {
          id?: string
          name?: string
          stage_name?: string | null
          bio?: string | null
          category?: string | null
          genres?: string[] | null
          instruments?: string[] | null
          profile_image_url?: string | null
          image_url?: string | null
          base_rate?: number | null
          is_verified?: boolean
          is_available?: boolean
          created_at?: string
          updated_at?: string
          rating?: number | null
          total_performances?: number | null
          social_media?: Json | null
          media_gallery?: Json | null
          technical_requirements?: string | null
          availability?: Json | null
          min_booking_hours?: number | null
          max_travel_distance?: number | null
          setup_time_required?: number | null
          equipment_provided?: boolean | null
          insurance_coverage?: boolean | null
          years_experience?: number | null
          repeat_booking_rate?: number | null
          monthly_bookings?: number | null
          average_response_time?: string | null
        }
        Relationships: []
      }
      event_performers: {
        Row: {
          id: string
          event_id: string
          performer_id: string
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          performer_id: string
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          performer_id?: string
          created_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          id: string
          event_id: string | null
          venue_id: string | null
          performer_id: string | null
          account_id: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id?: string | null
          venue_id?: string | null
          performer_id?: string | null
          account_id: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string | null
          venue_id?: string | null
          performer_id?: string | null
          account_id?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      performer_reviews: {
        Row: {
          id: string
          performer_id: string
          rating: number
          title: string | null
          content: string | null
          created_at: string
          reviewer_name: string | null
          event_id: string | null
          is_verified: boolean
        }
        Insert: {
          id?: string
          performer_id: string
          rating: number
          title?: string | null
          content?: string | null
          created_at?: string
          reviewer_name?: string | null
          event_id?: string | null
          is_verified?: boolean
        }
        Update: {
          id?: string
          performer_id?: string
          rating?: number
          title?: string | null
          content?: string | null
          created_at?: string
          reviewer_name?: string | null
          event_id?: string | null
          is_verified?: boolean
        }
        Relationships: []
      }
      venue_reviews: {
        Row: {
          id: string
          venue_id: string
          rating: number
          title: string | null
          content: string | null
          created_at: string
          reviewer_name: string | null
          event_id: string | null
          is_verified: boolean
        }
        Insert: {
          id?: string
          venue_id: string
          rating: number
          title?: string | null
          content?: string | null
          created_at?: string
          reviewer_name?: string | null
          event_id?: string | null
          is_verified?: boolean
        }
        Update: {
          id?: string
          venue_id?: string
          rating?: number
          title?: string | null
          content?: string | null
          created_at?: string
          reviewer_name?: string | null
          event_id?: string | null
          is_verified?: boolean
        }
        Relationships: []
      }
      accounts: {
        Row: {
          id: string
          name: string
          email: string | null
          picture_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          picture_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          picture_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_permissions: string
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
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