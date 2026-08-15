// AUTO-GENERATED from Supabase schema via `mcp__Supabase__generate_typescript_types`.
// Regenerate after any schema migration — do not hand-edit.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
      business_info: {
        Row: {
          address: string
          address_mn: string
          city: string
          currency_code: string
          currency_symbol: string
          description_en: string
          description_mn: string
          district: string
          facebook_url: string
          google_maps_embed_url: string
          google_review_url: string
          hours: Json
          id: number
          instagram_url: string
          latitude: number | null
          logo_url: string
          longitude: number | null
          name: string
          phone: string
          tiktok_url: string
          updated_at: string
        }
        Insert: {
          address?: string
          address_mn?: string
          city?: string
          currency_code?: string
          currency_symbol?: string
          description_en?: string
          description_mn?: string
          district?: string
          facebook_url?: string
          google_maps_embed_url?: string
          google_review_url?: string
          hours?: Json
          id?: number
          instagram_url?: string
          latitude?: number | null
          logo_url?: string
          longitude?: number | null
          name?: string
          phone?: string
          tiktok_url?: string
          updated_at?: string
        }
        Update: {
          address?: string
          address_mn?: string
          city?: string
          currency_code?: string
          currency_symbol?: string
          description_en?: string
          description_mn?: string
          district?: string
          facebook_url?: string
          google_maps_embed_url?: string
          google_review_url?: string
          hours?: Json
          id?: number
          instagram_url?: string
          latitude?: number | null
          logo_url?: string
          longitude?: number | null
          name?: string
          phone?: string
          tiktok_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      cart: {
        Row: {
          created_at: string
          id: string
          token: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          token: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          token?: string
          updated_at?: string
        }
        Relationships: []
      }
      cart_item: {
        Row: {
          cart_id: string
          id: string
          product_id: string
          quantity: number
        }
        Insert: {
          cart_id: string
          id?: string
          product_id: string
          quantity?: number
        }
        Update: {
          cart_id?: string
          id?: string
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "cart_item_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "cart"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_item_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
        ]
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
      delivery_settings: {
        Row: {
          base_fee: number
          delivery_enabled: boolean
          estimated_time_en: string
          estimated_time_mn: string
          free_threshold: number | null
          id: number
          payment_methods: Json
          pickup_enabled: boolean
          same_day_enabled: boolean
          updated_at: string
          zones: Json
        }
        Insert: {
          base_fee?: number
          delivery_enabled?: boolean
          estimated_time_en?: string
          estimated_time_mn?: string
          free_threshold?: number | null
          id?: number
          payment_methods?: Json
          pickup_enabled?: boolean
          same_day_enabled?: boolean
          updated_at?: string
          zones?: Json
        }
        Update: {
          base_fee?: number
          delivery_enabled?: boolean
          estimated_time_en?: string
          estimated_time_mn?: string
          free_threshold?: number | null
          id?: number
          payment_methods?: Json
          pickup_enabled?: boolean
          same_day_enabled?: boolean
          updated_at?: string
          zones?: Json
        }
        Relationships: []
      }
      order: {
        Row: {
          address: string | null
          address_details: string | null
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_notes: string | null
          customer_phone: string
          delivery_fee: number
          delivery_method: Database["public"]["Enums"]["delivery_method"]
          discount: number
          district: string | null
          id: string
          internal_notes: string | null
          khoroo: string | null
          order_number: string
          payment_method: string
          payment_ref: string | null
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          updated_at: string
        }
        Insert: {
          address?: string | null
          address_details?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_notes?: string | null
          customer_phone: string
          delivery_fee?: number
          delivery_method: Database["public"]["Enums"]["delivery_method"]
          discount?: number
          district?: string | null
          id?: string
          internal_notes?: string | null
          khoroo?: string | null
          order_number: string
          payment_method: string
          payment_ref?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          updated_at?: string
        }
        Update: {
          address?: string | null
          address_details?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_notes?: string | null
          customer_phone?: string
          delivery_fee?: number
          delivery_method?: Database["public"]["Enums"]["delivery_method"]
          discount?: number
          district?: string | null
          id?: string
          internal_notes?: string | null
          khoroo?: string | null
          order_number?: string
          payment_method?: string
          payment_ref?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          total?: number
          updated_at?: string
        }
        Relationships: []
      }
      order_item: {
        Row: {
          id: string
          line_total: number
          order_id: string
          product_id: string | null
          product_name_en: string
          product_name_mn: string
          quantity: number
          sku: string
          unit_price: number
        }
        Insert: {
          id?: string
          line_total: number
          order_id: string
          product_id?: string | null
          product_name_en?: string
          product_name_mn: string
          quantity: number
          sku: string
          unit_price: number
        }
        Update: {
          id?: string
          line_total?: number
          order_id?: string
          product_id?: string | null
          product_name_en?: string
          product_name_mn?: string
          quantity?: number
          sku?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          created_at: string
          id: string
          note: string | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          order_id?: string
          status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
        ]
      }
      product: {
        Row: {
          age_max_months: number | null
          age_min_months: number | null
          available_for_delivery: boolean
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
          available_for_delivery?: boolean
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
          available_for_delivery?: boolean
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      admin_role: "OWNER" | "STAFF"
      delivery_method: "PICKUP" | "DELIVERY"
      order_status:
        | "PENDING_PAYMENT"
        | "CONFIRMED"
        | "PROCESSING"
        | "READY_FOR_PICKUP"
        | "SHIPPED"
        | "DELIVERED"
        | "CANCELLED"
        | "REFUNDED"
      product_relation_type: "RELATED" | "RECOMMENDED" | "FREQUENTLY_BOUGHT"
      stock_status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "PREORDER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database["public"]

export type Tables<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Row"]
export type TablesInsert<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Update"]
export type Enums<T extends keyof DefaultSchema["Enums"]> =
  DefaultSchema["Enums"][T]
