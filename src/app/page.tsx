'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { toast } from 'sonner'
import { Hamburger, ArrowLeft } from 'lucide-react'
import OrderList from './components/order-list'
import OrderModal from './components/order-modal'
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

type OrderItem = {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price_cents: number
  subtotal_cents: number
  product?: { name: string }
}

export type OrderWithItems = {
  id: string
  customer_name: string
  customer_phone: string
  delivery_address?: string | null
  payment_method: string
  total_cents: number
  notes?: string | null
  status: string
  delivery_lat?: number | null
  delivery_lng?: number | null
  items: OrderItem[]
}

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  accepted: 'Aceito',
  preparing: 'Preparando',
  out_for_delivery: 'Saiu para entrega',
  delivered: 'Entregue',
  rejected: 'Rejeitado',
  cancelled: 'Cancelado',
}

export function formatPrice(cents: number) {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null)
  const [updating, setUpdating] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const previousOrderIdsRef = useRef<Set<string>>(new Set())
  const notificationSoundRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    notificationSoundRef.current = new Audio('/notify.mp3')
  }, [])

  useEffect(() => {
    let isMounted = true

    const fetchOrders = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, product:products(name))')
        .order('created_at', { ascending: false })

      if (error) {
        toast.error('Erro ao carregar pedidos')
        setOrders([])
        setLoading(false)
        return
      }

      // Monta cada pedido com seus items
      const ordersWithItems: OrderWithItems[] = (data as any[])
        .map((order) => {
          if (!order.order_items) return null // ignora pedidos sem items
          return {
            id: order.id,
            customer_name: order.customer_name,
            customer_phone: order.customer_phone,
            delivery_address: order.delivery_address ?? null,
            payment_method: order.payment_method,
            total_cents: order.total_cents,
            notes: order.notes ?? null,
            status: order.status,
            delivery_lat: order.delivery_lat ?? null,
            delivery_lng: order.delivery_lng ?? null,
            items: order.order_items.map((item: any) => ({
              id: item.id,
              order_id: item.order_id,
              product_id: item.product_id,
              quantity: item.quantity,
              unit_price_cents: item.unit_price_cents,
              subtotal_cents: item.subtotal_cents,
              product: item.product ?? undefined,
            })),
          }
        })
        .filter(Boolean) as OrderWithItems[]

      previousOrderIdsRef.current = new Set(ordersWithItems.map(o => o.id))
      setOrders(ordersWithItems)
      setLoading(false)
    }

    fetchOrders()

    const channel = supabase
      .channel('public:orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload: RealtimePostgresChangesPayload<Record<string, any>>) => {
          if (!isMounted || !payload.new) return

          const newOrderRaw = payload.new as Record<string, any>
          const newOrder: OrderWithItems = {
            id: newOrderRaw.id,
            customer_name: newOrderRaw.customer_name,
            customer_phone: newOrderRaw.customer_phone,
            delivery_address: newOrderRaw.delivery_address ?? null,
            payment_method: newOrderRaw.payment_method,
            total_cents: newOrderRaw.total_cents,
            notes: newOrderRaw.notes ?? null,
            status: newOrderRaw.status,
            delivery_lat: newOrderRaw.delivery_lat ?? null,
            delivery_lng: newOrderRaw.delivery_lng ?? null,
            items: (newOrderRaw.order_items ?? []).map((item: any) => ({
              id: item.id,
              order_id: item.order_id,
              product_id: item.product_id,
              quantity: item.quantity,
              unit_price_cents: item.unit_price_cents,
              subtotal_cents: item.subtotal_cents,
              product: item.product ?? undefined,
            })),
          }

          setOrders((prevOrders) => {
            const exists = prevOrders.find(o => o.id === newOrder.id)
            if (exists) {
              return prevOrders.map(o => (o.id === newOrder.id ? newOrder : o))
            } else {
              previousOrderIdsRef.current.add(newOrder.id)
              if (notificationSoundRef.current) {
                notificationSoundRef.current.play().catch(() => { })
              }
              return [newOrder, ...prevOrders]
            }
          })
        }
      )
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdating(true)
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId)

    if (error) {
      toast.error('Erro ao atualizar status')
    } else {
      toast.success('Status atualizado!')
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
      )
      if (selectedOrder?.id === orderId) setSelectedOrder(null)
    }

    setUpdating(false)
  }

  const filteredOrders = orders.filter((o) =>
    statusFilter === 'all' ? true : o.status === statusFilter
  )

  const sortedOrders = [
    ...filteredOrders.filter(
      (o) => o.status !== 'delivered' && o.status !== 'cancelled' && o.status !== 'rejected'
    ),
    ...filteredOrders.filter(
      (o) => o.status === 'delivered' || o.status === 'cancelled' || o.status === 'rejected'
    ),
  ]

  return (
    <div className="min-h-screen bg-[#18181b] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-row flex-wrap items-center gap-2 mb-8">
          <button
            onClick={() => window.history.back()}
            className="text-[#cc9b3b] hover:text-[#b88b30] transition focus:outline-none"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#cc9b3b] break-words">
            Administração de Pedidos
          </h1>
        </div>

        {/* FILTRO DE STATUS */}
        <div className="mb-4">
          <label className="mr-2">Filtrar por status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1a1a1a] text-white p-1 rounded-full border border-white"
          >
            <option value="all">Todos</option>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <OrderList
          loading={loading}
          orders={sortedOrders}
          onSelectOrder={setSelectedOrder}
        />
      </div>

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          updating={updating}
          updateOrderStatus={updateOrderStatus}
        />
      )}
    </div>
  )
}
