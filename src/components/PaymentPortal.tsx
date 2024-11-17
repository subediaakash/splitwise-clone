import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Users, CreditCard, Info } from "lucide-react";
import ConfirmPay from "./ConfirmPay";

function PaymentPortal({ userId, priceTableId }: any) {
  const [data, setData] = useState(null);

  useEffect(() => {
    // @ts-ignore

    const fetchPaymentTable = async () => {
      const response = await fetch(
        `http://localhost:3000/api/getPriceTable/${priceTableId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );
      const result = await response.json();
      setData(result);
    };
    fetchPaymentTable();
  }, [priceTableId, userId]);
  const individualAmount = data
    ? // @ts-ignore

      (data.totalPrice / data.members.length).toFixed(2)
    : "0.00";
  // @ts-ignore

  const isFullyPaid = data?.fullpaid;

  function capitalizeFirstLetter(string: string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  }

  return (
    <div className="flex justify-center items-center min-h-[90vh] bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Payment Details</h2>
            <Badge variant="secondary" className="bg-blue-500/20 text-white">
              {isFullyPaid ? "Paid" : "Pending"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {!data ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <CreditCard className="h-5 w-5" />
                    <span className="font-semibold">Total Amount</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">
                    ${data.totalPrice}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <CreditCard className="h-5 w-5" />
                    <span className="font-semibold">Per Person</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">
                    ${individualAmount}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Info className="h-5 w-5" />
                  <span className="font-semibold">Description</span>
                </div>
                <p className="text-gray-700">{data.description}</p>
              </div>

              {/* Members Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <Users className="h-5 w-5" />
                  <span className="font-semibold">Members</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {data.members.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-white p-2 rounded"
                    >
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-gray-700">
                        {capitalizeFirstLetter(member.name)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="bg-gray-50 p-4 flex justify-between items-center rounded-b-lg">
          <Badge
            variant={isFullyPaid ? "success" : "destructive"}
            className={`px-4 py-2 ${
              isFullyPaid
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isFullyPaid ? "Fully Paid" : "Payment Required"}
          </Badge>
          <ConfirmPay
            triggerName="Pay now"
            userId={userId}
            tableId={priceTableId}
          />
        </CardFooter>
      </Card>
    </div>
  );
}

export default PaymentPortal;
