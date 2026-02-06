import { ReactNode } from "react";
import { SVG } from "./svg";

interface TechIcon {
    name: string;
    svg: ReactNode;
}

export const TechIcons: TechIcon[] = [
    {
        name: "TypeScript",
        svg: SVG.typescript
    },
    {
        name: "Next.js",
        svg: SVG.nextjs
    },
    {
        name: "ElysiaJS",
        svg: SVG.elysiajs
    },
    {
        name: "Bun",
        svg: SVG.bun
    },
    {
        name: "Render",
        svg: SVG.render
    },
    {
        name: "Redis",
        svg: SVG.redis
    },
    {
        name: "Supabase",
        svg: SVG.supabase
    },
    {
        name: "Python",
        svg: SVG.python
    },
    {
        name: "Vercel",
        svg: SVG.vercel
    },
    {
        name: "NodeMailer",
        svg: SVG.nodemailer
    },
    {
        name: "CronJob.org",
        svg: SVG.cronjob
    },
    {
        name: "GitHub",
        svg: SVG.github
    }
];