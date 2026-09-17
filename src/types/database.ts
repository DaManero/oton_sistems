export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "owner" | "manager" | "barista" | "waiter";
export type OrderType = "dine_in" | "takeaway" | "delivery";
export type OrderStatus =
  | "pending"
  | "in_progress"
  | "ready"
  | "delivered"
  | "cancelled";
export type PaymentMethod = "cash" | "card" | "qr" | "transfer";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: UserRole;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: UserRole;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          role?: UserRole;
          active?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          sort_order: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          sort_order?: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          sort_order?: number;
          active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          description: string | null;
          base_price: number;
          image_url: string | null;
          available: boolean;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          description?: string | null;
          base_price: number;
          image_url?: string | null;
          available?: boolean;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          category_id?: string;
          name?: string;
          description?: string | null;
          base_price?: number;
          image_url?: string | null;
          available?: boolean;
          active?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          price_delta: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          name: string;
          price_delta?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          product_id?: string;
          name?: string;
          price_delta?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      modifiers: {
        Row: {
          id: string;
          name: string;
          price_delta: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          price_delta?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          price_delta?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      product_modifiers: {
        Row: {
          id: string;
          product_id: string;
          modifier_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          modifier_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          product_id?: string;
          modifier_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_modifiers_modifier_id_fkey";
            columns: ["modifier_id"];
            isOneToOne: false;
            referencedRelation: "modifiers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_modifiers_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      tables: {
        Row: {
          id: string;
          name: string;
          capacity: number;
          qr_code: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          capacity?: number;
          qr_code?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          capacity?: number;
          qr_code?: string | null;
          active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      cash_sessions: {
        Row: {
          id: string;
          opened_by: string;
          closed_by: string | null;
          opened_at: string;
          closed_at: string | null;
          opening_amount: number;
          closing_amount: number | null;
          expected_amount: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          opened_by: string;
          closed_by?: string | null;
          opened_at?: string;
          closed_at?: string | null;
          opening_amount?: number;
          closing_amount?: number | null;
          expected_amount?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          closed_by?: string | null;
          opened_at?: string;
          closed_at?: string | null;
          opening_amount?: number;
          closing_amount?: number | null;
          expected_amount?: number | null;
          notes?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cash_sessions_closed_by_fkey";
            columns: ["closed_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cash_sessions_opened_by_fkey";
            columns: ["opened_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          table_id: string | null;
          type: OrderType;
          status: OrderStatus;
          created_by: string;
          cash_session_id: string;
          customer_name: string | null;
          notes: string | null;
          subtotal: number;
          discount: number;
          total: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number?: string;
          table_id?: string | null;
          type?: OrderType;
          status?: OrderStatus;
          created_by: string;
          cash_session_id: string;
          customer_name?: string | null;
          notes?: string | null;
          subtotal?: number;
          discount?: number;
          total?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          order_number?: string;
          table_id?: string | null;
          type?: OrderType;
          status?: OrderStatus;
          cash_session_id?: string;
          customer_name?: string | null;
          notes?: string | null;
          subtotal?: number;
          discount?: number;
          total?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_cash_session_id_fkey";
            columns: ["cash_session_id"];
            isOneToOne: false;
            referencedRelation: "cash_sessions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_table_id_fkey";
            columns: ["table_id"];
            isOneToOne: false;
            referencedRelation: "tables";
            referencedColumns: ["id"];
          },
        ];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          variant_id: string | null;
          quantity: number;
          unit_price: number;
          notes: string | null;
          status: OrderStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          variant_id?: string | null;
          quantity?: number;
          unit_price: number;
          notes?: string | null;
          status?: OrderStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          product_id?: string;
          variant_id?: string | null;
          quantity?: number;
          unit_price?: number;
          notes?: string | null;
          status?: OrderStatus;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_variant_id_fkey";
            columns: ["variant_id"];
            isOneToOne: false;
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          },
        ];
      };
      order_item_modifiers: {
        Row: {
          id: string;
          order_item_id: string;
          modifier_id: string;
          price_delta: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_item_id: string;
          modifier_id: string;
          price_delta?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          order_item_id?: string;
          modifier_id?: string;
          price_delta?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_item_modifiers_modifier_id_fkey";
            columns: ["modifier_id"];
            isOneToOne: false;
            referencedRelation: "modifiers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_item_modifiers_order_item_id_fkey";
            columns: ["order_item_id"];
            isOneToOne: false;
            referencedRelation: "order_items";
            referencedColumns: ["id"];
          },
        ];
      };
      payments: {
        Row: {
          id: string;
          order_id: string;
          method: PaymentMethod;
          amount: number;
          paid_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          method: PaymentMethod;
          amount: number;
          paid_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          method?: PaymentMethod;
          amount?: number;
          paid_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      order_status: OrderStatus;
      order_type: OrderType;
      payment_method: PaymentMethod;
      user_role: UserRole;
    };
    CompositeTypes: Record<string, never>;
  };
}
