'use client'

import { motion } from 'framer-motion'
import type { Product } from '../types'

interface Props {
    product: Product
    onClick: () => void
}

export default function ProductCard({ product, onClick }: Props) {
    return (
        <motion.div
            className="bg-[#1f1f23] p-6 rounded-2xl shadow-lg border border-[#2a2a2f] hover:border-[#cc9b3b] cursor-pointer transition"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClick} // abre o modal
        >
            {product.image_url && (
                <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-xl mb-4"
                />
            )}
            <h3 className="text-xl font-bold text-[#cc9b3b]">{product.name}</h3>
            <p className="text-gray-400 line-clamp-2">{product.description}</p>
            <div className="mt-3 flex justify-between items-center">
                <span className="text-lg font-semibold text-white">
                    R$ {(product.price_cents / 100).toFixed(2)}
                </span>
                <span
                    className={`text-sm px-2 py-1 rounded-full ${product.active
                            ? 'bg-green-600/20 text-green-400'
                            : 'bg-red-600/20 text-red-400'
                        }`}
                >
                    {product.active ? 'Ativo' : 'Desativado'}
                </span>
            </div>
        </motion.div>
    )
}
