"use client";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpDown, Clock, User, CheckCircle2, CircleSlash2, CircleEllipsis, ChevronRight } from "lucide-react";

export type GroupStatus = "paid" | "partiallyPaid" | "unpaid";

type Group = {
    id: string;
    name: string;
    status: GroupStatus;
    selfCreated: boolean;
    createdAt: string; // ISO
};

const sampleGroups: Group[] = [
    { id: "1", name: "Vacations Group", status: "unpaid", selfCreated: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() },
    { id: "2", name: "Taxi Group", status: "partiallyPaid", selfCreated: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString() },
    { id: "3", name: "Office Lunch", status: "paid", selfCreated: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() },
    { id: "4", name: "Flatmates", status: "unpaid", selfCreated: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString() },
    { id: "5", name: "Trip to Goa", status: "partiallyPaid", selfCreated: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() },
];

export type SortKey = "time" | "selfCreated" | "unpaid" | "partiallyPaid" | "paid";

type GroupsListProps = {
    variant?: "list" | "grid";
    title?: string;
    className?: string;
};

const sortOptions: { key: SortKey; label: string; icon?: React.ElementType }[] = [
    { key: "time", label: "Time", icon: Clock },
    { key: "selfCreated", label: "Self created", icon: User },
    { key: "unpaid", label: "Unpaid", icon: CircleSlash2 },
    { key: "partiallyPaid", label: "Partially paid", icon: CircleEllipsis },
    { key: "paid", label: "Paid", icon: CheckCircle2 },
];

export default function GroupsList({ variant = "list", title, className }: GroupsListProps) {
    const [sortBy, setSortBy] = useState<SortKey>("time");
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return q ? sampleGroups.filter((g) => g.name.toLowerCase().includes(q)) : sampleGroups;
    }, [query]);

    const groups = useMemo(() => {
        const arr = [...filtered];
        switch (sortBy) {
            case "time":
                return arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            case "selfCreated":
                return arr.sort((a, b) => Number(b.selfCreated) - Number(a.selfCreated));
            case "unpaid":
                return arr.sort((a, b) => Number(b.status === "unpaid") - Number(a.status === "unpaid"));
            case "partiallyPaid":
                return arr.sort((a, b) => Number(b.status === "partiallyPaid") - Number(a.status === "partiallyPaid"));
            case "paid":
                return arr.sort((a, b) => Number(b.status === "paid") - Number(a.status === "paid"));
            default:
                return arr;
        }
    }, [sortBy, filtered]);

    return (
        <div className={cn("w-full", className)}>
            <div className="flex flex-col gap-3 mb-4">
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    <span className="text-sm text-[#5c5c5c]">Sort : by</span>
                    <div className="glass border rounded-full p-1 flex items-center gap-1">
                        {sortOptions.map(({ key, label, icon: Icon }) => (
                            <button key={key} className={cn("rounded-full px-3 py-1 text-sm transition-colors", sortBy === key ? "bg-[#123458] text-[#F1EFEC]" : "text-[#123458] hover:bg-black/5")} onClick={() => setSortBy(key)}>
                                <span className="inline-flex items-center gap-1">
                                    {Icon ? <Icon className="w-4 h-4" /> : <ArrowUpDown className="w-4 h-4" />}
                                    {label}
                                </span>
                            </button>
                        ))}
                        <button className="rounded-full px-3 py-1 text-sm text-[#123458] hover:bg-black/5" onClick={() => { setSortBy("time"); setQuery(""); }}>
                            Clear
                        </button>
                    </div>
                </div>
                <div className="relative">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search groups..."
                        className="w-full glass border rounded-xl px-3 py-2 text-sm outline-none"
                    />
                </div>
            </div>

            {title && <h3 className="text-base font-semibold mb-3">{title}</h3>}

            {variant === "grid" ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groups.map((g) => (
                        <GroupCard key={g.id} group={g} />
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {groups.map((g) => (
                        <GroupRow key={g.id} group={g} />
                    ))}
                </div>
            )}
        </div>
    );
}

function GroupCard({ group }: { group: Group }) {
    const statusBadge = {
        unpaid: { label: "unpaid", color: "bg-red-100 text-red-700 border-red-200" },
        partiallyPaid: { label: "partially paid", color: "bg-amber-100 text-amber-800 border-amber-200" },
        paid: { label: "paid", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    }[group.status];

    return (
        <Card className="glass border rounded-2xl hover:shadow-md transition-all">
            <CardContent className="p-5">
                <div className="flex items-center justify-between gap-3">
                    <h4 className="font-semibold text-lg text-[#123458] truncate">{group.name}</h4>
                    <span className={cn("text-xs px-2 py-1 rounded-full border", statusBadge.color)}>{statusBadge.label}</span>
                </div>
                <div className="mt-3 text-sm text-[#5c5c5c] flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(group.createdAt).toLocaleString()}</span>
                </div>
                <div className="mt-2 text-xs text-[#5c5c5c]">
                    {group.selfCreated ? "You created this group" : "Shared with you"}
                </div>
                <div className="mt-4 flex items-center justify-end">
                    <Button size="sm" className="rounded-xl">Open</Button>
                </div>
            </CardContent>
        </Card>
    );
}

function GroupRow({ group }: { group: Group }) {
    const statusColor = {
        unpaid: "bg-red-500",
        partiallyPaid: "bg-amber-500",
        paid: "bg-emerald-500",
    }[group.status];

    const statusBadge = {
        unpaid: { label: "unpaid", color: "bg-red-100 text-red-700 border-red-200" },
        partiallyPaid: { label: "partially paid", color: "bg-amber-100 text-amber-800 border-amber-200" },
        paid: { label: "paid", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    }[group.status];

    return (
        <Card className="glass border rounded-2xl hover:shadow-sm transition-colors">
            <CardContent className="px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className={cn("size-8 rounded-full shrink-0", statusColor)} />
                        <div className="min-w-0">
                            <div className="font-medium text-[#123458] truncate">{group.name}</div>
                            <div className="text-xs text-[#5c5c5c] flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {new Date(group.createdAt).toLocaleDateString()} {group.selfCreated ? "• you created" : "• shared"}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={cn("text-xs px-2 py-1 rounded-full border whitespace-nowrap", statusBadge.color)}>{statusBadge.label}</span>
                        <ChevronRight className="w-4 h-4 text-[#5c5c5c]" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 