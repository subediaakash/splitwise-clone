'use client'
import { useState, useEffect } from "react"
import { getSession } from "next-auth/react"
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
import { IoMdRemoveCircleOutline } from "react-icons/io";

function GetGroups() {
  const [priceTables, setPriceTables] = useState([])

  useEffect(() => {
    async function fetchData() {
      const session = await getSession()
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getPriceTable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(session?.user?.email),
      });
      const data = await response.json()
      setPriceTables(data)
    }
    fetchData()
  }, [])

  return (
    <div className="flex justify-center">
      <div className="w-[30vw] space-y-4">
        {priceTables.map((priceTable) => (
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
                    <span className="font-medium">${(priceTable.totalPrice / priceTable.members.length).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <span>{priceTable.fullPaid ? "Fully Paid" : "Not Fully Paid"}</span>
              <Button>Pay now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

type priceTable = {
  id: number,
  description: string,
  fullPaid: boolean,
  totalPrice: number,
  members: {}
}

export default GetGroups