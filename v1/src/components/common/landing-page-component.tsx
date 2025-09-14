"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle2, Quote, Users, PieChart, ShieldCheck, Wallet } from "lucide-react";
import Navbar from "./navbar";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
    const { scrollY } = useScroll();
    const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.85]);
    const heroTranslate = useTransform(scrollY, [0, 300], [0, -20]);

    const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

    useEffect(() => {
        // prefer yearly by default on wider screens
        if (typeof window !== "undefined" && window.innerWidth >= 768) {
            setBilling("yearly");
        }
    }, []);

    const price = (monthly: number) => billing === "monthly" ? monthly : Math.round(monthly * 10);

    return (
        <main className="min-h-screen flex flex-col bg-[#F1EFEC] text-[#030303] relative overflow-hidden">
            {/* background grid */}
            <div className="absolute inset-0 bg-grid pointer-events-none" />
            {/* gradient blobs */}
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#123458]/20 rounded-full blur-3xl animate-blob" />
            <div className="absolute top-40 -right-24 w-80 h-80 bg-[#6aa3d6]/20 rounded-full blur-3xl animate-blob" />

            <Navbar />

            {/* Hero Section */}
            <section className="relative flex flex-col items-center justify-center text-center px-6 pt-24 md:pt-32 pb-20">
                <motion.div style={{ opacity: heroOpacity, y: heroTranslate }} className="max-w-5xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-gradient text-5xl md:text-7xl font-extrabold leading-tight tracking-tight"
                    >
                        Manage Groups & Split Expenses Effortlessly
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-[#3a3a3a] leading-relaxed"
                    >
                        Create groups, add expenses, and settle up without the awkwardness. Smooth, fast, and privacy-first.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="mt-10 flex flex-wrap gap-4 justify-center"
                    >
                        <Button className="bg-[#123458] text-[#F1EFEC] rounded-2xl px-8 py-4 text-lg flex items-center gap-2 hover:scale-[1.02] hover:shadow-xl transition-all" asChild>
                            <Link href="/signup">Start for Free <ArrowRight className="w-5 h-5" /></Link>
                        </Button>
                        <Button variant="outline" className="border-2 border-[#123458] text-[#123458] rounded-2xl px-8 py-4 text-lg hover:bg-[#123458] hover:text-[#F1EFEC] transition-all" asChild>
                            <a href="#features">Learn More</a>
                        </Button>
                    </motion.div>
                    <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm text-[#5c5c5c]">
                        {["No ads", "Multi-currency", "Realtime sync", "Secure by default"].map((k) => (
                            <div key={k} className="glass rounded-xl py-2 px-3 border animate-float">{k}</div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Feature Section */}
            <section id="features" className="py-28 px-6">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
                    {[
                        { title: "Create & Manage Groups", desc: "Organize trip, home, or project groups with ease.", icon: Users },
                        { title: "Smart Expense Splits", desc: "Equal, percentage, shares, or exact amounts.", icon: PieChart },
                        { title: "Track Settlements", desc: "Crystal-clear who owes whom, always.", icon: Wallet },
                        { title: "Multi-Currency", desc: "Travel-ready with currency support.", icon: PieChart },
                        { title: "Beautiful Analytics", desc: "Understand spend patterns instantly.", icon: PieChart },
                        { title: "Secure & Private", desc: "Best practices, encrypted in transit.", icon: ShieldCheck }
                    ].map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.12 }}
                        >
                            <Card className="rounded-3xl glass border shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                                <CardContent className="p-7">
                                    <div className="flex items-center gap-3 mb-3">
                                        <feature.icon className="w-6 h-6 text-[#123458]" />
                                        <h3 className="text-xl font-bold text-[#123458]">{feature.title}</h3>
                                    </div>
                                    <p className="text-[#5c5c5c] text-base leading-relaxed">{feature.desc}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* How it works Section */}
            <section id="how-it-works" className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-4xl font-bold text-center"
                    >
                        How it works
                    </motion.h3>
                    <div className="grid md:grid-cols-3 gap-8 mt-12">
                        {[
                            { step: "1", title: "Create a group", desc: "Set up your group and invite friends via link." },
                            { step: "2", title: "Add expenses", desc: "Log spending and choose a split method." },
                            { step: "3", title: "Settle up", desc: "Track balances and settle with one click." }
                        ].map((item, index) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                            >
                                <Card className="rounded-3xl bg-[#F8F6F3] border">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3 text-xl">
                                            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#123458] text-[#F1EFEC] font-bold">{item.step}</span>
                                            {item.title}
                                        </CardTitle>
                                        <CardDescription>{item.desc}</CardDescription>
                                    </CardHeader>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section with toggle */}
            <section id="pricing" className="py-24 px-6 bg-[#E7E0D8]">
                <div className="max-w-6xl mx-auto">
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-4xl font-bold text-center"
                    >
                        Pricing
                    </motion.h3>

                    <div className="flex justify-center mt-6">
                        <div className="glass border rounded-full p-1 flex items-center text-sm">
                            <button onClick={() => setBilling("monthly")} className={`px-4 py-1 rounded-full transition-colors ${billing === "monthly" ? "bg-[#123458] text-[#F1EFEC]" : "text-[#123458]"}`}>Monthly</button>
                            <button onClick={() => setBilling("yearly")} className={`px-4 py-1 rounded-full transition-colors ${billing === "yearly" ? "bg-[#123458] text-[#F1EFEC]" : "text-[#123458]"}`}>Yearly</button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mt-12">
                        {[
                            {
                                name: "Free",
                                monthly: 0,
                                features: ["Unlimited groups", "Basic splits", "Email support"],
                                cta: "Get started",
                                featured: false
                            },
                            {
                                name: "Pro",
                                monthly: 5,
                                features: ["Advanced splits", "Analytics dashboard", "Priority support"],
                                cta: "Start Pro",
                                featured: true
                            },
                            {
                                name: "Teams",
                                monthly: 12,
                                features: ["Team management", "Export reports", "SSO (soon)"],
                                cta: "Contact sales",
                                featured: false
                            }
                        ].map((plan, index) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                            >
                                <Card className={`rounded-3xl ${plan.featured ? "border-[#123458] border-2 shadow-2xl" : "shadow-lg"} glass`}>
                                    <CardHeader>
                                        <CardTitle className="text-2xl flex items-baseline gap-2">
                                            {plan.name}
                                        </CardTitle>
                                        <motion.div
                                            key={billing}
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="text-4xl font-extrabold"
                                        >
                                            {plan.name === "Teams" ? `$${price(plan.monthly)}` : `$${price(plan.monthly)}`} <span className="text-lg font-medium text-[#5c5c5c]">{billing === "monthly" ? "/mo" : "/yr"}</span>
                                        </motion.div>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3">
                                            {plan.features.map((f) => (
                                                <li key={f} className="flex items-center gap-2">
                                                    <CheckCircle2 className="text-[#123458] w-5 h-5" />
                                                    <span>{f}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full rounded-xl" asChild>
                                            <Link href="/signup">{plan.cta}</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-4xl font-bold text-center"
                    >
                        Loved by groups everywhere
                    </motion.h3>
                    <div className="grid md:grid-cols-3 gap-8 mt-12">
                        {[
                            { quote: "Made our trip expenses painless!", author: "Ayesha" },
                            { quote: "No more awkward who-owes-who chats.", author: "Rohit" },
                            { quote: "The analytics are a game-changer for our flat.", author: "Meera" }
                        ].map((t, index) => (
                            <motion.div
                                key={t.author}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                            >
                                <Card className="rounded-3xl glass border shadow-md hover:-translate-y-1 hover:shadow-lg transition-transform">
                                    <CardContent className="p-6">
                                        <Quote className="w-6 h-6 text-[#123458]" />
                                        <p className="mt-4 text-lg">“{t.quote}”</p>
                                        <p className="mt-2 text-sm text-[#5c5c5c]">— {t.author}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-24 px-6 bg-[#D4C9BE]">
                <div className="max-w-4xl mx-auto">
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-4xl font-bold text-center"
                    >
                        Frequently asked questions
                    </motion.h3>
                    <div className="mt-10 space-y-4">
                        {[
                            { q: "Is it free to use?", a: "Yes. You can manage unlimited groups on the Free plan. Pro adds advanced features." },
                            { q: "How do I invite friends?", a: "Create a group and share the invite link or add them by email." },
                            { q: "Can I export reports?", a: "Yes, Pro and Teams plans can export CSV summaries and reports." }
                        ].map((item) => (
                            <details key={item.q} className="group glass border rounded-2xl p-5 shadow-sm open:shadow-md">
                                <summary className="cursor-pointer list-none text-lg font-semibold flex justify-between items-center">
                                    <span>{item.q}</span>
                                    <span className="ml-4 text-[#123458] transition-transform group-open:rotate-180">▾</span>
                                </summary>
                                <p className="mt-3 text-[#5c5c5c]">{item.a}</p>
                            </details>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <Button className="bg-[#123458] text-[#F1EFEC] rounded-2xl px-8 py-4 text-lg" asChild>
                            <Link href="/signup">Create your first group</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-24 bg-[#123458] text-[#F1EFEC] text-center px-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-15 pointer-events-none" />
                <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl md:text-4xl font-bold max-w-3xl mx-auto"
                >
                    Ready to simplify expense management?
                </motion.h3>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mt-4 max-w-xl mx-auto text-lg text-[#E8E6E3]"
                >
                    Join thousands of users who already trust our app for hassle-free group expense tracking.
                </motion.p>
                <Button className="mt-8 bg-[#F1EFEC] text-[#123458] font-semibold rounded-2xl px-8 py-4 text-lg hover:scale-105 hover:shadow-2xl transition-all" asChild>
                    <Link href="/signup">Get Started Now</Link>
                </Button>
            </section>

            {/* Footer */}
            <footer className="bg-[#030303] text-[#F1EFEC] py-10 text-center text-sm">
                <p>&copy; {new Date().getFullYear()} Splitwise Pro. All rights reserved.</p>
            </footer>
        </main>
    );
}
