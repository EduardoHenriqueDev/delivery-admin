'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, X, Check, Utensils, Truck, Package } from 'lucide-react'
import { STATUS_LABELS, formatPrice, OrderWithItems } from '../page'

const STATUS_ACTIONS: Record<string, { label: string; next: string; icon: React.FC<any> }[]> = {
  pending: [
    { label: 'Aceitar', next: 'accepted', icon: Check },
    { label: 'Rejeitar', next: 'rejected', icon: X },
  ],
  accepted: [{ label: 'Preparar', next: 'preparing', icon: Utensils }],
  preparing: [{ label: 'Saiu para entrega', next: 'out_for_delivery', icon: Truck }],
  out_for_delivery: [{ label: 'Entregue', next: 'delivered', icon: Package }],
  delivered: [],
  rejected: [],
  cancelled: [],
}

type OrderItem = OrderWithItems['items'][0]

interface OrderModalProps {
  order: OrderWithItems
  onClose: () => void
  updating: boolean
  updateOrderStatus: (orderId: string, newStatus: string) => void
}

export default function OrderModal({ order, onClose, updating, updateOrderStatus }: OrderModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-[#1f1f23] rounded-3xl shadow-2xl w-full max-w-xl p-6 relative text-white overflow-hidden"
          initial={{ scale: 0.95, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 50, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Botão de fechar */}
          <button
            className="absolute top-5 right-5 text-gray-400 hover:text-white transition"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <h2 className="text-3xl font-bold mb-4 text-yellow-400 tracking-wide">
            Pedido #{order.id.slice(0, 8)}
          </h2>

          {/* Informações do pedido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-300 text-sm">
            <div><span className="font-semibold">Status:</span> <span className="text-yellow-400">{STATUS_LABELS[order.status]}</span></div>
            <div><span className="font-semibold">Cliente:</span> {order.customer_name}</div>
            <div><span className="font-semibold">Telefone:</span> {order.customer_phone}</div>
            <div><span className="font-semibold">Pagamento:</span> {order.payment_method.toUpperCase()}</div>
            <div className="sm:col-span-2">
              <span className="font-semibold">Endereço:</span>{" "}
              {order.delivery_address || <span className="italic text-gray-500">Não informado</span>}
            </div>
            <div><span className="font-semibold">Total:</span> <span className="text-green-400 font-semibold">{formatPrice(order.total_cents)}</span></div>
            {order.notes && <div className="sm:col-span-2"><span className="font-semibold">Observações:</span> {order.notes}</div>}
          </div>

          {/* Itens do pedido */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-yellow-400">Itens do Pedido</h3>
            <div className="divide-y divide-white/10 rounded-lg overflow-hidden border border-white/10">
              {(order.items || []).map((item: OrderItem) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 transition"
                >
                  <span className="font-medium">{item.product?.name || 'Produto desconhecido'}</span>
                  <span className="text-gray-300">Qtd: {item.quantity}</span>
                  <span className="text-green-400 font-semibold">{formatPrice(item.subtotal_cents)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mapa */}
          {order.delivery_lat && order.delivery_lng && (
            <div className="mt-6 rounded-lg overflow-hidden border-2 border-yellow-400">
              <h3 className="flex items-center gap-2 text-yellow-400 font-semibold mb-2 px-2 pt-2">
                <MapPin className="w-4 h-4" /> Local da entrega
              </h3>
              <iframe
                title="Mapa da entrega"
                width="100%"
                height={220}
                className="rounded-b-lg"
                loading="lazy"
                style={{ filter: "grayscale(0.2)" }}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${order.delivery_lng - 0.002},${order.delivery_lat - 0.002},${order.delivery_lng + 0.002},${order.delivery_lat + 0.002}&layer=mapnik&marker=${order.delivery_lat},${order.delivery_lng}`}
              />
              <a
                href={`https://www.openstreetmap.org/?mlat=${order.delivery_lat}&mlon=${order.delivery_lng}#map=18/${order.delivery_lat}/${order.delivery_lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-yellow-400 mt-1 px-2 underline"
              >
                Ver no mapa
              </a>
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex flex-wrap gap-3 mt-6">
            {STATUS_ACTIONS[order.status]?.map((action) => {
              const Icon = action.icon
              return (
                <motion.button
                  key={action.next}
                  disabled={updating}
                  onClick={() => updateOrderStatus(order.id, action.next)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold transition ${
                    updating
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-yellow-400 hover:bg-yellow-500 text-black"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {action.label}
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
