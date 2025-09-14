import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [atTop, setAtTop] = useState(true);

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

    return (
        <header className={`sticky top-0 z-50 ${atTop ? "" : "shadow-md"}`}>
            <div className="max-w-7xl mx-auto w-full">
                <div className="glass flex justify-between items-center px-4 md:px-6 py-4 rounded-b-2xl border">
                    <h1 className="text-3xl font-extrabold tracking-tight text-[#123458] cursor-pointer hover:scale-105 transition-transform">
                        <Link href="/">Splitwise Pro</Link>
                    </h1>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex gap-8 text-lg font-medium">
                        <a href="#features" className="hover:text-[#123458] transition-colors">Features</a>
                        <a href="#pricing" className="hover:text-[#123458] transition-colors">Pricing</a>
                        <a href="#faq" className="hover:text-[#123458] transition-colors">FAQ</a>
                    </nav>

                    <div className="hidden md:block">
                        <Button className="bg-[#123458] text-[#F1EFEC] rounded-2xl px-6 py-2 hover:opacity-90 shadow-lg hover:shadow-xl transition-all" asChild>
                            <Link href="/signup">Get Started</Link>
                        </Button>
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
                    <a href="#features" className="hover:text[#123458]" onClick={() => setIsOpen(false)}>Features</a>
                    <a href="#pricing" className="hover:text-[#123458]" onClick={() => setIsOpen(false)}>Pricing</a>
                    <a href="#faq" className="hover:text-[#123458]" onClick={() => setIsOpen(false)}>FAQ</a>
                    <Button className="bg-[#123458] text-[#F1EFEC] rounded-2xl px-6 py-3 mt-2" asChild>
                        <Link href="/signup" onClick={() => setIsOpen(false)}>Get Started</Link>
                    </Button>
                </div>
            )}
        </header>
    );
}