'use client'

import { useState } from 'react'
import { STATUS_LABELS, formatPrice, OrderWithItems } from '../page'
import { CheckCircle, Clock, XCircle, Truck, Package, QrCode } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'

interface OrderCardProps {
    order: OrderWithItems
    onClick: () => void
}

export default function OrderCard({ order, onClick }: OrderCardProps) {
    const [showQR, setShowQR] = useState(false)

    const isInactive =
        order.status === 'delivered' || order.status === 'cancelled' || order.status === 'rejected'

    const statusStyles: Record<
        string,
        { bg: string; text: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }
    > = {
        pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
        accepted: { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle },
        preparing: { bg: 'bg-orange-100', text: 'text-orange-800', icon: Package },
        out_for_delivery: { bg: 'bg-purple-100', text: 'text-purple-800', icon: Truck },
        delivered: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
        rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
        cancelled: { bg: 'bg-gray-200', text: 'text-gray-700', icon: XCircle },
    }

    const currentStatus = statusStyles[order.status] || statusStyles.cancelled
    const StatusIcon = currentStatus.icon

    // Link do Maps para QR
    const mapsLink = order.delivery_address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.delivery_address)}`
        : order.delivery_lat && order.delivery_lng
            ? `https://www.google.com/maps/search/?api=1&query=${order.delivery_lat},${order.delivery_lng}`
            : null

    return (
        <div
            className={`group relative rounded-2xl p-5 shadow-lg cursor-pointer transition-all border ${isInactive
                ? 'bg-[#141416] border-[#333] hover:border-[#cc9b3b] opacity-60 hover:opacity-80'
                : 'bg-[#141416] border-[#333] hover:border-[#cc9b3b] hover:shadow-2xl'
                }`}
            onClick={onClick}
        >
            {/* Top Row: Order ID + Status */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-[#cc9b3b] tracking-wide">
                    #{order.id.slice(0, 8)}
                </h3>

                <div
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${currentStatus.bg} ${currentStatus.text} transition-all`}
                >
                    <StatusIcon className="w-4 h-4" />
                    <span>{STATUS_LABELS[order.status]}</span>
                </div>
            </div>

            {/* Customer Info */}
            <div className={`text-sm space-y-2 ${isInactive ? 'text-gray-400' : 'text-gray-300'}`}>
                <div>
                    <strong className="font-medium">Cliente:</strong> {order.customer_name}
                </div>
                <div>
                    <strong className="font-medium">Endereço:</strong>{' '}
                    {order.delivery_address || (
                        <span className="italic text-gray-500">Não informado</span>
                    )}
                </div>
                <div>
                    <strong className="font-medium">Total:</strong>{' '}
                    <span className="text-green-400 font-semibold">{formatPrice(order.total_cents)}</span>
                </div>
            </div>

            {/* Items List */}
            <div className="mt-3">
                <strong className="block mb-1 text-sm font-medium text-gray-200">Itens:</strong>
                <ul className="ml-4 list-disc max-h-28 overflow-auto text-xs scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                    {(order.items || []).map((item) => (
                        <li key={item.id} className="py-0.5 hover:bg-gray-700 rounded px-1 transition-colors">
                            {item.product?.name || 'Produto desconhecido'} —{' '}
                            <span className="font-medium">{item.quantity}x</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* QR Code Button */}
            {mapsLink && (
                <div className="mt-3 flex flex-col items-start">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setShowQR(!showQR)
                        }}
                        className="flex items-center gap-2 px-3 py-1 bg-[#cc9b3b] text-black rounded-lg text-sm font-semibold hover:bg-[#cc9b3b] transition"
                    >
                        <QrCode className="w-4 h-4" />
                        {showQR ? 'Fechar QR' : 'Gerar QR para Maps'}
                    </button>

                    {showQR && (
                        <div className="mt-2 p-2 bg-[#1f1f23] rounded-xl border border-yellow-400">
                            <QRCodeCanvas
                                value={mapsLink}
                                size={150}
                                fgColor="#cc9b3b"
                                bgColor="#1f1f23"
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Hover Overlay for Extra UX */}
            <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
        </div>
    )
}
