import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                {/* Animated 404 */}
                <div className="relative mb-8">
                    <div className="text-[150px] sm:text-[200px] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary/50 to-muted select-none">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-primary/10 animate-pulse flex items-center justify-center">
                            <Search className="w-10 h-10 text-primary" />
                        </div>
                    </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold mb-4">
                    Page Not Found
                </h1>

                <p className="text-muted-foreground mb-8">
                    {`Oops! The page you're looking for doesn't exist or has been moved.`}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/">
                        <Button size="lg" className="gap-2 w-full sm:w-auto">
                            <Home size={18} />
                            Back to Home
                        </Button>
                    </Link>
                    <Link href="/docs">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto">
                            View Documentation
                        </Button>
                    </Link>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-1/4 left-10 w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "0s" }} />
                <div className="absolute top-1/3 right-20 w-3 h-3 rounded-full bg-primary/30 animate-bounce" style={{ animationDelay: "0.2s" }} />
                <div className="absolute bottom-1/3 left-20 w-2 h-2 rounded-full bg-primary/20 animate-bounce" style={{ animationDelay: "0.4s" }} />
            </div>
        </div>
    );
}
