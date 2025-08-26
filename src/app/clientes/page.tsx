'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Phone, MapPin, ShoppingBag, Menu, X, Home as HomeIcon, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Drawer from '../components/Drawer'

// Tipos
interface Customer {
  id: string
  name: string
  phone: string
  address?: string | null
  total_orders: number
  total_spent: number
  lat?: number | null
  lng?: number | null
}

interface Order {
  id: string
  total_cents: number
  status: string
  created_at: string
  delivery_address?: string | null
}

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
      {/* Drawer */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="flex-1">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#cc9b3b]">Clientes</h1>
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-lg bg-[#1f1f23] hover:bg-[#2a2a2f] transition"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {customers.map((c) => (
              <motion.div
                key={c.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openCustomerDetails(c)}
              >
                <div className="bg-[#1f1f23] border border-[#2a2a2f] rounded-2xl shadow-lg cursor-pointer hover:border-[#cc9b3b] transition p-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-[#cc9b3b]" />
                    <span className="font-semibold">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Phone className="w-4 h-4" /> {c.phone}
                  </div>
                  {c.address && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <MapPin className="w-4 h-4" /> {c.address}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-200">
                    <ShoppingBag className="w-4 h-4" /> Pedidos: {c.total_orders}
                  </div>
                  <p className="text-[#cc9b3b] font-bold text-lg">
                    {(c.total_spent / 100).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Cliente */}
      <AnimatePresence>
        {selectedCustomer && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#1f1f23] rounded-2xl shadow-xl max-w-3xl w-full p-6 overflow-y-auto max-h-[90vh]"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-[#cc9b3b]">{selectedCustomer.name}</h2>
                <button onClick={() => setSelectedCustomer(null)}>
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Info Cliente */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <p><Phone className="inline w-4 h-4 mr-1 text-[#cc9b3b]" /> {selectedCustomer.phone}</p>
                {selectedCustomer.address && (
                  <p>
                    <MapPin className="inline w-4 h-4 mr-1 text-[#cc9b3b]" /> {selectedCustomer.address}
                  </p>
                )}
                <p>Pedidos: {selectedCustomer.total_orders}</p>
                <p>Total gasto: {(selectedCustomer.total_spent / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                {selectedCustomer.lat && selectedCustomer.lng && (
                  <a
                    href={`https://www.google.com/maps?q=${selectedCustomer.lat},${selectedCustomer.lng}`}
                    target="_blank"
                    className="flex items-center gap-1 text-[#cc9b3b] hover:underline"
                  >
                    <MapPin className="w-4 h-4" /> Ver no mapa
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Histórico Pedidos */}
              <h3 className="font-semibold text-lg mb-2">Histórico de Pedidos</h3>
              <ul className="space-y-2 mb-4">
                {customerOrders.map((o) => (
                  <li key={o.id} className="bg-[#2a2a2f] p-3 rounded-lg flex justify-between text-sm">
                    <span>{new Date(o.created_at).toLocaleString('pt-BR')}</span>
                    <span className="text-[#cc9b3b] font-semibold">
                      {(o.total_cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                    <span className="text-gray-400">{o.status}</span>
                  </li>
                ))}
              </ul>

              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="px-4 py-2 bg-[#cc9b3b] hover:bg-[#b88b30] text-black font-bold rounded-lg transition"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
