import { motion } from 'framer-motion'
import { User, Phone, MapPin, ShoppingBag } from 'lucide-react'
import { Customer } from '../types'

interface CustomerCardProps {
  customer: Customer
  onClick: () => void
}

export default function CustomerCard({ customer, onClick }: CustomerCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="bg-[#1f1f23] border border-[#2a2a2f] rounded-2xl shadow-lg cursor-pointer hover:border-[#cc9b3b] transition p-6 space-y-3">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-[#cc9b3b]" />
          <span className="font-semibold">{customer.name}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Phone className="w-4 h-4" /> {customer.phone}
        </div>
        {customer.address && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MapPin className="w-4 h-4" /> {customer.address}
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-200">
          <ShoppingBag className="w-4 h-4" /> Pedidos: {customer.total_orders}
        </div>
        <p className="text-[#cc9b3b] font-bold text-lg">
          {(customer.total_spent / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </p>
      </div>
    </motion.div>
  )
}
