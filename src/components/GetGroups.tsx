'use client'
import { useState, useEffect } from "react"
import { getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import { IoMdRemoveCircleOutline } from "react-icons/io"

function GetGroups() {
  const [priceTables, setPriceTables] = useState([])
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      const session = await getSession()
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getPriceTable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: session?.user?.email }),
      });
      const data = await response.json()
      console.log('Data fetched:', data);
      // Filter out tables where the user has already paid
      const unpaidTables = data.filter(table => !table.userHasPaid);
      setPriceTables(unpaidTables)
    }
    fetchData()
  }, [])

  return (
    <div className="flex justify-center">
      <div className="w-[30vw] space-y-4">
        {priceTables.map((priceTable) => {
          // Calculate the amount to pay for each member
          const amountToPay = (priceTable.totalPrice / priceTable.members.length).toFixed(2);
          return (
            <Card key={priceTable.id}>
              <div className="w-[29vw] flex justify-end items-end">
                <button className="p-3"><IoMdRemoveCircleOutline /></button>
              </div>
              <CardHeader>
                <CardTitle>Bill Summary - {priceTable.description}</CardTitle>
                <CardDescription>Review the details of your bill and the amounts owed by each person.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <span>Total Bill</span>
                    <span className="font-medium">${priceTable.totalPrice.toFixed(2)}</span>
                  </div>
                  <Separator />
                </div>
                <div className="grid gap-2">
                  {priceTable.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <span>{member.name}</span>
                      <span className="font-medium">${amountToPay}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div>
                  <p className="text-gray-600">{priceTable.fullPaid ? "Fully Paid" : "Not Fully Paid"}</p>
                  <p>Remaining Amount: ${priceTable.amountRemaining.toFixed(2)}</p>
                </div>
                <Button onClick={() => router.push(`/pay/${priceTable.id}`)}>
                  Pay now
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default GetGroups