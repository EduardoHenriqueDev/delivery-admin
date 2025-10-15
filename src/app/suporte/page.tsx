'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Instagram, Facebook } from 'lucide-react'
import Link from 'next/link'
import Panel from '../../../components/Panel'
import Navbar from '../../../components/Navbar'
import Image from 'next/image'
import ParticleBackground from '../../../components/ui/ParticleBackground'

export default function Page() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="flex relative min-h-screen text-white overflow-hidden">
      {/* Background de partículas */}
      <ParticleBackground />

      {/* Painel lateral controlado */}
      <Panel open={drawerOpen} onOpenChange={setDrawerOpen} />

      {/* Conteúdo principal */}
      <div className="relative z-10 flex-1 p-6 pt-0">
        {/* Navbar */}
        <div className="-mx-6">
          <Navbar
            title="Suporte"
            showMenuButton
            isMenuOpen={drawerOpen}
            onMenuClick={() => setDrawerOpen(!drawerOpen)}
          />
        </div>

        <main className="flex flex-col items-center justify-center px-6 py-12">
          {/* Hero */}
          <motion.div
            className="text-center max-w-4xl"
            initial={{ opacity: 0, y: -80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <Image
                src="/img/branding/logohorizontal.png"
                alt="GLV Informática"
                width={500}
                height={80}
                priority
                className="drop-shadow-lg"
              />
            </div>

            <p className="text-lg md:text-xl text-gray-300 mb-10">
              Nossa equipe está pronta para levar sua empresa a outro nível com tecnologia de alto desempenho.
              <span className="block font-semibold text-[#098fd2] mt-3 text-lg md:text-xl">
                Fale com a gente agora mesmo!
              </span>
            </p>
          </motion.div>

          {/* Botões de contato */}
          <motion.div
            className="flex flex-col md:flex-row gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {/* WhatsApp */}
            <Link
              href="https://wa.me/5511919167653"
              target="_blank"
              className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-5 rounded-3xl shadow-2xl transition transform hover:scale-105 hover:shadow-3xl"
            >
              <MessageCircle className="w-6 h-6" /> WhatsApp
            </Link>

            {/* Instagram */}
            <Link
              href="https://www.instagram.com/glv_informatica"
              target="_blank"
              className="flex items-center gap-3 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:opacity-90 text-white font-bold px-8 py-5 rounded-3xl shadow-2xl transition transform hover:scale-105 hover:shadow-3xl"
            >
              <Instagram className="w-6 h-6" /> Instagram
            </Link>

            {/* Facebook */}
            <Link
              href="https://facebook.com/glvinformatica"
              target="_blank"
              className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-5 rounded-3xl shadow-2xl transition transform hover:scale-105 hover:shadow-3xl"
            >
              <Facebook className="w-6 h-6" /> Facebook
            </Link>
          </motion.div>

          {/* Rodapé */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <p className="text-gray-400 mb-1">
              🚀{' '}
              <Link
                href="https://www.glvinformatica.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:opacity-80 transition"
              >
                GLV Informática e Desenvolvimento
              </Link>
            </p>
            <p className="text-[#098fd2] font-semibold tracking-wide">
              Performance • Escalabilidade • Inovação
            </p>
          </motion.div>
        </main>
      </div>
    </div>
  )
}