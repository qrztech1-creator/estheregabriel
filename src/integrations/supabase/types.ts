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
          cover_url: string | null
          created_at: string | null
          display_order: number
          energy: number
          id: string
          proposal_id: string | null
          spotify_url: string | null
          title: string
          youtube_url: string | null
        }
        Insert: {
          artist?: string | null
          block_id: string
          cover_url?: string | null
          created_at?: string | null
          display_order: number
          energy?: number
          id?: string
          proposal_id?: string | null
          spotify_url?: string | null
          title: string
          youtube_url?: string | null
        }
        Update: {
          artist?: string | null
          block_id?: string
          cover_url?: string | null
          created_at?: string | null
          display_order?: number
          energy?: number
          id?: string
          proposal_id?: string | null
          spotify_url?: string | null
          title?: string
          youtube_url?: string | null
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
      proposal_checklist: {
        Row: {
          category: string
          created_at: string
          display_order: number
          id: string
          item: string
          notes: string | null
          proposal_id: string
          quantity: number
          status: string
        }
        Insert: {
          category?: string
          created_at?: string
          display_order?: number
          id?: string
          item: string
          notes?: string | null
          proposal_id: string
          quantity?: number
          status?: string
        }
        Update: {
          category?: string
          created_at?: string
          display_order?: number
          id?: string
          item?: string
          notes?: string | null
          proposal_id?: string
          quantity?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposal_checklist_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      proposal_internal_contracts: {
        Row: {
          closed_by: string | null
          created_at: string
          executed_by: string | null
          id: string
          proposal_id: string
          revenue_split: Json
          technical_lead: string | null
          terms: string | null
          updated_at: string
        }
        Insert: {
          closed_by?: string | null
          created_at?: string
          executed_by?: string | null
          id?: string
          proposal_id: string
          revenue_split?: Json
          technical_lead?: string | null
          terms?: string | null
          updated_at?: string
        }
        Update: {
          closed_by?: string | null
          created_at?: string
          executed_by?: string | null
          id?: string
          proposal_id?: string
          revenue_split?: Json
          technical_lead?: string | null
          terms?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposal_internal_contracts_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: true
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      proposal_package_items: {
        Row: {
          category: string
          created_at: string
          description: string | null
          display_order: number
          id: string
          is_courtesy: boolean
          is_optional: boolean
          media: Json
          name: string
          package_id: string | null
          proposal_id: string
          quantity: number
          unit_cost: number
          unit_price: number
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_courtesy?: boolean
          is_optional?: boolean
          media?: Json
          name: string
          package_id?: string | null
          proposal_id: string
          quantity?: number
          unit_cost?: number
          unit_price?: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_courtesy?: boolean
          is_optional?: boolean
          media?: Json
          name?: string
          package_id?: string | null
          proposal_id?: string
          quantity?: number
          unit_cost?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "proposal_package_items_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "proposal_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposal_package_items_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      proposal_packages: {
        Row: {
          category: string
          created_at: string
          description: string | null
          display_order: number
          id: string
          image_url: string | null
          internal_cost: number
          is_courtesy: boolean
          is_optional: boolean
          media: Json
          name: string
          proposal_id: string
          recommended: boolean
          sale_price: number
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          internal_cost?: number
          is_courtesy?: boolean
          is_optional?: boolean
          media?: Json
          name: string
          proposal_id: string
          recommended?: boolean
          sale_price?: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          internal_cost?: number
          is_courtesy?: boolean
          is_optional?: boolean
          media?: Json
          name?: string
          proposal_id?: string
          recommended?: boolean
          sale_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "proposal_packages_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
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
          event_type: string | null
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
          region: string
          section_order: Json
          sections: Json
          selected_packages: Json
          show_optionals: boolean
          show_partnership: boolean
          showcase_songs: Json
          slug: string
          status: string
          tech_details: Json
          template: string
          theme: Json
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
          event_type?: string | null
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
          region?: string
          section_order?: Json
          sections?: Json
          selected_packages?: Json
          show_optionals?: boolean
          show_partnership?: boolean
          showcase_songs?: Json
          slug: string
          status?: string
          tech_details?: Json
          template?: string
          theme?: Json
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
          event_type?: string | null
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
          region?: string
          section_order?: Json
          sections?: Json
          selected_packages?: Json
          show_optionals?: boolean
          show_partnership?: boolean
          showcase_songs?: Json
          slug?: string
          status?: string
          tech_details?: Json
          template?: string
          theme?: Json
          updated_at?: string | null
          venue_name?: string
          view_count?: number | null
          whatsapp_number?: string
        }
        Relationships: []
      }
      song_order_preferences: {
        Row: {
          client_token_id: string
          display_order: number
          id: string
          song_id: string
        }
        Insert: {
          client_token_id: string
          display_order: number
          id?: string
          song_id: string
        }
        Update: {
          client_token_id?: string
          display_order?: number
          id?: string
          song_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "song_order_preferences_client_token_id_fkey"
            columns: ["client_token_id"]
            isOneToOne: false
            referencedRelation: "client_tokens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "song_order_preferences_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "playlist_songs"
            referencedColumns: ["id"]
          },
        ]
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
      accept_proposal: {
        Args: {
          p_extras: Json
          p_final_value: number
          p_notes: string
          p_payment_method: string
          p_payment_types: string[]
          p_plan: Json
          p_selected_packages?: Json
          p_slug: string
        }
        Returns: boolean
      }
      add_dj_playlist_link: {
        Args: { p_name: string; p_token: string; p_url: string }
        Returns: Json
      }
      add_song_suggestion: {
        Args: {
          p_artist: string
          p_notes: string
          p_title: string
          p_token: string
        }
        Returns: Json
      }
      delete_dj_playlist_link: {
        Args: { p_id: string; p_token: string }
        Returns: boolean
      }
      delete_song_suggestion: {
        Args: { p_id: string; p_token: string }
        Returns: boolean
      }
      get_playlist_session: { Args: { p_token: string }; Returns: Json }
      get_public_proposal: { Args: { p_slug: string }; Returns: Json }
      set_block_orders: {
        Args: { p_orders: Json; p_token: string }
        Returns: boolean
      }
      set_song_orders: {
        Args: { p_orders: Json; p_token: string }
        Returns: boolean
      }
      set_song_preference: {
        Args: { p_song_id: string; p_status: string; p_token: string }
        Returns: boolean
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
