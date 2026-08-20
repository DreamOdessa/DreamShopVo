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
      bug_reports: {
        Row: {
          comment: string
          created_at: string
          element_info: Json | null
          id: string
          screenshot_object_key: string | null
          status: Database["public"]["Enums"]["bug_status"]
          updated_at: string
          url: string
          user_agent: string | null
          user_id: string
          viewport_height: number
          viewport_width: number
          x_percent: number
          y_percent: number
        }
        Insert: {
          comment: string
          created_at?: string
          element_info?: Json | null
          id?: string
          screenshot_object_key?: string | null
          status?: Database["public"]["Enums"]["bug_status"]
          updated_at?: string
          url: string
          user_agent?: string | null
          user_id: string
          viewport_height: number
          viewport_width: number
          x_percent: number
          y_percent: number
        }
        Update: {
          comment?: string
          created_at?: string
          element_info?: Json | null
          id?: string
          screenshot_object_key?: string | null
          status?: Database["public"]["Enums"]["bug_status"]
          updated_at?: string
          url?: string
          user_agent?: string | null
          user_id?: string
          viewport_height?: number
          viewport_width?: number
          x_percent?: number
          y_percent?: number
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          is_active: boolean
          legacy_id: string | null
          name: string
          parent_id: string | null
          show_in_showcase: boolean
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          is_active?: boolean
          legacy_id?: string | null
          name: string
          parent_id?: string | null
          show_in_showcase?: boolean
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          is_active?: boolean
          legacy_id?: string | null
          name?: string
          parent_id?: string | null
          show_in_showcase?: boolean
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      category_media: {
        Row: {
          alt_text: string
          category_id: string
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["media_kind"]
          mime_type: string
          object_key: string
          sort_order: number
        }
        Insert: {
          alt_text?: string
          category_id: string
          created_at?: string
          id?: string
          kind: Database["public"]["Enums"]["media_kind"]
          mime_type: string
          object_key: string
          sort_order?: number
        }
        Update: {
          alt_text?: string
          category_id?: string
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["media_kind"]
          mime_type?: string
          object_key?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "category_media_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_addresses: {
        Row: {
          city: string
          created_at: string
          delivery_details: string
          delivery_method: Database["public"]["Enums"]["delivery_method"]
          establishment_name: string | null
          first_name: string
          id: string
          is_default: boolean
          is_private_person: boolean
          label: string
          last_name: string
          phone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          city: string
          created_at?: string
          delivery_details: string
          delivery_method: Database["public"]["Enums"]["delivery_method"]
          establishment_name?: string | null
          first_name: string
          id?: string
          is_default?: boolean
          is_private_person?: boolean
          label?: string
          last_name: string
          phone: string
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string
          created_at?: string
          delivery_details?: string
          delivery_method?: Database["public"]["Enums"]["delivery_method"]
          establishment_name?: string | null
          first_name?: string
          id?: string
          is_default?: boolean
          is_private_person?: boolean
          label?: string
          last_name?: string
          phone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      integration_outbox: {
        Row: {
          aggregate_id: string | null
          attempts: number
          available_at: string
          created_at: string
          event_type: string
          id: number
          last_error: string | null
          payload: Json
          processed_at: string | null
        }
        Insert: {
          aggregate_id?: string | null
          attempts?: number
          available_at?: string
          created_at?: string
          event_type: string
          id?: never
          last_error?: string | null
          payload?: Json
          processed_at?: string | null
        }
        Update: {
          aggregate_id?: string | null
          attempts?: number
          available_at?: string
          created_at?: string
          event_type?: string
          id?: never
          last_error?: string | null
          payload?: Json
          processed_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          data: Json
          id: string
          order_id: string | null
          product_id: string | null
          read_at: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          data?: Json
          id?: string
          order_id?: string | null
          product_id?: string | null
          read_at?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          data?: Json
          id?: string
          order_id?: string | null
          product_id?: string | null
          read_at?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          line_total: number | null
          order_id: string
          product_id: string | null
          product_image_object_key: string | null
          product_name: string
          product_slug: string | null
          quantity: number
          unit_price: number
        }
        Insert: {
          id?: string
          line_total?: number | null
          order_id: string
          product_id?: string | null
          product_image_object_key?: string | null
          product_name: string
          product_slug?: string | null
          quantity: number
          unit_price: number
        }
        Update: {
          id?: string
          line_total?: number | null
          order_id?: string
          product_id?: string | null
          product_image_object_key?: string | null
          product_name?: string
          product_slug?: string | null
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: number
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: never
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: never
          order_id?: string
          status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          checkout_token: string | null
          contact_for_clarification: boolean
          created_at: string
          currency: string
          customer_first_name: string
          customer_last_name: string
          customer_note: string | null
          customer_phone: string
          delivery_amount: number
          delivery_city: string
          delivery_details: string
          delivery_method: Database["public"]["Enums"]["delivery_method"]
          discount_amount: number
          establishment_name: string | null
          id: string
          inventory_reserved: boolean
          is_private_person: boolean
          order_number: number
          payment_method: Database["public"]["Enums"]["payment_method"]
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          tracking_number: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          checkout_token?: string | null
          contact_for_clarification?: boolean
          created_at?: string
          currency?: string
          customer_first_name: string
          customer_last_name: string
          customer_note?: string | null
          customer_phone: string
          delivery_amount?: number
          delivery_city: string
          delivery_details: string
          delivery_method: Database["public"]["Enums"]["delivery_method"]
          discount_amount?: number
          establishment_name?: string | null
          id?: string
          inventory_reserved?: boolean
          is_private_person?: boolean
          order_number?: number
          payment_method: Database["public"]["Enums"]["payment_method"]
          status?: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          checkout_token?: string | null
          contact_for_clarification?: boolean
          created_at?: string
          currency?: string
          customer_first_name?: string
          customer_last_name?: string
          customer_note?: string | null
          customer_phone?: string
          delivery_amount?: number
          delivery_city?: string
          delivery_details?: string
          delivery_method?: Database["public"]["Enums"]["delivery_method"]
          discount_amount?: number
          establishment_name?: string | null
          id?: string
          inventory_reserved?: boolean
          is_private_person?: boolean
          order_number?: number
          payment_method?: Database["public"]["Enums"]["payment_method"]
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          total?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      product_media: {
        Row: {
          alt_text: string
          created_at: string
          height: number | null
          id: string
          kind: Database["public"]["Enums"]["media_kind"]
          mime_type: string
          object_key: string
          product_id: string
          size_bytes: number | null
          sort_order: number
          width: number | null
        }
        Insert: {
          alt_text?: string
          created_at?: string
          height?: number | null
          id?: string
          kind: Database["public"]["Enums"]["media_kind"]
          mime_type: string
          object_key: string
          product_id: string
          size_bytes?: number | null
          sort_order?: number
          width?: number | null
        }
        Update: {
          alt_text?: string
          created_at?: string
          height?: number | null
          id?: string
          kind?: Database["public"]["Enums"]["media_kind"]
          mime_type?: string
          object_key?: string
          product_id?: string
          size_bytes?: number | null
          sort_order?: number
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_media_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_views: {
        Row: {
          product_id: string
          updated_at: string
          view_count: number
          view_date: string
        }
        Insert: {
          product_id: string
          updated_at?: string
          view_count?: number
          view_date?: string
        }
        Update: {
          product_id?: string
          updated_at?: string
          view_count?: number
          view_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_views_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string
          created_at: string
          description: string
          id: string
          in_stock: boolean
          ingredients: string[]
          is_active: boolean
          is_popular: boolean
          legacy_id: string | null
          name: string
          organic: boolean
          original_price: number | null
          price: number
          slug: string
          sort_order: number
          stock_quantity: number | null
          subcategory_id: string | null
          updated_at: string
          weight: string | null
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string
          id?: string
          in_stock?: boolean
          ingredients?: string[]
          is_active?: boolean
          is_popular?: boolean
          legacy_id?: string | null
          name: string
          organic?: boolean
          original_price?: number | null
          price: number
          slug: string
          sort_order?: number
          stock_quantity?: number | null
          subcategory_id?: string | null
          updated_at?: string
          weight?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string
          id?: string
          in_stock?: boolean
          ingredients?: string[]
          is_active?: boolean
          is_popular?: boolean
          legacy_id?: string | null
          name?: string
          organic?: boolean
          original_price?: number | null
          price?: number
          slug?: string
          sort_order?: number
          stock_quantity?: number | null
          subcategory_id?: string | null
          updated_at?: string
          weight?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_subcategory_id_fkey"
            columns: ["subcategory_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          contact_phone: string | null
          created_at: string
          discount_percent: number
          email: string | null
          first_name: string
          id: string
          last_name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          contact_phone?: string | null
          created_at?: string
          discount_percent?: number
          email?: string | null
          first_name?: string
          id: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          contact_phone?: string | null
          created_at?: string
          discount_percent?: number
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          is_public: boolean
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          is_public?: boolean
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          is_public?: boolean
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      telegram_registration_challenges: {
        Row: {
          consumed_at: string | null
          created_at: string
          expires_at: string
          id: string
          phone: string
          telegram_chat_id: number
          telegram_user_id: number
          token_hash: string
        }
        Insert: {
          consumed_at?: string | null
          created_at?: string
          expires_at: string
          id?: string
          phone: string
          telegram_chat_id: number
          telegram_user_id: number
          token_hash: string
        }
        Update: {
          consumed_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          phone?: string
          telegram_chat_id?: number
          telegram_user_id?: number
          token_hash?: string
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          created_at: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cancel_own_order: {
        Args: { p_order_id: string }
        Returns: {
          order_id: string
          order_number: number
          status: Database["public"]["Enums"]["order_status"]
        }[]
      }
      claim_integration_events: {
        Args: { p_event_type: string; p_limit?: number }
        Returns: {
          aggregate_id: string
          attempts: number
          id: number
        }[]
      }
      consume_telegram_registration_challenge: {
        Args: { p_token_hash: string }
        Returns: {
          challenge_id: string
          phone: string
          telegram_chat_id: number
          telegram_user_id: number
        }[]
      }
      create_order: {
        Args: {
          p_checkout_token: string
          p_contact_for_clarification: boolean
          p_customer_first_name: string
          p_customer_last_name: string
          p_customer_note: string
          p_customer_phone: string
          p_delivery_city: string
          p_delivery_details: string
          p_delivery_method: Database["public"]["Enums"]["delivery_method"]
          p_establishment_name: string
          p_is_private_person: boolean
          p_items: Json
          p_payment_method: Database["public"]["Enums"]["payment_method"]
        }
        Returns: {
          order_id: string
          order_number: number
          total: number
        }[]
      }
      create_telegram_registration_challenge: {
        Args: {
          p_expires_at: string
          p_phone: string
          p_telegram_chat_id: number
          p_telegram_user_id: number
          p_token_hash: string
        }
        Returns: string
      }
      ensure_my_profile: { Args: never; Returns: undefined }
      get_admin_customer_summary: {
        Args: { p_user_id: string }
        Returns: {
          delivered_order_count: number
          delivered_total: number
          discount_total: number
          last_order_at: string
          order_count: number
        }[]
      }
      get_admin_dashboard_summary: {
        Args: never
        Returns: {
          customer_count: number
          low_stock_count: number
          orders_30d_count: number
          out_of_stock_count: number
          pending_order_count: number
          processing_order_count: number
          revenue_30d: number
        }[]
      }
      get_admin_failed_integration_events: {
        Args: { p_limit?: number }
        Returns: {
          aggregate_id: string
          attempts: number
          created_at: string
          event_type: string
          id: number
          last_error: string
        }[]
      }
      get_admin_integration_summary: {
        Args: never
        Returns: {
          failed_count: number
          oldest_pending_at: string
          pending_count: number
          processed_24h_count: number
          retrying_count: number
        }[]
      }
      get_admin_order_status_counts: {
        Args: { p_search?: string; p_since?: string }
        Returns: {
          order_count: number
          status: Database["public"]["Enums"]["order_status"]
        }[]
      }
      get_admin_order_summary: {
        Args: {
          p_search?: string
          p_since?: string
          p_status?: Database["public"]["Enums"]["order_status"]
        }
        Returns: {
          order_count: number
          order_total: number
        }[]
      }
      is_admin: { Args: never; Returns: boolean }
      is_staff: { Args: never; Returns: boolean }
      retry_admin_integration_event: {
        Args: { p_event_id: number }
        Returns: boolean
      }
      save_default_checkout_address: {
        Args: {
          p_city: string
          p_delivery_details: string
          p_delivery_method: Database["public"]["Enums"]["delivery_method"]
          p_establishment_name: string
          p_first_name: string
          p_is_private_person: boolean
          p_last_name: string
          p_phone: string
        }
        Returns: string
      }
      set_customer_discount: {
        Args: { p_discount_percent: number; p_user_id: string }
        Returns: number
      }
      set_product_stock: {
        Args: {
          p_expected_stock?: number
          p_new_stock?: number
          p_product_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "customer" | "tester" | "admin"
      bug_status: "new" | "in_progress" | "resolved" | "rejected"
      delivery_method: "post_office" | "address" | "schedule" | "taxi"
      media_kind: "main" | "hover" | "gallery" | "cover" | "showcase"
      notification_type:
        | "new_product"
        | "new_order"
        | "order_status_update"
        | "promo"
        | "system"
      order_status:
        | "pending"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
      payment_method:
        | "cash_on_delivery"
        | "card_online"
        | "card_on_delivery"
        | "bank_transfer"
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
    Enums: {
      app_role: ["customer", "tester", "admin"],
      bug_status: ["new", "in_progress", "resolved", "rejected"],
      delivery_method: ["post_office", "address", "schedule", "taxi"],
      media_kind: ["main", "hover", "gallery", "cover", "showcase"],
      notification_type: [
        "new_product",
        "new_order",
        "order_status_update",
        "promo",
        "system",
      ],
      order_status: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      payment_method: [
        "cash_on_delivery",
        "card_online",
        "card_on_delivery",
        "bank_transfer",
      ],
    },
  },
} as const
