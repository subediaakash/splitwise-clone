import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from './ui/button'
import { useRouter } from "next/navigation"

function DefaultNoGroup() {
    const router = useRouter()
    return (
        <div className='flex justify-center items-center h-[80vh] '>
        <Card className=" lg:w-[45vw] lg:h-[40vh]   flex justify-center flex-col bg-[#0b3036] text-white">
          <CardHeader className='flex flex-col gap-2'>
            <CardTitle>No Group Expenses </CardTitle>
            <CardDescription>Congrats you dont have to pay anywhere !!</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-xl">Join a group to collaborate with others and access shared resources.</p>
            <Button onClick={()=>{router.push('/create')}}>Find Groups</Button>
          </CardContent>
        </Card>
        </div>
      )
  
}

export default DefaultNoGroup