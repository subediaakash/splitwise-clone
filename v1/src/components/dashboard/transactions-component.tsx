"use client";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Transaction = {
    id: string;
    groupId: string;
    groupName: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    totalAmount: any; // Decimal-like from Prisma; we will stringify
    currency: string;
    status: string; // created, captured, failed, refunded
    createdAt: string; // ISO
};

function formatCurrency(amount: number, currency: string) {
    try {
        return new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(amount);
    } catch {
        // fallback for custom/OTHER currency
        const prefix = currency === "INR" ? "₹" : currency + " ";
        return `${prefix}${amount.toFixed(2)}`;
    }
}

function statusBadge(status: string) {
    const map: Record<string, { label: string; className: string }> = {
        created: { label: "created", className: "bg-amber-100 text-amber-800 border-amber-200" },
        captured: { label: "paid", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
        failed: { label: "failed", className: "bg-red-100 text-red-700 border-red-200" },
        refunded: { label: "refunded", className: "bg-sky-100 text-sky-800 border-sky-200" },
    };
    return map[status] ?? { label: status, className: "bg-gray-100 text-gray-700 border-gray-200" };
}

export default function TransactionsComponent(){
    const [transactions, setTransactions] = useState<Transaction[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        const fetchTx = async () => {
            try{
                setIsLoading(true);
                const res = await fetch("/api/transactions", { method: "GET" });
                const data: { transactions: Transaction[] } = await res.json();
                if(!mounted) return;
                setTransactions(data.transactions ?? []);
            } finally {
                if(mounted) setIsLoading(false);
            }
        };
        fetchTx();
        return () => { mounted = false };
    }, []);

    const totalPaid = useMemo(() => {
        const list = transactions ?? [];
        // Sum only successful payments
        return list
            .filter(t => t.status === "captured")
            .reduce((acc, t) => acc + Number(t.totalAmount ?? 0), 0);
    }, [transactions]);

    const currency = useMemo(() => (transactions && transactions[0]?.currency) || "INR", [transactions]);

    return (
        <div className="flex flex-col md:flex-row gap-4 w-full">
            <Card className="glass border rounded-2xl flex-1">
                <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-base font-semibold">Transactions</h3>
                    </div>
                    <div className="glass border rounded-2xl p-4">
                        <div className="text-sm font-medium mb-3">Past Transactions :</div>
                        {isLoading ? (
                            <ul className="space-y-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <li key={i} className="h-6 rounded bg-black/5 animate-pulse" />
                                ))}
                            </ul>
                        ) : !transactions || transactions.length === 0 ? (
                            <div className="text-sm text-[#5c5c5c]">No transactions yet.</div>
                        ) : (
                            <ul className="divide-y">
                                {transactions.slice(0, 10).map((t) => {
                                    const badge = statusBadge(t.status);
                                    const amount = Number(t.totalAmount ?? 0);
                                    return (
                                        <li key={t.id} className="py-2 flex items-center justify-between gap-3">
                                            <div className="min-w-0">
                                                <div className="text-sm text-[#123458] truncate">
                                                    <span className="font-medium">{t.groupName || "Group"}</span>
                                                    <span className="text-[#5c5c5c]"> • {new Date(t.createdAt).toLocaleString()}</span>
                                                </div>
                                                <div className="mt-1">
                                                    <span className={cn("text-xs px-2 py-0.5 rounded-full border", badge.className)}>{badge.label}</span>
                                                </div>
                                            </div>
                                            <div className="shrink-0 text-sm font-semibold text-[#123458]">
                                                {formatCurrency(amount, t.currency)}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="glass border rounded-2xl w-full md:w-64 shrink-0">
                <CardContent className="p-5">
                    <div className="text-base font-semibold mb-2">Total amount paid so far :</div>
                    {isLoading ? (
                        <div className="h-8 w-40 rounded bg-black/5 animate-pulse" />
                    ) : (
                        <div className="text-2xl text-[#123458] font-bold">
                            {currency === "INR" ? "Rs : " : ""}{formatCurrency(totalPaid, currency)}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
} 