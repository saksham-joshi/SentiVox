import type { Metadata } from 'next'
import Image from 'next/image'
import { VALUES } from '@/lib/values'
import { Wrench } from 'lucide-react'
import Logo from '@/assets/logo.png'
import { memo } from 'react'

export const metadata: Metadata = {
  title: `${VALUES.APP_NAME} — Under Maintenance`,
  description: 'Senti-Vox is currently undergoing scheduled maintenance.',
  robots: { index: false, follow: false },
}

function MaintenancePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground text-center">
      <div className="max-w-md space-y-6 glass p-8 sm:p-10 rounded-3xl border border-[#1b4552] shadow-2xl">
        <div className="relative w-20 h-20 mx-auto rounded-2xl overflow-hidden shadow-lg shadow-[#02bbad]/20 flex items-center justify-center bg-[#081526]">
          <Image
            src={Logo}
            alt={VALUES.APP_NAME}
            fill
            sizes="80px"
            className="object-contain p-2"
          />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#02bbad]/10 text-[#02bbad] text-xs font-semibold uppercase tracking-wider">
          <Wrench size={14} className="animate-spin" />
          Scheduled Maintenance
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          We&apos;ll be back soon!
        </h1>

        <p className="text-sm text-[#78869a] leading-relaxed">
          {VALUES.APP_NAME} is currently undergoing scheduled system upgrades
          and optimization to serve you better. Thank you for your patience!
        </p>

        <div className="pt-4 border-t border-[#1b4552]/50 text-xs text-[#78869a]">
          &copy; {new Date().getFullYear()} {VALUES.APP_NAME}. All rights
          reserved.
        </div>
      </div>
    </div>
  )
}

export default memo(MaintenancePage)

export const dynamic = 'error'
