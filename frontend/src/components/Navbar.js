'use client'

import { useRouter } from "next/navigation";
import "../app/globals.css"
import Link from "next/link";

const Navbar = ({userName,searchTodo}) => {
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
        <h2>TODO APPLICATION</h2>
            </div>
            <div className="search-container">
              <input type="search" placeholder="Search todos" onChange={searchTodo} id="search" />
          </div>
            <div className="navbar">
                <h3>Welcome, {userName}</h3>
                <Link href="/" onClick={handleLogout}>Logout</Link>
            </div>
            
        </div>
    );
}

export default Navbar;