import SortByComponent from "@/components/dashboard/sort-by-component";
import TransactionsComponent from "@/components/dashboard/transactions-component";

export default function DashboardPage(){
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-6">
                <SortByComponent/>
                <TransactionsComponent/>
            </div>
        </div>
    )
}