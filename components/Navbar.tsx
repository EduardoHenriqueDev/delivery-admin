'use client'

import React from 'react'
import { PanelLeftOpen, PanelLeftClose } from 'lucide-react'

export type FilterOption = { value: string; label: string }

type NavbarProps = {
    title: string
    showSearch?: boolean
    searchValue?: string
    onSearchChange?: (value: string) => void
    searchPlaceholder?: string
    showFilter?: boolean
    filterLabel?: string
    filterValue?: string
    filterOptions?: FilterOption[]
    onFilterChange?: (value: string) => void
    rightSlot?: React.ReactNode
    className?: string
    showMenuButton?: boolean
    onMenuClick?: () => void
    isMenuOpen?: boolean
}

export default function Navbar({
    title,
    showSearch,
    searchValue,
    onSearchChange,
    searchPlaceholder = 'Buscar...',
    showFilter,
    filterLabel,
    filterValue,
    filterOptions,
    onFilterChange,
    rightSlot,
    className = '',
    showMenuButton,
    onMenuClick,
    isMenuOpen,
}: NavbarProps) {
    return (
        <div className={`bg-[#141416] w-full grid grid-cols-1 sm:grid-cols-3 items-center gap-4 pl-0 pt-3 pr-4 sm:pr-6 lg:pr-8 border-b border-[#333] pb-3 mb-4 ${className}`}>
            <div className="flex items-center gap-3 justify-self-start">
                {showMenuButton && (
                    <button
                        onClick={onMenuClick}
                        aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                        className="p-2 transition-all shadow-lg text-white"
                    >
                        {isMenuOpen ? (
                            <PanelLeftClose className="w-6 h-6" />
                        ) : (
                            <PanelLeftOpen className="w-6 h-6" />
                        )}
                    </button>
                )}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-clip-text text-[#cc9b3b]">
                    {title}
                </h1>
            </div>

            {/* Center: Search */}
            {showSearch ? (
                <div className="relative w-full max-w-md justify-self-center">
                    <svg
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path
                            d="M21 21l-4.35-4.35m1.18-4.83a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        placeholder={searchPlaceholder}
                        aria-label="Buscar"
                        className="w-full bg-[#1a1a1a] text-white p-2 pl-10 rounded-full border border-[#cc9b3b] focus:ring-2 focus:ring-[#cc9b3b] transition outline-none"
                    />
                </div>
            ) : (
                <div className="justify-self-center" />
            )}

            {/* Right: Filter and extra actions */}
            <div className="flex items-center gap-3 justify-self-end">
                {showFilter && (
                    <div className="flex items-center gap-2">
                        {filterLabel && <label className="text-gray-300 font-semibold">{filterLabel}</label>}
                        <select
                            value={filterValue}
                            onChange={(e) => onFilterChange?.(e.target.value)}
                            className="bg-[#1a1a1a] text-white p-2 rounded-full border border-[#cc9b3b] focus:ring-2 focus:ring-[#cc9b3b] transition"
                        >
                            {filterOptions?.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                {rightSlot}
            </div>
        </div>
    )
}
