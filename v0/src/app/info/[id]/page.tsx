"use client";

import PaymentPortal from "@/components/PaymentPortal";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

function Page({ params }: { params: { id: number } }) {
  const { data: session } = useSession();
  const email = session?.user?.email;
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      if (email) {
        const response = await fetch(`http://localhost:3000/api/getUser`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        setUserId(parseInt(data.id));
      }
    };

    fetchUserId();
  }, [email]);

  return (
    <div>
      {<PaymentPortal userId={userId} priceTableId={params.id} />}
    </div>
  );
}

export default Page;
