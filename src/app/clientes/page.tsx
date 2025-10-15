'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { toast } from 'sonner'
import { AnimatePresence } from 'framer-motion'
import Drawer from '../../../components/ui/Panel'
import CustomerCard from './components/CustomerCard'
import CustomerModal from './components/CustomerModal'
import type { Customer, Order } from './types'
import { Hamburger } from 'lucide-react'

export default function ClientesPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customerOrders, setCustomerOrders] = useState<Order[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          phone,
          orders (
            id,
            total_cents,
            status,
            created_at,
            delivery_address,
            delivery_lat,
            delivery_lng
          )
        `)

      if (error) {
        toast.error('Erro ao carregar clientes')
        setLoading(false)
        return
      }

      const formattedCustomers = (data as any[]).map(c => {
        const orders = c.orders ?? []
        const latestOrder = orders[0] ?? {}
        const totalSpent = orders.reduce((acc: number, o: any) => acc + o.total_cents, 0)

        return {
          id: c.id,
          name: c.full_name,
          phone: c.phone,
          address: latestOrder.delivery_address ?? null,
          total_orders: orders.length,
          total_spent: totalSpent,
          lat: latestOrder.delivery_lat ?? null,
          lng: latestOrder.delivery_lng ?? null,
        } as Customer
      })

      setCustomers(formattedCustomers)
      setLoading(false)
    }

    fetchCustomers()
  }, [])

  const openCustomerDetails = async (customer: Customer) => {
    setSelectedCustomer(customer)

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_id', customer.id)
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Erro ao carregar pedidos do cliente')
      return
    }

    setCustomerOrders(data as Order[])
  }

  return (
    <div className="min-h-screen bg-[#18181b] text-white p-6 flex">

      <Drawer />

      <div className="flex-1 p-6 pl-20">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#cc9b3b]">Clientes</h1>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 animate-pulse">
            <Hamburger className="w-16 h-16 text-yellow-400 animate-spin-slow" />
            <span className="mt-4 text-yellow-400 text-lg font-medium">Carregando clientes...</span>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {customers.map((c) => (
              <CustomerCard key={c.id} customer={c} onClick={() => openCustomerDetails(c)} />
            ))}
          </div>
        )}
      </div>

      {/* Modal Cliente */}
      <AnimatePresence>
        {selectedCustomer && (
          <CustomerModal
            customer={selectedCustomer}
            orders={customerOrders}
            onClose={() => setSelectedCustomer(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
