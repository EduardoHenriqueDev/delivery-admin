import { motion } from 'framer-motion'
import { X, Phone, MapPin, ExternalLink } from 'lucide-react'
import { Customer, Order } from '../types'

interface CustomerModalProps {
  customer: Customer
  orders: Order[]
  onClose: () => void
}

// Mapa de tradução dos status
const STATUS_TRANSLATIONS: Record<string, string> = {
  pending: 'Pendente',
  accepted: 'Aceito',
  preparing: 'Em preparo',
  out_for_delivery: 'Saiu para entrega',
  delivered: 'Entregue',
  rejected: 'Rejeitado',
  canceled: 'Cancelado',
}

export default function CustomerModal({ customer, orders, onClose }: CustomerModalProps) {
  return (
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
          <h2 className="text-2xl font-bold text-[#cc9b3b]">{customer.name}</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <p><Phone className="inline w-4 h-4 mr-1 text-[#cc9b3b]" /> {customer.phone}</p>
          {customer.address && (
            <p>
              <MapPin className="inline w-4 h-4 mr-1 text-[#cc9b3b]" /> {customer.address}
            </p>
          )}
          <p>Pedidos: {customer.total_orders}</p>
          <p>Total gasto: {(customer.total_spent / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          {customer.lat && customer.lng && (
            <a
              href={`https://www.google.com/maps?q=${customer.lat},${customer.lng}`}
              target="_blank"
              className="flex items-center gap-1 text-[#cc9b3b] hover:underline"
            >
              <MapPin className="w-4 h-4" /> Ver no mapa
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
        <h3 className="font-semibold text-lg mb-2">Histórico de Pedidos</h3>
        <ul className="space-y-2 mb-4">
          {orders.map((o) => (
            <li key={o.id} className="bg-[#2a2a2f] p-3 rounded-lg flex justify-between text-sm">
              <span>{new Date(o.created_at).toLocaleString('pt-BR')}</span>
              <span className="text-[#cc9b3b] font-semibold">
                {(o.total_cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
              <span className="text-gray-400">
                {STATUS_TRANSLATIONS[o.status] || o.status}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#cc9b3b] hover:bg-[#b88b30] text-black font-bold rounded-lg transition"
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}