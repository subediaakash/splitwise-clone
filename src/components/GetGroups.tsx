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
import DefaultNoGroup from "./DefaultNoGroup"

function GetGroups() {
  const [priceTables, setPriceTables] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
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
      
      const unpaidTables = data.filter(table => !table.userHasPaid);      setPriceTables(unpaidTables)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) {
    return <div>Loading...</div>  
  }

  if (priceTables.length === 0) {
    return <DefaultNoGroup />
  }
  return (
    <div className="flex justify-center ">
      <div className="lg:w-[35vw] space-y-4">
        {priceTables.map((priceTable) => {
          const amountToPay = (priceTable.totalPrice / priceTable.members.length).toFixed(2);
          return (
            <Card key={priceTable.id} className="bg-[#071a2b] text-white">
              <div className="w-[29vw] flex justify-end items-end">
              </div>
              <CardHeader>
                <CardTitle className="text-white">Bill Summary - {priceTable.description}</CardTitle>
                <CardDescription className="text-slate-400">Please make sure you were the part of group or not before paying.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total Bill</span>
                    <span className="font-semibold">${priceTable.totalPrice.toFixed(2)}</span>
                  </div>
                  <Separator />
                </div>
                <div className="grid gap-2">
                  {priceTable.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <span>{member.name}</span>
                      <span className="font-medium text-slate-600">${amountToPay}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div>
                  <p className="text-gray-400">{priceTable.fullPaid ? "Fully Paid" : "Not Fully Paid"}</p>
                  <p>Remaining Amount : <span className="text-red-700 font-semibold">${priceTable.amountRemaining.toFixed(2)}</span></p>
                </div>
                <Button onClick={() => router.push(`/info/${priceTable.id}`)} className="text-white border font-semibold">
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