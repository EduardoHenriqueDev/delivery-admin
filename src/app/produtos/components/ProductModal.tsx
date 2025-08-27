'use client'

import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useState } from 'react'
import { supabase } from '../../../../lib/supabase'
import { toast } from 'sonner'
import type { Product } from '../types'

interface Props {
    product: Product
    onClose: () => void
    onUpdate?: (updatedProduct: Product) => void
}

export default function ProductModal({ product, onClose, onUpdate }: Props) {
    const [updating, setUpdating] = useState(false)
    const [active, setActive] = useState(product.active)

    const toggleActive = async () => {
        setUpdating(true)
        const { error } = await supabase
            .from('products')
            .update({ active: !active })
            .eq('id', product.id)

        if (error) {
            toast.error('Erro ao atualizar produto')
        } else {
            setActive(!active)
            toast.success(`Produto ${!active ? 'ativado' : 'desativado'}!`)
            if (onUpdate) onUpdate({ ...product, active: !active })
        }
        setUpdating(false)
    }

    return (
        <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-[#1f1f23] p-8 rounded-2xl shadow-xl max-w-lg w-full border border-[#333] relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
            >
                {/* Botão fechar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-[#2a2a2f] hover:bg-[#cc9b3b] hover:text-black text-white transition-all shadow-lg"
                >
                    <X className="w-5 h-5" />
                </button>

                {product.image_url && (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-60 object-cover rounded-xl mb-6"
                    />
                )}

                <h2 className="text-2xl font-bold text-[#cc9b3b] mb-2">
                    {product.name}
                </h2>
                <p className="text-gray-300 mb-4">{product.description}</p>

                <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-semibold text-white">
                        R$ {(product.price_cents / 100).toFixed(2)}
                    </span>
                    <span
                        className={`px-3 py-1 rounded-full text-sm ${active
                            ? 'bg-green-600/20 text-green-400'
                            : 'bg-red-600/20 text-red-400'
                            }`}
                    >
                        {active ? 'Ativo' : 'Desativado'}
                    </span>
                </div>

                <button
                    onClick={toggleActive}
                    disabled={updating}
                    className={`w-full py-3 rounded-xl font-semibold transition ${active
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                        } ${updating ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                    {active ? 'Desativar Produto' : 'Ativar Produto'}
                </button>
            </motion.div>
        </motion.div>
    )
}
