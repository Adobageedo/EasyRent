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
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string | null
          avatar_url: string | null
          phone_number: string | null
          company_name: string | null
          role: string
          is_admin: boolean
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          phone_number?: string | null
          company_name?: string | null
          role?: string
          is_admin?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          phone_number?: string | null
          company_name?: string | null
          role?: string
          is_admin?: boolean
        }
      },
      properties: {
        Row: {
          id: string
          created_at: string
          name: string
          address: string
          type: string
          rooms: number
          bathrooms: number
          area: string
          status: string
          rent_amount: number
          images: string[]
          description: string | null
          amenities: string[]
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          address: string
          type: string
          rooms: number
          bathrooms: number
          area: string
          status?: string
          rent_amount: number
          images?: string[]
          description?: string | null
          amenities?: string[]
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          address?: string
          type?: string
          rooms?: number
          bathrooms?: number
          area?: string
          status?: string
          rent_amount?: number
          images?: string[]
          description?: string | null
          amenities?: string[]
          user_id?: string
        }
      },
      tenants: {
        Row: {
          id: string
          created_at: string
          first_name: string
          last_name: string
          email: string
          phone: string
          status: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          first_name: string
          last_name: string
          email: string
          phone: string
          status?: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          status?: string
          user_id?: string
        }
      },
      leases: {
        Row: {
          id: string
          created_at: string
          property_id: string
          tenant_id: string
          start_date: string
          end_date: string
          rent_amount: number
          deposit_amount: number
          status: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          property_id: string
          tenant_id: string
          start_date: string
          end_date: string
          rent_amount: number
          deposit_amount: number
          status?: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          property_id?: string
          tenant_id?: string
          start_date?: string
          end_date?: string
          rent_amount?: number
          deposit_amount?: number
          status?: string
          user_id?: string
        }
      },
      maintenance_requests: {
        Row: {
          id: string
          created_at: string
          property_id: string
          description: string
          priority: string
          status: string
          assigned_to: string | null
          estimated_cost: number | null
          actual_cost: number | null
          completion_date: string | null
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          property_id: string
          description: string
          priority: string
          status?: string
          assigned_to?: string | null
          estimated_cost?: number | null
          actual_cost?: number | null
          completion_date?: string | null
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          property_id?: string
          description?: string
          priority?: string
          status?: string
          assigned_to?: string | null
          estimated_cost?: number | null
          actual_cost?: number | null
          completion_date?: string | null
          user_id?: string
        }
      },
      transactions: {
        Row: {
          id: string
          created_at: string
          property_id: string
          lease_id: string | null
          maintenance_id: string | null
          type: string
          amount: number
          description: string
          date: string
          status: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          property_id: string
          lease_id?: string | null
          maintenance_id?: string | null
          type: string
          amount: number
          description: string
          date: string
          status?: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          property_id?: string
          lease_id?: string | null
          maintenance_id?: string | null
          type?: string
          amount?: number
          description?: string
          date?: string
          status?: string
          user_id?: string
        }
      },
      inspections: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          completed_at: string | null
          user_id: string
          lease_id: string
          type: 'move_in' | 'move_out'
          status: 'pending' | 'completed'
          notes: string | null
          photos: string[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          completed_at?: string | null
          user_id: string
          lease_id: string
          type: 'move_in' | 'move_out'
          status?: 'pending' | 'completed'
          notes?: string | null
          photos?: string[] | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          completed_at?: string | null
          user_id?: string
          lease_id?: string
          type?: 'move_in' | 'move_out'
          status?: 'pending' | 'completed'
          notes?: string | null
          photos?: string[] | null
        }
      },
      rooms: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          inspection_id: string
          name: string
          condition: 'Good' | 'Fair' | 'Needs Repair' | 'Not Applicable'
          notes: string | null
          photos: string[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          inspection_id: string
          name: string
          condition?: 'Good' | 'Fair' | 'Needs Repair' | 'Not Applicable'
          notes?: string | null
          photos?: string[] | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          inspection_id?: string
          name?: string
          condition?: 'Good' | 'Fair' | 'Needs Repair' | 'Not Applicable'
          notes?: string | null
          photos?: string[] | null
        }
      },
      signatures: {
        Row: {
          id: string
          created_at: string
          inspection_id: string
          tenant_signature: string
          landlord_signature: string
        }
        Insert: {
          id?: string
          created_at?: string
          inspection_id: string
          tenant_signature: string
          landlord_signature: string
        }
        Update: {
          id?: string
          created_at?: string
          inspection_id?: string
          tenant_signature?: string
          landlord_signature?: string
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
