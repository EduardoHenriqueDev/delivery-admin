export interface Customer {
  id: string
  name: string
  phone: string
  address?: string | null
  total_orders: number
  total_spent: number
  lat?: number | null
  lng?: number | null
}

export interface Order {
  id: string
  total_cents: number
  status: string
  created_at: string
  delivery_address?: string | null
}
