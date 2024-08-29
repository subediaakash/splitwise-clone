'use client'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
  import { useRouter } from "next/navigation";
  import React from "react";
  
  function ConfirmPay({triggerName, tableId, userId}: {triggerName: string, tableId: number, userId: number}) {
    const router = useRouter();
  
    async function handleClick() {
      try {
        const response = await fetch(`http://localhost:3000/api/pay/${tableId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });
        console.log(response);
        router.push("/dashboard");
      } catch (error) {
        console.error("Error occurred during payment:", error);
      }
    }
  
    return (
      <div className="text-white border p-3">
        <AlertDialog>
          <AlertDialogTrigger>{triggerName}</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will deduct some amount of money from your account
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleClick}>Pay</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }
  
  export default ConfirmPay;
  