'use client'

import { FC, useState } from 'react'
import Panel from '../../../components/Panel'
import Navbar from '../../../components/Navbar'

const EmbedPage: FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false)

    return (
        <div className="relative flex min-h-screen bg-[#121212] text-white">
            <Panel open={drawerOpen} onOpenChange={setDrawerOpen} />

            <div className="flex flex-col flex-1 p-6 pt-0">
                <div className="-mx-6">
                    <Navbar
                        title="Planilha"
                        showMenuButton
                        isMenuOpen={drawerOpen}
                        onMenuClick={() => setDrawerOpen(!drawerOpen)}
                    />
                </div>

                <div className="flex-1 w-full">
                    <iframe
                        src="https://docs.google.com/spreadsheets/d/1F1Yc8NjWdZ3SFK8JF6QnuPPFb1xFaPdO/edit?usp=sharing"
                        className="w-full h-full border-none"
                        allowFullScreen
                    />
                </div>
            </div>
        </div>
    )
}

export default EmbedPage
