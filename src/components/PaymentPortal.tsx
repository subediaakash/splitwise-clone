import { MdCardMembership } from "react-icons/md";
import React, { useEffect, useState } from 'react'
import ConfirmPay from "./ConfirmPay";

function PaymentPortal({ userId, priceTableId }: any) {
    const [data, setData] = useState<any | null>(null)  

    useEffect(() => {
        const fetchPaymentTable = async () => {
            const response = await fetch(`http://localhost:3000/api/getPriceTable/${priceTableId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId })
            })

            const result = await response.json()
            console.log(result)
            setData(result)  
        }

        fetchPaymentTable()
    }, [priceTableId, userId])

    const individualAmount = data ? (data.totalPrice / data.members.length).toFixed(2) : '0.00'

    const isFullyPaid = data?.fullpaid; 
    function capitalizeFirstLetter(string: string): string {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return (
        <div className='flex justify-center items-center lg:h-[90vh]'>
            <div className='border lg:w-[40vw] lg:h-[50vh] p-4 bg-[#15324d]'>
                <div>
                    <div className='flex justify-center font-bold text-2xl p-7'>
                        <p className='text-[#c4def5]'>TABLE DESCRIPTION</p>
                    </div>
                    <div className='pl-4 flex flex-col gap-2 font-mono'>
                    <p className='text-white text-xl font-semibold'>Total Amount : {data ? data.totalPrice : 'Loading...'}</p>
                    <p className='text-white text-xl font-semibold'>Individual Amount : {individualAmount}</p>
                    <p className='text-white text-xl font-medium'>Description : {data ? data.description : 'Loading...'}</p>
                    </div>
                    <div className='flex justify-center flex-col  text-2xl p-7'>
                        <div className="flex items-center gap-2">
                        <p className='text-white font-bold font-mono'>Members  </p>
                        <MdCardMembership color="white"/> 
                        </div>
                        {data?.members.map((member:any) => { return <h1 className="text-white pl-3 font-mono text-base">{capitalizeFirstLetter(member.name)}</h1> })}
                    </div >
                    <div className="flex justify-between p-4">
                    <p className="text-white p-2 border ">Payment Status : {isFullyPaid ? <span className="text-green-400">Fully Paid</span> : <span className="text-red-500">Not Paid</span>}</p>
                    <p></p>
                    <ConfirmPay triggerName="Pay now" userId={userId} tableId={priceTableId} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentPortal