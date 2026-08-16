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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_user: {
        Row: {
          created_at: string
          display_name: string
          email: string
          id: string
          role: Database["public"]["Enums"]["admin_role"]
        }
        Insert: {
          created_at?: string
          display_name?: string
          email: string
          id: string
          role?: Database["public"]["Enums"]["admin_role"]
        }
        Update: {
          created_at?: string
          display_name?: string
          email?: string
          id?: string
          role?: Database["public"]["Enums"]["admin_role"]
        }
        Relationships: []
      }
      blog_post: {
        Row: {
          author_name: string | null
          content_en: string
          content_mn: string
          cover_image_url: string | null
          created_at: string
          excerpt_en: string
          excerpt_mn: string
          id: string
          is_published: boolean
          published_at: string | null
          seo_description_en: string
          seo_description_mn: string
          seo_title_en: string
          seo_title_mn: string
          slug: string
          title_en: string
          title_mn: string
          updated_at: string
        }
        Insert: {
          author_name?: string | null
          content_en?: string
          content_mn?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt_en?: string
          excerpt_mn?: string
          id?: string
          is_published?: boolean
          published_at?: string | null
          seo_description_en?: string
          seo_description_mn?: string
          seo_title_en?: string
          seo_title_mn?: string
          slug: string
          title_en?: string
          title_mn: string
          updated_at?: string
        }
        Update: {
          author_name?: string | null
          content_en?: string
          content_mn?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt_en?: string
          excerpt_mn?: string
          id?: string
          is_published?: boolean
          published_at?: string | null
          seo_description_en?: string
          seo_description_mn?: string
          seo_title_en?: string
          seo_title_mn?: string
          slug?: string
          title_en?: string
          title_mn?: string
          updated_at?: string
        }
        Relationships: []
      }
      business_info: {
        Row: {
          about_story_en: string
          about_story_mn: string
          currency_code: string
          currency_symbol: string
          description_en: string
          description_mn: string
          facebook_url: string
          google_review_url: string
          id: number
          instagram_url: string
          logo_url: string
          name: string
          phone: string
          showcase_enabled: boolean
          tiktok_url: string
          updated_at: string
        }
        Insert: {
          about_story_en?: string
          about_story_mn?: string
          currency_code?: string
          currency_symbol?: string
          description_en?: string
          description_mn?: string
          facebook_url?: string
          google_review_url?: string
          id?: number
          instagram_url?: string
          logo_url?: string
          name?: string
          phone?: string
          showcase_enabled?: boolean
          tiktok_url?: string
          updated_at?: string
        }
        Update: {
          about_story_en?: string
          about_story_mn?: string
          currency_code?: string
          currency_symbol?: string
          description_en?: string
          description_mn?: string
          facebook_url?: string
          google_review_url?: string
          id?: number
          instagram_url?: string
          logo_url?: string
          name?: string
          phone?: string
          showcase_enabled?: boolean
          tiktok_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      category: {
        Row: {
          created_at: string
          description_en: string
          description_mn: string
          id: string
          image_url: string
          is_active: boolean
          name_en: string
          name_mn: string
          parent_id: string | null
          seo_desc_en: string
          seo_desc_mn: string
          seo_title_en: string
          seo_title_mn: string
          slug_en: string | null
          slug_mn: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_en?: string
          description_mn?: string
          id?: string
          image_url?: string
          is_active?: boolean
          name_en?: string
          name_mn: string
          parent_id?: string | null
          seo_desc_en?: string
          seo_desc_mn?: string
          seo_title_en?: string
          seo_title_mn?: string
          slug_en?: string | null
          slug_mn: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_en?: string
          description_mn?: string
          id?: string
          image_url?: string
          is_active?: boolean
          name_en?: string
          name_mn?: string
          parent_id?: string | null
          seo_desc_en?: string
          seo_desc_mn?: string
          seo_title_en?: string
          seo_title_mn?: string
          slug_en?: string | null
          slug_mn?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_inquiry: {
        Row: {
          created_at: string
          handled: boolean
          id: string
          message: string
          name: string
          phone: string
        }
        Insert: {
          created_at?: string
          handled?: boolean
          id?: string
          message: string
          name: string
          phone: string
        }
        Update: {
          created_at?: string
          handled?: boolean
          id?: string
          message?: string
          name?: string
          phone?: string
        }
        Relationships: []
      }
      faq: {
        Row: {
          answer_en: string
          answer_mn: string
          category: string
          created_at: string
          id: string
          is_active: boolean
          question_en: string
          question_mn: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer_en?: string
          answer_mn: string
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          question_en?: string
          question_mn: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer_en?: string
          answer_mn?: string
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          question_en?: string
          question_mn?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      product: {
        Row: {
          age_max_months: number | null
          age_min_months: number | null
          available_for_pickup: boolean
          barcode: string | null
          brand: string
          category_id: string | null
          compare_at_price: number | null
          country_of_origin: string
          created_at: string
          currency_code: string
          description_en: string
          description_mn: string
          dimensions: string
          features_en: Json
          features_mn: Json
          id: string
          is_best_seller: boolean
          is_demo: boolean
          is_featured: boolean
          is_new_arrival: boolean
          is_on_sale: boolean
          is_published: boolean
          low_stock_threshold: number
          manufacturer: string
          materials_en: string
          materials_mn: string
          name_en: string
          name_mn: string
          price: number
          safety_info_en: string
          safety_info_mn: string
          seo_desc_en: string
          seo_desc_mn: string
          seo_title_en: string
          seo_title_mn: string
          short_desc_en: string
          short_desc_mn: string
          sku: string
          slug_en: string | null
          slug_mn: string
          stock_quantity: number
          stock_status: Database["public"]["Enums"]["stock_status"]
          tags: string[]
          updated_at: string
          weight_grams: number | null
          whats_included_en: string
          whats_included_mn: string
        }
        Insert: {
          age_max_months?: number | null
          age_min_months?: number | null
          available_for_pickup?: boolean
          barcode?: string | null
          brand?: string
          category_id?: string | null
          compare_at_price?: number | null
          country_of_origin?: string
          created_at?: string
          currency_code?: string
          description_en?: string
          description_mn?: string
          dimensions?: string
          features_en?: Json
          features_mn?: Json
          id?: string
          is_best_seller?: boolean
          is_demo?: boolean
          is_featured?: boolean
          is_new_arrival?: boolean
          is_on_sale?: boolean
          is_published?: boolean
          low_stock_threshold?: number
          manufacturer?: string
          materials_en?: string
          materials_mn?: string
          name_en?: string
          name_mn: string
          price: number
          safety_info_en?: string
          safety_info_mn?: string
          seo_desc_en?: string
          seo_desc_mn?: string
          seo_title_en?: string
          seo_title_mn?: string
          short_desc_en?: string
          short_desc_mn?: string
          sku: string
          slug_en?: string | null
          slug_mn: string
          stock_quantity?: number
          stock_status?: Database["public"]["Enums"]["stock_status"]
          tags?: string[]
          updated_at?: string
          weight_grams?: number | null
          whats_included_en?: string
          whats_included_mn?: string
        }
        Update: {
          age_max_months?: number | null
          age_min_months?: number | null
          available_for_pickup?: boolean
          barcode?: string | null
          brand?: string
          category_id?: string | null
          compare_at_price?: number | null
          country_of_origin?: string
          created_at?: string
          currency_code?: string
          description_en?: string
          description_mn?: string
          dimensions?: string
          features_en?: Json
          features_mn?: Json
          id?: string
          is_best_seller?: boolean
          is_demo?: boolean
          is_featured?: boolean
          is_new_arrival?: boolean
          is_on_sale?: boolean
          is_published?: boolean
          low_stock_threshold?: number
          manufacturer?: string
          materials_en?: string
          materials_mn?: string
          name_en?: string
          name_mn?: string
          price?: number
          safety_info_en?: string
          safety_info_mn?: string
          seo_desc_en?: string
          seo_desc_mn?: string
          seo_title_en?: string
          seo_title_mn?: string
          short_desc_en?: string
          short_desc_mn?: string
          sku?: string
          slug_en?: string | null
          slug_mn?: string
          stock_quantity?: number
          stock_status?: Database["public"]["Enums"]["stock_status"]
          tags?: string[]
          updated_at?: string
          weight_grams?: number | null
          whats_included_en?: string
          whats_included_mn?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["id"]
          },
        ]
      }
      product_image: {
        Row: {
          alt_text_en: string
          alt_text_mn: string
          id: string
          is_primary: boolean
          product_id: string
          sort_order: number
          url: string
        }
        Insert: {
          alt_text_en?: string
          alt_text_mn?: string
          id?: string
          is_primary?: boolean
          product_id: string
          sort_order?: number
          url: string
        }
        Update: {
          alt_text_en?: string
          alt_text_mn?: string
          id?: string
          is_primary?: boolean
          product_id?: string
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_image_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
        ]
      }
      product_relation: {
        Row: {
          from_product_id: string
          id: string
          to_product_id: string
          type: Database["public"]["Enums"]["product_relation_type"]
        }
        Insert: {
          from_product_id: string
          id?: string
          to_product_id: string
          type?: Database["public"]["Enums"]["product_relation_type"]
        }
        Update: {
          from_product_id?: string
          id?: string
          to_product_id?: string
          type?: Database["public"]["Enums"]["product_relation_type"]
        }
        Relationships: [
          {
            foreignKeyName: "product_relation_from_product_id_fkey"
            columns: ["from_product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_relation_to_product_id_fkey"
            columns: ["to_product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
        ]
      }
      product_review: {
        Row: {
          created_at: string
          customer_name: string
          id: string
          is_approved: boolean
          photo_url: string | null
          product_id: string
          rating: number
          review_text: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          id?: string
          is_approved?: boolean
          photo_url?: string | null
          product_id: string
          rating: number
          review_text?: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          id?: string
          is_approved?: boolean
          photo_url?: string | null
          product_id?: string
          rating?: number
          review_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_review_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_redirect: {
        Row: {
          created_at: string
          from_path: string
          id: string
          status_code: number
          to_path: string
        }
        Insert: {
          created_at?: string
          from_path: string
          id?: string
          status_code?: number
          to_path: string
        }
        Update: {
          created_at?: string
          from_path?: string
          id?: string
          status_code?: number
          to_path?: string
        }
        Relationships: []
      }
      store_location: {
        Row: {
          address: string
          address_mn: string
          city: string
          created_at: string
          district: string
          google_maps_embed_url: string
          hours: Json
          id: string
          image_url: string
          is_active: boolean
          is_primary: boolean
          latitude: number | null
          longitude: number | null
          name_en: string
          name_mn: string
          phone: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          address?: string
          address_mn?: string
          city?: string
          created_at?: string
          district?: string
          google_maps_embed_url?: string
          hours?: Json
          id?: string
          image_url?: string
          is_active?: boolean
          is_primary?: boolean
          latitude?: number | null
          longitude?: number | null
          name_en?: string
          name_mn: string
          phone?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          address?: string
          address_mn?: string
          city?: string
          created_at?: string
          district?: string
          google_maps_embed_url?: string
          hours?: Json
          id?: string
          image_url?: string
          is_active?: boolean
          is_primary?: boolean
          latitude?: number | null
          longitude?: number | null
          name_en?: string
          name_mn?: string
          phone?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      admin_role: "OWNER" | "STAFF"
      product_relation_type: "RELATED" | "RECOMMENDED" | "FREQUENTLY_BOUGHT"
      stock_status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "PREORDER"
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
      admin_role: ["OWNER", "STAFF"],
      product_relation_type: ["RELATED", "RECOMMENDED", "FREQUENTLY_BOUGHT"],
      stock_status: ["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK", "PREORDER"],
    },
  },
} as const
