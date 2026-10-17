'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare, FileText, Info, LogIn, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Chat', icon: MessageSquare },
  { href: '/docs', label: 'Docs', icon: FileText },
  { href: '/about', label: 'About', icon: Info },
]

export default function BottomNav() {
  const pathname = usePathname()

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path)

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 pb-safe">
      <nav
        className="flex items-center justify-around h-16 px-2"
        aria-label="Mobile navigation"
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive(link.href) ? 'page' : undefined}
            aria-label={link.label}
            className={cn(
              'flex flex-col items-center justify-center flex-1 h-full gap-1 py-2 transition-colors duration-200 rounded-lg',
              isActive(link.href)
                ? 'text-primary'
                : 'text-foreground-muted hover:text-foreground'
            )}
          >
            <link.icon
              size={20}
              aria-hidden="true"
              className={cn(
                isActive(link.href) &&
                  'drop-shadow-[0_0_6px_rgba(2,187,173,0.7)]'
              )}
            />
            <span className="text-[10px] font-medium">{link.label}</span>
          </Link>
        ))}

        {/* Auth link */}
        <Link
          href="/account"
          aria-label="Account"
          className={cn(
            'flex flex-col items-center justify-center flex-1 h-full gap-1 py-2 transition-colors duration-200 rounded-lg',
            isActive('/account')
              ? 'text-primary'
              : 'text-foreground-muted hover:text-foreground'
          )}
        >
          <User
            size={20}
            aria-hidden="true"
            className={cn(
              isActive('/account') &&
                'drop-shadow-[0_0_6px_rgba(2,187,173,0.7)]'
            )}
          />

          <span className="text-[10px] font-medium">Account</span>
        </Link>
      </nav>
    </div>
  )
}
