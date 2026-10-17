import { ReactNode } from 'react'
import { SVG } from './svg'

interface TechIcon {
  name: string
  svg: ReactNode
}

export const TechIcons: TechIcon[] = [
  {
    name: 'Next.js',
    svg: SVG.nextjs(24),
  },
  {
    name: 'ElysiaJS',
    svg: SVG.elysiajs(24),
  },
  {
    name: 'Bun',
    svg: SVG.bun(24),
  },
  {
    name: 'Express.js',
    svg: SVG.express(24),
  },
  {
    name: 'Render',
    svg: SVG.render(24),
  },
  {
    name: 'Redis',
    svg: SVG.redis(24),
  },
  {
    name: 'Supabase',
    svg: SVG.supabase(24),
  },
  {
    name: 'PostgreSql',
    svg: SVG.postgresql(24),
  },
  {
    name: 'Drizzle ORM',
    svg: SVG.drizzle(24),
  },
  {
    name: 'Python',
    svg: SVG.python(24),
  },
  {
    name: 'Upstash',
    svg: SVG.upstash(24),
  },
  {
    name: 'NodeMailer',
    svg: SVG.nodemailer(24),
  },
]
