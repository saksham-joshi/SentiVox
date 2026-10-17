import Link from 'next/link'
import { VALUES } from '@/lib/values'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="glass border-t border-border/50 text-xs py-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-foreground-muted">
          <span>
            &copy; 2025 - {currentYear} {VALUES.APP_NAME}. All Rights Reserved.
          </span>

          <div className="flex items-center gap-4 text-xs font-medium">
            <Link
              href="/privacy-policy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link href="/docs" className="hover:text-primary transition-colors">
              Docs
            </Link>
            <a
              href={VALUES.APP_GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-hover transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
