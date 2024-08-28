'use client'
import Link from "next/link"
import { FaRegUserCircle } from "react-icons/fa";

function Navbar() {
    return (
        <div className="border-2 shadow-md shadow-[#484d52] flex justify-between bg-white">
            <div className="font-extrabold text-lg p-5">
                <p className="text-gray-500">SPIT TOGETHER</p>
            </div>
            <div className="flex gap-4 items-center p-5 font-semibold text-[#15324d]">                
                <ul className="flex gap-2">
                    <Link href={"/dashboard"}>DASHBOARD</Link>
                    <Link href={"/create"}>SPLIT MONEY</Link>
                </ul>
                <div className="user">
                    <p><FaRegUserCircle /></p>
                </div>
            </div>
            
        </div>
    )
}

export default Navbar
