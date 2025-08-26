'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { X, Home, User, Headset } from 'lucide-react'

interface DrawerProps {
  open: boolean
  onClose: () => void
}

export default function Drawer({ open, onClose }: DrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay com blur mais intenso e transição suave */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-[#1f1f23] to-[#2a2a2f] shadow-2xl z-50 p-8 flex flex-col gap-8 rounded-r-3xl border-r border-[#333]"
            initial={{ x: '-120%' }}
            animate={{ x: 0 }}
            exit={{ x: '-120%' }}
            transition={{ type: 'spring', stiffness: 90, damping: 25 }}
          >
            {/* Cabeçalho com botão flutuante de fechar */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-extrabold text-[#cc9b3b] tracking-wider">
                Menu
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-[#2a2a2f] hover:bg-[#cc9b3b] hover:text-black text-white transition-all shadow-lg flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navegação com hover animado e efeitos de foco */}
            <nav className="flex flex-col gap-5 mt-4">
              <Link
                href="/"
                className="flex items-center gap-4 text-white hover:text-[#cc9b3b] transition-all duration-300 transform hover:translate-x-2"
                onClick={onClose}
              >
                <Home className="w-6 h-6 text-[#cc9b3b]" />
                <span className="text-lg font-semibold">Home</span>
              </Link>

              <Link
                href="/clientes"
                className="flex items-center gap-4 text-white hover:text-[#cc9b3b] transition-all duration-300 transform hover:translate-x-2"
                onClick={onClose}
              >
                <User className="w-6 h-6 text-[#cc9b3b]" />
                <span className="text-lg font-semibold">Clientes</span>
              </Link>

              <Link
                href="/suporte"
                className="flex items-center gap-4 text-white hover:text-[#cc9b3b] transition-all duration-300 transform hover:translate-x-2"
                onClick={onClose}
              >
                <Headset className="w-6 h-6 text-[#cc9b3b]" />
                <span className="text-lg font-semibold">Suporte</span>
              </Link>
            </nav>

            {/* Rodapé com efeito leve de destaque */}
            <div className="mt-auto text-sm text-gray-400 italic">
              © 2025 GLV Informatica Desenvolvimento <br />
              <span className="text-[#cc9b3b]">Performance • Escalabilidade • Inovação</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
