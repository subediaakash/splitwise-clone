import React, { useEffect, useState } from 'react'

function PaymentPortal({ userId, priceTableId }: any) {
    const [data, setData] = useState<any | null>(null)  // Start with null

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
            setData(result)  // Set the fetched data
        }

        fetchPaymentTable()
    }, [priceTableId, userId])

    const individualAmount = data ? (data.totalPrice / data.members.length).toFixed(2) : '0.00'

    // Fix: Use a variable to hold the payment status logic
    const isFullyPaid = data?.fullpaid; // Check for data existence before accessing fullpaid

    return (
        <div>
            <div>
                <div>
                    <p>Total Amount: {data ? data.totalPrice : 'Loading...'}</p>
                    <p>Individual Amount: {individualAmount}</p>
                    <div>
                        <p>Members</p>
                        {data?.members.map((member) => { return <h1>{member.name}</h1> })}
                    </div>
                    <p>Payment Status : {isFullyPaid ? <>Fully Paid</> : <>Not Paid</>}</p>
                </div>
            </div>
        </div>
    )
}

export default PaymentPortal