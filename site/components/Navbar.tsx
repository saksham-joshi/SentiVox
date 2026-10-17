'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { MessageSquare, FileText, Info, LogIn, User } from 'lucide-react'
import { VALUES } from '@/lib/values'
import { cn } from '@/lib/utils'
import Logo from '@/assets/logo.png'

const navLinks = [
  { href: '/', label: 'Chat', icon: MessageSquare },
  { href: '/docs', label: 'Docs', icon: FileText },
  { href: '/about', label: 'About', icon: Info },
]

export default function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path)

  return (
    <header className="hidden md:block fixed top-0 left-0 right-0 z-50 glass">
      <nav
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
            aria-label={`${VALUES.APP_NAME} — home`}
          >
            <div className="relative w-8 h-8 overflow-hidden rounded-lg transition-transform duration-200 group-hover:scale-110">
              <Image
                src={Logo}
                alt={VALUES.APP_NAME}
                fill
                sizes="32px"
                className="object-contain"
                priority
              />
            </div>
            <span className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
              {VALUES.APP_NAME}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="flex items-center gap-1" role="list">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                role="listitem"
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                  isActive(link.href)
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground-secondary hover:text-foreground hover:bg-surface-soft'
                )}
              >
                <link.icon size={16} aria-hidden="true" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Button */}
          <div>
            <Link
              href="/account"
              aria-current={isActive('/account') ? 'page' : undefined}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                isActive('/account')
                  ? 'text-primary bg-primary/10'
                  : 'text-foreground-secondary hover:text-foreground hover:bg-surface-soft'
              )}
            >
              <User size={16} aria-hidden="true" />
              Account
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
