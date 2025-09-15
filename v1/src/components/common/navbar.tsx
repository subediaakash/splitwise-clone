"use client";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    const [isOpen, setIsOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [atTop, setAtTop] = useState(true);

    const { data: session,  } = authClient.useSession();
    const isLoggedIn = !!session;

    useEffect(() => {
        const onScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            setProgress(pct);
            setAtTop(scrollTop < 10);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const shouldHide = pathname?.startsWith("/signin") || pathname?.startsWith("/signup");
    if (shouldHide) return null;

    return (
        <header className={`sticky top-0 z-50 ${atTop ? "" : "shadow-md"}`}>
            <div className="max-w-7xl mx-auto w-full">
                <div className="glass flex justify-between items-center px-4 md:px-6 py-4 rounded-b-2xl border">
                    <h1 className="text-3xl font-extrabold tracking-tight text-[#123458] cursor-pointer hover:scale-105 transition-transform">
                        <Link href="/">Splitwise Pro</Link>
                    </h1>

                    {/* Desktop: default navbar when logged out */}
                    {!isLoggedIn && (
                        <nav className="hidden md:flex gap-8 text-lg font-medium">
                            <a href="#features" className="hover:text-[#123458] transition-colors">Features</a>
                            <a href="#pricing" className="hover:text-[#123458] transition-colors">Pricing</a>
                            <a href="#faq" className="hover:text-[#123458] transition-colors">FAQ</a>
                        </nav>
                    )}

                    {/* Desktop: pill segmented navbar when logged in */}
                    {isLoggedIn && (
                        <div className="hidden md:flex flex-1 justify-center">
                            <div className="glass border rounded-2xl p-1 flex items-center gap-1">
                                {[{ label: "Dashboard", href: "/dashboard" }, { label: "History", href: "#" }, { label: "Groups", href: "/groups" }, { label: "Profile", href: "#" }].map((item) => (
                                    <Link key={item.label} href={item.href} className="px-4 py-2 rounded-xl text-sm md:text-base hover:bg-black/5 transition-colors">
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="hidden md:flex items-center gap-3">
                        {!isLoggedIn && (
                            <>
                                <Button variant="outline" className="rounded-2xl px-6 py-2 border-2 border-[#123458] text-[#123458] hover:bg-[#123458] hover:text-[#F1EFEC] transition-all" asChild>
                                    <Link href="/signin">Login</Link>
                                </Button>
                                <Button className="bg-[#123458] text-[#F1EFEC] rounded-2xl px-6 py-2 hover:opacity-90 shadow-lg hover:shadow-xl transition-all" asChild>
                                    <Link href="/signup">Get Started</Link>
                                </Button>
                            </>
                        )}
                        {isLoggedIn && (
                            <></>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-gray-200"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>
            {/* Scroll progress bar */}
            <div className="h-1 w-full bg-transparent">
                <div className="h-1 bg-[#123458] transition-[width] duration-200" style={{ width: `${progress}%` }} />
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="absolute left-0 right-0 glass border mx-4 mt-2 rounded-2xl p-6 flex flex-col items-center gap-6 text-xl z-50 animate-fade-in">
                    {!isLoggedIn && (
                        <>
                            <a href="#features" className="hover:text-[#123458]" onClick={() => setIsOpen(false)}>Features</a>
                            <a href="#pricing" className="hover:text-[#123458]" onClick={() => setIsOpen(false)}>Pricing</a>
                            <a href="#faq" className="hover:text-[#123458]" onClick={() => setIsOpen(false)}>FAQ</a>
                            <Button variant="outline" className="w-full rounded-2xl border-2 border-[#123458] text-[#123458]" asChild>
                                <Link href="/signin" onClick={() => setIsOpen(false)}>Login</Link>
                            </Button>
                            <Button className="w-full bg-[#123458] text-[#F1EFEC] rounded-2xl px-6 py-3" asChild>
                                <Link href="/signup" onClick={() => setIsOpen(false)}>Get Started</Link>
                            </Button>
                        </>
                    )}
                    {isLoggedIn && (
                        <div className="w-full flex flex-col items-stretch gap-3">
                            {["Transactions", "History", "Groups", "Profile"].map((label) => (
                                <button key={label} className="w-full px-4 py-3 rounded-xl hover:bg-black/5 text-left">{label}</button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}