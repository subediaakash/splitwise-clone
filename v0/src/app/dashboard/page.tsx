import React from 'react'
import { getServerSession } from 'next-auth'
import GetGroups from '@/components/GetGroups'

async function page() {
  const session = await getServerSession()
  return (
    
    <div>
      <div className='flex justify-center p-6 uppercase font-mono font-extrabold text-2xl text-white shadow-sm'>
        Groups that you are in 
      </div>
      <GetGroups />
    </div>
  )
}

export default page
