export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      block_order_preferences: {
        Row: {
          block_id: string
          client_token_id: string
          display_order: number
          id: string
        }
        Insert: {
          block_id: string
          client_token_id: string
          display_order: number
          id?: string
        }
        Update: {
          block_id?: string
          client_token_id?: string
          display_order?: number
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "block_order_preferences_block_id_fkey"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "playlist_blocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "block_order_preferences_client_token_id_fkey"
            columns: ["client_token_id"]
            isOneToOne: false
            referencedRelation: "client_tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      client_tokens: {
        Row: {
          client_name: string
          created_at: string | null
          id: string
          proposal_id: string | null
          token: string
        }
        Insert: {
          client_name: string
          created_at?: string | null
          id?: string
          proposal_id?: string | null
          token: string
        }
        Update: {
          client_name?: string
          created_at?: string | null
          id?: string
          proposal_id?: string | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_tokens_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      dj_playlist_links: {
        Row: {
          client_token_id: string
          created_at: string | null
          id: string
          name: string | null
          spotify_url: string
        }
        Insert: {
          client_token_id: string
          created_at?: string | null
          id?: string
          name?: string | null
          spotify_url: string
        }
        Update: {
          client_token_id?: string
          created_at?: string | null
          id?: string
          name?: string | null
          spotify_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "dj_playlist_links_client_token_id_fkey"
            columns: ["client_token_id"]
            isOneToOne: false
            referencedRelation: "client_tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      playlist_blocks: {
        Row: {
          created_at: string | null
          display_order: number
          id: string
          name: string
          proposal_id: string | null
        }
        Insert: {
          created_at?: string | null
          display_order: number
          id?: string
          name: string
          proposal_id?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number
          id?: string
          name?: string
          proposal_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "playlist_blocks_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      playlist_songs: {
        Row: {
          artist: string | null
          block_id: string
          created_at: string | null
          display_order: number
          id: string
          proposal_id: string | null
          title: string
        }
        Insert: {
          artist?: string | null
          block_id: string
          created_at?: string | null
          display_order: number
          id?: string
          proposal_id?: string | null
          title: string
        }
        Update: {
          artist?: string | null
          block_id?: string
          created_at?: string | null
          display_order?: number
          id?: string
          proposal_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "playlist_songs_block_id_fkey"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "playlist_blocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_songs_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      proposal_audit_log: {
        Row: {
          action: string
          actor_name: string | null
          actor_type: string
          changes: Json | null
          created_at: string
          id: string
          proposal_id: string
        }
        Insert: {
          action: string
          actor_name?: string | null
          actor_type?: string
          changes?: Json | null
          created_at?: string
          id?: string
          proposal_id: string
        }
        Update: {
          action?: string
          actor_name?: string | null
          actor_type?: string
          changes?: Json | null
          created_at?: string
          id?: string
          proposal_id?: string
        }
        Relationships: []
      }
      proposals: {
        Row: {
          accepted_at: string | null
          accepted_extras: Json | null
          accepted_notes: string | null
          accepted_payment_method: string | null
          accepted_payment_types: string[] | null
          accepted_plan: Json | null
          audio_url: string | null
          bride_name: string
          client_email: string | null
          client_instagram: string | null
          client_phone: string | null
          contract_file_url: string | null
          contract_status: string | null
          contract_value: number | null
          created_at: string | null
          created_by: string | null
          duration_label: string | null
          event_date: string
          event_end_time: string
          event_start_time: string
          event_timeline: Json
          extras_bundle_price: number | null
          extras_bundle_title: string | null
          groom_name: string
          guest_count: number
          id: string
          included_services: Json
          last_viewed_at: string | null
          notes: string | null
          optional_extras: Json
          partnership_instagram: string | null
          partnership_name: string | null
          partnership_photo_url: string | null
          payment_receipts: Json | null
          pricing_plans: Json
          process_steps: Json
          proposal_deadline: string | null
          showcase_songs: Json
          slug: string
          status: string
          tech_details: Json
          updated_at: string | null
          venue_name: string
          view_count: number | null
          whatsapp_number: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_extras?: Json | null
          accepted_notes?: string | null
          accepted_payment_method?: string | null
          accepted_payment_types?: string[] | null
          accepted_plan?: Json | null
          audio_url?: string | null
          bride_name: string
          client_email?: string | null
          client_instagram?: string | null
          client_phone?: string | null
          contract_file_url?: string | null
          contract_status?: string | null
          contract_value?: number | null
          created_at?: string | null
          created_by?: string | null
          duration_label?: string | null
          event_date: string
          event_end_time?: string
          event_start_time?: string
          event_timeline?: Json
          extras_bundle_price?: number | null
          extras_bundle_title?: string | null
          groom_name: string
          guest_count?: number
          id?: string
          included_services?: Json
          last_viewed_at?: string | null
          notes?: string | null
          optional_extras?: Json
          partnership_instagram?: string | null
          partnership_name?: string | null
          partnership_photo_url?: string | null
          payment_receipts?: Json | null
          pricing_plans?: Json
          process_steps?: Json
          proposal_deadline?: string | null
          showcase_songs?: Json
          slug: string
          status?: string
          tech_details?: Json
          updated_at?: string | null
          venue_name: string
          view_count?: number | null
          whatsapp_number?: string
        }
        Update: {
          accepted_at?: string | null
          accepted_extras?: Json | null
          accepted_notes?: string | null
          accepted_payment_method?: string | null
          accepted_payment_types?: string[] | null
          accepted_plan?: Json | null
          audio_url?: string | null
          bride_name?: string
          client_email?: string | null
          client_instagram?: string | null
          client_phone?: string | null
          contract_file_url?: string | null
          contract_status?: string | null
          contract_value?: number | null
          created_at?: string | null
          created_by?: string | null
          duration_label?: string | null
          event_date?: string
          event_end_time?: string
          event_start_time?: string
          event_timeline?: Json
          extras_bundle_price?: number | null
          extras_bundle_title?: string | null
          groom_name?: string
          guest_count?: number
          id?: string
          included_services?: Json
          last_viewed_at?: string | null
          notes?: string | null
          optional_extras?: Json
          partnership_instagram?: string | null
          partnership_name?: string | null
          partnership_photo_url?: string | null
          payment_receipts?: Json | null
          pricing_plans?: Json
          process_steps?: Json
          proposal_deadline?: string | null
          showcase_songs?: Json
          slug?: string
          status?: string
          tech_details?: Json
          updated_at?: string | null
          venue_name?: string
          view_count?: number | null
          whatsapp_number?: string
        }
        Relationships: []
      }
      song_preferences: {
        Row: {
          client_token_id: string
          id: string
          song_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          client_token_id: string
          id?: string
          song_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          client_token_id?: string
          id?: string
          song_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "song_preferences_client_token_id_fkey"
            columns: ["client_token_id"]
            isOneToOne: false
            referencedRelation: "client_tokens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "song_preferences_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "playlist_songs"
            referencedColumns: ["id"]
          },
        ]
      }
      song_suggestions: {
        Row: {
          artist: string | null
          client_token_id: string
          created_at: string | null
          id: string
          notes: string | null
          title: string
        }
        Insert: {
          artist?: string | null
          client_token_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          title: string
        }
        Update: {
          artist?: string | null
          client_token_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "song_suggestions_client_token_id_fkey"
            columns: ["client_token_id"]
            isOneToOne: false
            referencedRelation: "client_tokens"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_view_count: {
        Args: { proposal_slug: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
