import { VALUES } from "@/lib/values";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-border bg-card/50 text-[5px] md:text-xs sm:text-xs">
            <div className="container mx-auto px-4 sm:px-6 lg:px-4 py-2 mt-0">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 text-muted-foreground">
                    <span>© 2025 - {currentYear} • All Rights Reserved •&nbsp;
                    <a
                        href={VALUES.APP_GITHUB}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-hover transition-colors duration-200"
                    >
                        {VALUES.APP_NAME}
                    </a>
                    </span>
                </div>
            </div>
        </footer>
    );
}
