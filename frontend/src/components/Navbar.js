'use client'

import { useRouter } from "next/navigation";
import "../app/globals.css"
import Link from "next/link";

const Navbar = () => {
    const router = useRouter()
    const handleLogout= async()=>{
        try{
            await fetch("http://localhost:3001/logout",{
                method: 'POST',
                credentials: 'include'
            });

            router.push("/login")
        }catch(err){
            console.log(err)
        }
    };


    return (
        <div className="header">
            <div className="logo">
                <a href="/todo">TODO APPLICATION</a>
            </div>
            <div className="navbar">
                <Link href="/" onClick={handleLogout}>Logout</Link>
            </div>
            
        </div>
    );
}

export default Navbar;