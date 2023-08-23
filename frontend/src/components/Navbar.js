'use client'
import { useRouter } from "next/navigation";
import "../app/globals.css"

const Navbar = () => {
    const router = useRouter()
    const {pathname} = router
    return (
        <div className="header">
            <div className="logo">
                <a href="/">TODO APPLICATION</a>
                
            </div>
            <div className="navbar">
                <a href="/">SignUp</a>
                
            </div>
            
        </div>
    );
}

export default Navbar;