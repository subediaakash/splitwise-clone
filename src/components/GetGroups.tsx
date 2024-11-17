"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import DefaultNoGroup from "./DefaultNoGroup";

export default function GetGroups() {
  const [priceTables, setPriceTables] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchData() {
      if (!session?.user?.email) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/getPriceTable`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: session.user.email }),
          }
        );

        if (!response.ok) throw new Error("Failed to fetch price tables");

        const data = await response.json();
        const unpaidTables = data.filter((table: any) => !table.userHasPaid);
        setPriceTables(unpaidTables);
      } catch (error) {
        console.error("Error fetching price tables:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [session]);

  if (isLoading) return <LoadingSkeleton />;
  if (priceTables.length === 0) return <DefaultNoGroup />;

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl space-y-4">
        {priceTables.map((priceTable: any) => (
          <PriceTableCard
            key={priceTable.id}
            priceTable={priceTable}
            router={router}
          />
        ))}
      </div>
    </div>
  );
}

function PriceTableCard({ priceTable, router }: any) {
  const amountToPay = (
    priceTable.totalPrice / priceTable.members.length
  ).toFixed(2);

  return (
    <Card className="bg-primary text-primary-foreground">
      <CardHeader>
        <CardTitle>Bill Summary - {priceTable.description}</CardTitle>
        <CardDescription className="text-primary-foreground/70">
          Please confirm your group membership before paying.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between font-semibold">
          <span>Total Bill</span>
          <span>${priceTable.totalPrice.toFixed(2)}</span>
        </div>
        <Separator className="bg-primary-foreground/20" />
        <div className="grid gap-2">
          {priceTable.members.map((member: any) => (
            <div key={member.id} className="flex items-center justify-between">
              <span>{member.name}</span>
              <span className="font-medium text-primary-foreground/70">
                ${amountToPay}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <p className="text-primary-foreground/70">
            {priceTable.fullPaid ? "Fully Paid" : "Not Fully Paid"}
          </p>
          <p>
            Remaining Amount:{" "}
            <span className="text-red-400 font-semibold">
              ${priceTable.amountRemaining.toFixed(2)}
            </span>
          </p>
        </div>
        <Button
          onClick={() => router.push(`/info/${priceTable.id}`)}
          variant="secondary"
          className="font-semibold"
        >
          Pay now
        </Button>
      </CardFooter>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-primary text-primary-foreground">
            <CardHeader>
              <Skeleton className="h-6 w-2/3 bg-primary-foreground/20" />
              <Skeleton className="h-4 w-1/2 bg-primary-foreground/20" />
            </CardHeader>
            <CardContent className="space-y-2">
              {[...Array(4)].map((_, j) => (
                <Skeleton
                  key={j}
                  className="h-4 w-full bg-primary-foreground/20"
                />
              ))}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 bg-primary-foreground/20" />
                <Skeleton className="h-4 w-32 bg-primary-foreground/20" />
              </div>
              <Skeleton className="h-10 w-24 bg-primary-foreground/20" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
