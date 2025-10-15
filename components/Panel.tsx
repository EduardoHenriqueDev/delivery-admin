'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { X, Home, User, Headset, Package, Newspaper } from 'lucide-react'
import React from 'react'

type DrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function Drawer({ open, onOpenChange }: DrawerProps) {
  return (
    <motion.aside
      aria-hidden={!open}
      aria-expanded={open}
      className={`sticky top-0 h-screen overflow-hidden ${
        open ? 'border-r border-[#333]' : ''
      }`}
      initial={{ width: 0 }}
      animate={{ width: open ? 220 : 0 }}
      transition={{ type: 'tween', duration: 0.2 }}
    >
      <div
        className={`h-full bg-[#141416] shadow-2xl p-4 flex flex-col gap-6 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Cabeçalho */}
        <div className="flex flex-col items-center gap-2 mb-4">
          <Image
            src="/taurus-black-burguer/logo-taurus.png"
            alt="Foto de perfil"
            width={120}
            height={120}
            className="object-cover"
          />
          <span className="text-sm font-semibold text-white">Taurus Black Burguers</span>
        </div>

        {/* Navegação */}
        <nav className="flex flex-col gap-5 mt-2">
          <Link
            href="/"
            className="flex items-center gap-3 text-white hover:text-[#cc9b3b] transition-all duration-300 transform hover:translate-x-2"
            onClick={() => onOpenChange(false)}
          >
            <Home className="w-5 h-5 text-[#cc9b3b]" />
            <span className="text-base font-semibold">Home</span>
          </Link>

          <Link
            href="/clientes"
            className="flex items-center gap-3 text-white hover:text-[#cc9b3b] transition-all duration-300 transform hover:translate-x-2"
            onClick={() => onOpenChange(false)}
          >
            <User className="w-5 h-5 text-[#cc9b3b]" />
            <span className="text-base font-semibold">Clientes</span>
          </Link>

          <Link
            href="/produtos"
            className="flex items-center gap-3 text-white hover:text-[#cc9b3b] transition-all duration-300 transform hover:translate-x-2"
            onClick={() => onOpenChange(false)}
          >
            <Package className="w-5 h-5 text-[#cc9b3b]" />
            <span className="text-base font-semibold">Produtos</span>
          </Link>

          <Link
            href="/embed"
            className="flex items-center gap-3 text-white hover:text-[#cc9b3b] transition-all duration-300 transform hover:translate-x-2"
            onClick={() => onOpenChange(false)}
          >
            <Newspaper className="w-5 h-5 text-[#cc9b3b]" />
            <span className="text-base font-semibold">Planilha</span>
          </Link>

          <Link
            href="/suporte"
            className="flex items-center gap-3 text-white hover:text-[#cc9b3b] transition-all duration-300 transform hover:translate-x-2"
            onClick={() => onOpenChange(false)}
          >
            <Headset className="w-5 h-5 text-[#cc9b3b]" />
            <span className="text-base font-semibold">Suporte</span>
          </Link>
        </nav>

        {/* Rodapé */}
        <div className="mt-auto text-xs text-gray-400 italic">
          © 2025 GLV Informatica Desenvolvimento <br />
          <span className="text-[#cc9b3b]">
            Performance • Escalabilidade • Inovação
          </span>
        </div>
      </div>
    </motion.aside>
  )
}