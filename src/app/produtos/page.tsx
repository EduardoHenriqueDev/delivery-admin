'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { toast } from 'sonner'
import { AnimatePresence } from 'framer-motion'
import Panel from '../../../components/Panel'
import Navbar from '../../../components/Navbar'
import ProductCard from './components/ProductCard'
import ProductModal from './components/ProductModal'
import type { Product } from './types'
import { Hamburger } from 'lucide-react'

export default function ProdutosPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

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

    const visibleProducts = products.filter((p) => {
        const q = searchQuery.trim().toLowerCase()
        if (!q) return true
        return (
            p.name?.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q)
        )
    })

    return (
        <div className="min-h-screen bg-[#18181b] text-white flex">
            <Panel open={drawerOpen} onOpenChange={setDrawerOpen} />

            <div className="flex-1 p-6 pt-0">
                {/* Navbar */}
                <div className="-mx-6">
                    <Navbar
                        title="Produtos"
                        showMenuButton
                        isMenuOpen={drawerOpen}
                        onMenuClick={() => setDrawerOpen(!drawerOpen)}
                        showSearch
                        searchValue={searchQuery}
                        onSearchChange={setSearchQuery}
                        searchPlaceholder="Buscar por nome ou descrição..."
                    />
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 animate-pulse">
                        <Hamburger className="w-16 h-16 text-[#cc9b3b] animate-spin-slow" />
                        <span className="mt-4 text-[#cc9b3b] text-lg font-medium">Carregando produtos...</span>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {visibleProducts.map((p) => (
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