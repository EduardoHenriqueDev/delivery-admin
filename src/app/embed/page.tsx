'use client'

import { FC } from 'react'
import Drawer from '../components/Drawer'

const EmbedPage: FC = () => {
    return (
        <div className="relative flex min-h-screen bg-[#121212]">

            <Drawer />

            <div className="flex flex-col flex-1">

                <div className="flex-1 w-full">
                    <iframe
                        src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQy0Ylsabv2tjJxetR06WJyEaVvQdAtETIxqAAm6fK2JPOePDGpQsp5tWj8d894Eg/pubhtml?widget=true&amp;headers=false"
                        className="w-full h-full border-none"
                        allowFullScreen
                    />
                </div>

            </div>
        </div>
    )
}

export default EmbedPage
