import React from 'react'
import { getServerSession } from 'next-auth'
import GetGroups from '@/components/GetGroups'

async function page() {
  const session = await getServerSession()
  return (
    // <div>
    //     {session?.user?.email}
    //   Groups Created By You
    //   <GetGroups/>
    //   Group that you are in 

    // </div>
    <div>
      THis is the dashboard
      <GetGroups />
    </div>
  )
}

export default page
