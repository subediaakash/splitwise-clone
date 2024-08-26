'use client'
import Link from "next/link"
import { FaRegUserCircle } from "react-icons/fa";

function Navbar() {
    return (
        <div>
            <div className="flex gap-4 items-center">
                <ul className="flex gap-2">
                    <Link href={"/dashboard"}>Dashboard</Link>
                    <Link href={"/create"}>SplitMoney</Link>
                </ul>
                <div className="user">
                    <p><FaRegUserCircle /></p>
                </div>
            </div>
        </div>
    )
}

export default Navbar
