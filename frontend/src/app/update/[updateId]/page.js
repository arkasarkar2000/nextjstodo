'use client'

import { useState } from "react";
import { usePathname,useRouter} from 'next/navigation';


const Page = () => {
    const pathname = usePathname()
    const todoId = pathname.slice(pathname.lastIndexOf('/')+1)
    const router = useRouter()
   

    const [post, setPost] = useState({
        title: "",
        text: ""
    });

    const handleClick = async () => {
        try {
            const apiUrl = `http://localhost:3001/update/${todoId}`;
            const requestOptions = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(post)
            };

            const response = await fetch(apiUrl, requestOptions);

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            alert("Todo Updated");
            router.push('/')
        } catch (err) {
            console.error(err);
        }
    };

    // handling input changes
    const handleChange = (e) => {
        setPost((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="form">
            <h1>Update todo</h1>
            <input type="text" placeholder="title" name="title" onChange={handleChange} required />
            <textarea type="text" placeholder="Enter your todo" name="text" onChange={handleChange} required />
            <br />
            <button onClick={handleClick} className="add">
                UPDATE TODO
            </button>
        </div>
    );
};

export default Page;