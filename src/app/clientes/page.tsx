'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { toast } from 'sonner'
import { AnimatePresence } from 'framer-motion'
import Panel from '../../../components/Panel'
import Navbar from '../../../components/Navbar'
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
  const [searchQuery, setSearchQuery] = useState('')

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

  const visibleCustomers = customers.filter((c) => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return true
    return (
      c.name?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q) ||
      c.address?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="min-h-screen bg-[#18181b] text-white flex">
      <Panel open={drawerOpen} onOpenChange={setDrawerOpen} />

      <div className="flex-1 p-6 pt-0">
        {/* Navbar */}
        <div className="-mx-6">
          <Navbar
            title="Clientes"
            showMenuButton
            isMenuOpen={drawerOpen}
            onMenuClick={() => setDrawerOpen(!drawerOpen)}
            showSearch
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Buscar por nome, telefone ou endereço..."
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 animate-pulse">
            <Hamburger className="w-16 h-16 text-[#cc9b3b] animate-spin-slow" />
            <span className="mt-4 text-[#cc9b3b] text-lg font-medium">Carregando clientes...</span>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleCustomers.map((c) => (
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
