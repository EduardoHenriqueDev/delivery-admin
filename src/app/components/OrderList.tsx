'use client'

import { Hamburger } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import OrderCard from './OrderCard'
import type { OrderWithItems } from '../page'

interface OrderListProps {
  loading: boolean
  orders: OrderWithItems[]
  onSelectOrder: (order: OrderWithItems) => void
}

export default function OrderList({ loading, orders, onSelectOrder }: OrderListProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 animate-pulse w-full rounded-xl">
        <Hamburger className="w-16 h-16 text-yellow-400 animate-spin-slow" />
        <span className="mt-4 text-yellow-400 text-lg font-medium">Carregando pedidos...</span>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center text-gray-400 col-span-full text-lg py-10 w-full rounded-xl">
        Nenhum pedido encontrado.
      </div>
    )
  }

  return (
    <div className="w-full flex flex-wrap gap-6 justify-start">
      <AnimatePresence>
        {orders.map((order) => (
          <motion.div
            key={order.id}
            className="basis-[320px] w-[320px] shrink-0 grow-0"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
          >
            <OrderCard order={order} onClick={() => onSelectOrder(order)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
