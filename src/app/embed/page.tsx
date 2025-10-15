'use client'

import { FC } from 'react'
import Drawer from '../../../components/ui/Panel'

const EmbedPage: FC = () => {
    return (
        <div className="relative flex min-h-screen bg-[#121212]">

            <Drawer />

            <div className="flex flex-col flex-1">

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
