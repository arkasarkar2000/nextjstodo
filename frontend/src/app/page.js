'use client'

import "@/app/globals.css"
import Link from "next/link";
import { useState } from "react";

import { useRouter } from "next/navigation";


const page = () => {
  const router = useRouter()

    const [err,setErr] = useState("")

    const [post,setPost] = useState({
        name:"",
        email:"",
        password:""
    })

    const handleChange = (e)=>{
        const {name,value} = e.target
        setPost({...post,[name]:value,
        })
    }

    const handleClick = async (e) => {
        e.preventDefault()
        const apiUrl = "http://localhost:3001/signupuser";
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(post),
        };
      
        try {
          const response = await fetch(apiUrl, requestOptions);
          if (!response.ok) {
            setErr("Signup unsuccessful")
          }
          setErr("Signup Successful")
          setPost({
            name:"",
            email:"",
            password:""
          })
          router.push('/login')
          
        } catch (err) {
          console.error(err);
        }
      };


    return (
      <>
      <div className="main-container">
        <div className="side-container">
            <div class="side-text heading">NextJs Todo App</div>
            <div class="side-text">Please <Link href="/">signup</Link> to continue &#x1F449;</div>
          </div>
        <div className="signup-container">
        <h2>Sign Up</h2>
        <form className="signup-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" onChange={handleChange}/>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" onChange={handleChange}/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" onChange={handleChange} />
          </div>
          <button type="submit" onClick={handleClick} className="btn">Sign Up</button>
          <small>Already a user? <Link href="/login">Login</Link></small>
          <p>{err}</p>
        </form>
      </div>
      </div>
      </>
    );
}

export default page;