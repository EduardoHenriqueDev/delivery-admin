// ProdutosPage.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { toast } from 'sonner'
import { AnimatePresence } from 'framer-motion'
import Drawer from '../../../components/ui/Panel'
import ProductCard from './components/ProductCard'
import ProductModal from './components/ProductModal'
import type { Product } from './types'
import { Hamburger } from 'lucide-react'

export default function ProdutosPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            const { data, error } = await supabase
                .from('products')
                .select('id, name, description, price_cents, image_url, active, created_at')

            if (error) {
                toast.error('Erro ao carregar produtos')
                setLoading(false)
                return
            }

            setProducts(data as Product[])
            setLoading(false)
        }

        fetchProducts()
    }, [])

    const handleUpdateProduct = (updatedProduct: Product) => {
        setProducts((prev) =>
            prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
        )
    }

    return (
        <div className="min-h-screen bg-[#18181b] text-white p-6 flex">
            <Drawer />

            <div className="flex-1 p-6 pl-20">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#cc9b3b]">
                        Produtos
                    </h1>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 animate-pulse">
                        <Hamburger className="w-16 h-16 text-yellow-400 animate-spin-slow" />
                        <span className="mt-4 text-yellow-400 text-lg font-medium">Carregando produtos...</span>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {products.map((p) => (
                            <ProductCard
                                key={p.id}
                                product={p}
                                onClick={() => setSelectedProduct(p)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Produto */}
            <AnimatePresence>
                {selectedProduct && (
                    <ProductModal
                        product={selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                        onUpdate={handleUpdateProduct}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}