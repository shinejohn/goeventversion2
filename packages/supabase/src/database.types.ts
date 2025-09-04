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
      accounts: {
        Row: {
          id: string
          primary_owner_user_id: string | null
          name: string
          slug: string | null
          email: string | null
          is_personal_account: boolean
          updated_at: string | null
          created_at: string | null
          created_by: string | null
          updated_by: string | null
          picture_url: string | null
          public_data: Json
          community_id: string | null
          account_type: string | null
        }
        Insert: {
          id?: string
          primary_owner_user_id?: string | null
          name: string
          slug?: string | null
          email?: string | null
          is_personal_account?: boolean
          updated_at?: string | null
          created_at?: string | null
          created_by?: string | null
          updated_by?: string | null
          picture_url?: string | null
          public_data?: Json
          community_id?: string | null
          account_type?: string | null
        }
        Update: {
          id?: string
          primary_owner_user_id?: string | null
          name?: string
          slug?: string | null
          email?: string | null
          is_personal_account?: boolean
          updated_at?: string | null
          created_at?: string | null
          created_by?: string | null
          updated_by?: string | null
          picture_url?: string | null
          public_data?: Json
          community_id?: string | null
          account_type?: string | null
        }
      }
      venues: {
        Row: {
          id: string
          account_id: string | null
          community_id: string
          name: string
          slug: string
          description: string | null
          venueType: string
          address: string
          location: unknown
          location_data: Json | null
          capacity: number | null
          amenities: Json
          images: Json
          operating_hours: Json
          booking_email: string | null
          booking_phone: string | null
          website_url: string | null
          verified: boolean
          verified_at: string | null
          total_events: number | null
          rating: number | null
          reviewCount: number | null
          pricePerHour: number | null
          responseTimeHours: number | null
          distance: number | null
          listedDate: string | null
          lastBookedDaysAgo: number | null
          unavailableDates: Json | null
          created_at: string | null
          updated_at: string | null
          image_url: string | null
          city: string | null
          state: string | null
          country: string | null
          is_active: boolean | null
          contact_email: string | null
        }
        Insert: {
          id?: string
          account_id?: string | null
          community_id: string
          name: string
          slug: string
          description?: string | null
          venueType: string
          address: string
          location: unknown
          location_data?: Json | null
          capacity?: number | null
          amenities?: Json
          images?: Json
          operating_hours?: Json
          booking_email?: string | null
          booking_phone?: string | null
          website_url?: string | null
          verified?: boolean
          verified_at?: string | null
          total_events?: number | null
          rating?: number | null
          reviewCount?: number | null
          pricePerHour?: number | null
          responseTimeHours?: number | null
          distance?: number | null
          listedDate?: string | null
          lastBookedDaysAgo?: number | null
          unavailableDates?: Json | null
          created_at?: string | null
          updated_at?: string | null
          image_url?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          is_active?: boolean | null
          contact_email?: string | null
        }
        Update: {
          id?: string
          account_id?: string | null
          community_id?: string
          name?: string
          slug?: string
          description?: string | null
          venueType?: string
          address?: string
          location?: unknown
          location_data?: Json | null
          capacity?: number | null
          amenities?: Json
          images?: Json
          operating_hours?: Json
          booking_email?: string | null
          booking_phone?: string | null
          website_url?: string | null
          verified?: boolean
          verified_at?: string | null
          total_events?: number | null
          rating?: number | null
          reviewCount?: number | null
          pricePerHour?: number | null
          responseTimeHours?: number | null
          distance?: number | null
          listedDate?: string | null
          lastBookedDaysAgo?: number | null
          unavailableDates?: Json | null
          created_at?: string | null
          updated_at?: string | null
          image_url?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          is_active?: boolean | null
          contact_email?: string | null
        }
      }
      performers: {
        Row: {
          id: string
          name: string
          slug: string
          image: string | null
          bio: string | null
          genres: string[] | null
          home_city: string | null
          years_active: number | null
          shows_played: number | null
          verified: boolean | null
          is_touring_now: boolean | null
          availableForBooking: boolean | null
          has_merchandise: boolean | null
          has_original_music: boolean | null
          offers_meet_and_greet: boolean | null
          takes_requests: boolean | null
          available_for_private_events: boolean | null
          is_family_friendly: boolean | null
          has_samples: boolean | null
          rating: number | null
          reviews: number | null
          follower_count: number | null
          trending_score: number | null
          introductory_pricing: boolean | null
          base_price: number | null
          contact_email: string | null
          contact_phone: string | null
          website_url: string | null
          social_links: Json | null
          category: string | null
          location: string | null
          lastActive: string | null
          responseTime: string | null
          bookingCount: number | null
          upcomingGigs: number | null
          priceRange: string | null
          created_at: string | null
          updated_at: string | null
          added_date: string | null
          account_id: string | null
          stage_name: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          image?: string | null
          bio?: string | null
          genres?: string[] | null
          home_city?: string | null
          years_active?: number | null
          shows_played?: number | null
          verified?: boolean | null
          is_touring_now?: boolean | null
          availableForBooking?: boolean | null
          has_merchandise?: boolean | null
          has_original_music?: boolean | null
          offers_meet_and_greet?: boolean | null
          takes_requests?: boolean | null
          available_for_private_events?: boolean | null
          is_family_friendly?: boolean | null
          has_samples?: boolean | null
          rating?: number | null
          reviews?: number | null
          follower_count?: number | null
          trending_score?: number | null
          introductory_pricing?: boolean | null
          base_price?: number | null
          contact_email?: string | null
          contact_phone?: string | null
          website_url?: string | null
          social_links?: Json | null
          category?: string | null
          location?: string | null
          lastActive?: string | null
          responseTime?: string | null
          bookingCount?: number | null
          upcomingGigs?: number | null
          priceRange?: string | null
          created_at?: string | null
          updated_at?: string | null
          added_date?: string | null
          account_id?: string | null
          stage_name?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          image?: string | null
          bio?: string | null
          genres?: string[] | null
          home_city?: string | null
          years_active?: number | null
          shows_played?: number | null
          verified?: boolean | null
          is_touring_now?: boolean | null
          availableForBooking?: boolean | null
          has_merchandise?: boolean | null
          has_original_music?: boolean | null
          offers_meet_and_greet?: boolean | null
          takes_requests?: boolean | null
          available_for_private_events?: boolean | null
          is_family_friendly?: boolean | null
          has_samples?: boolean | null
          rating?: number | null
          reviews?: number | null
          follower_count?: number | null
          trending_score?: number | null
          introductory_pricing?: boolean | null
          base_price?: number | null
          contact_email?: string | null
          contact_phone?: string | null
          website_url?: string | null
          social_links?: Json | null
          category?: string | null
          location?: string | null
          lastActive?: string | null
          responseTime?: string | null
          bookingCount?: number | null
          upcomingGigs?: number | null
          priceRange?: string | null
          created_at?: string | null
          updated_at?: string | null
          added_date?: string | null
          account_id?: string | null
          stage_name?: string | null
        }
      }
      events: {
        Row: {
          id: string
          community_id: string
          venue_id: string | null
          organizer_id: string
          account_id: string | null
          title: string
          slug: string
          description: string | null
          category: string
          tags: string[] | null
          start_datetime: string
          end_datetime: string
          timezone: string
          recurrence_rule: string | null
          location_name: string | null
          location_address: string | null
          location: unknown | null
          is_virtual: boolean | null
          virtual_url: string | null
          requires_ticket: boolean | null
          ticket_url: string | null
          price_min: number | null
          price_max: number | null
          capacity: number | null
          tickets_sold: number | null
          image: string | null
          images: Json | null
          status: string | null
          visibility: string | null
          meta_description: string | null
          external_url: string | null
          source: string | null
          view_count: number | null
          interested_count: number | null
          share_count: number | null
          date: string | null
          time: string | null
          attendees: number | null
          venue: string | null
          price: string | null
          created_at: string | null
          updated_at: string | null
          published_at: string | null
          weather_condition: string | null
          temperature: number | null
          weather_icon: string | null
          image_url: string | null
          start_date: string | null
          end_date: string | null
          is_public: boolean | null
        }
        Insert: {
          id?: string
          community_id: string
          venue_id?: string | null
          organizer_id: string
          account_id?: string | null
          title: string
          slug: string
          description?: string | null
          category: string
          tags?: string[] | null
          start_datetime: string
          end_datetime: string
          timezone: string
          recurrence_rule?: string | null
          location_name?: string | null
          location_address?: string | null
          location?: unknown | null
          is_virtual?: boolean | null
          virtual_url?: string | null
          requires_ticket?: boolean | null
          ticket_url?: string | null
          price_min?: number | null
          price_max?: number | null
          capacity?: number | null
          tickets_sold?: number | null
          image?: string | null
          images?: Json | null
          status?: string | null
          visibility?: string | null
          meta_description?: string | null
          external_url?: string | null
          source?: string | null
          view_count?: number | null
          interested_count?: number | null
          share_count?: number | null
          date?: string | null
          time?: string | null
          attendees?: number | null
          venue?: string | null
          price?: string | null
          created_at?: string | null
          updated_at?: string | null
          published_at?: string | null
          weather_condition?: string | null
          temperature?: number | null
          weather_icon?: string | null
          image_url?: string | null
          start_date?: string | null
          end_date?: string | null
          is_public?: boolean | null
        }
        Update: {
          id?: string
          community_id?: string
          venue_id?: string | null
          organizer_id?: string
          account_id?: string | null
          title?: string
          slug?: string
          description?: string | null
          category?: string
          tags?: string[] | null
          start_datetime?: string
          end_datetime?: string
          timezone?: string
          recurrence_rule?: string | null
          location_name?: string | null
          location_address?: string | null
          location?: unknown | null
          is_virtual?: boolean | null
          virtual_url?: string | null
          requires_ticket?: boolean | null
          ticket_url?: string | null
          price_min?: number | null
          price_max?: number | null
          capacity?: number | null
          tickets_sold?: number | null
          image?: string | null
          images?: Json | null
          status?: string | null
          visibility?: string | null
          meta_description?: string | null
          external_url?: string | null
          source?: string | null
          view_count?: number | null
          interested_count?: number | null
          share_count?: number | null
          date?: string | null
          time?: string | null
          attendees?: number | null
          venue?: string | null
          price?: string | null
          created_at?: string | null
          updated_at?: string | null
          published_at?: string | null
          weather_condition?: string | null
          temperature?: number | null
          weather_icon?: string | null
          image_url?: string | null
          start_date?: string | null
          end_date?: string | null
          is_public?: boolean | null
        }
      }
      communities: {
        Row: {
          id: string
          name: string
          slug: string
          location: unknown
          city: string
          state: string
          country: string
          timezone: string
          default_radius_miles: number | null
          population: number | null
          description: string | null
          featured_image_url: string | null
          cover_image_url: string | null
          tags: string[] | null
          total_events: number | null
          active_venues: number | null
          active_organizers: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          location: unknown
          city: string
          state: string
          country: string
          timezone: string
          default_radius_miles?: number | null
          population?: number | null
          description?: string | null
          featured_image_url?: string | null
          cover_image_url?: string | null
          tags?: string[] | null
          total_events?: number | null
          active_venues?: number | null
          active_organizers?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          location?: unknown
          city?: string
          state?: string
          country?: string
          timezone?: string
          default_radius_miles?: number | null
          population?: number | null
          description?: string | null
          featured_image_url?: string | null
          cover_image_url?: string | null
          tags?: string[] | null
          total_events?: number | null
          active_venues?: number | null
          active_organizers?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      user_accounts: {
        Row: {
          id: string | null
          name: string | null
          picture_url: string | null
          slug: string | null
          role: string | null
        }
      }
      user_account_workspace: {
        Row: {
          id: string | null
          name: string | null
          picture_url: string | null
          subscription_status: 'active' | 'inactive' | 'cancelled' | 'past_due' | null
        }
      }
    }
    Functions: {}
    Enums: {
      billing_provider_type: 'stripe' | 'paypal'
      notification_type: 'event_reminder' | 'booking_confirmed' | 'message_received' | 'follow_notification'
      notification_channel_type: 'email' | 'push' | 'sms'
      order_status_type: 'pending' | 'processing' | 'completed' | 'cancelled'
      subscription_status_type: 'active' | 'inactive' | 'cancelled' | 'past_due'
      subscription_item_type_type: 'subscription' | 'one_time'
      app_permissions: 'read' | 'write' | 'delete' | 'admin' | 'settings.manage' | 'members.manage' | 'notes.manage'
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]