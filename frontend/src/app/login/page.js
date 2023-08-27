'use client'

import "@/app/globals.css"
import Link from "next/link";
import { useState } from "react";
import {useRouter} from "next/navigation";

const page = () => {
  const router = useRouter()
  const [err,setErr] = useState("")

  const [post,setPost] = useState({
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
  const apiUrl = "http://localhost:3001/loginuser";
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
      setErr("Login Unsuccessful")
    }else{
      const data = await response.json()
      if(data.token && data.userId){
        setErr("Login Success")
        router.push(`/todo/${data.userId}`)
      }else{
        setErr("Login Unsuccessful")
      }
    }
    
  } catch (err) {
    console.error(err);
  }
};

    return (

      <>
        <div className="main-container">
          <div className="side-container">
            <div class="side-text heading">NextJs Todo App</div>
            <div class="side-text">Please <Link href="">login</Link> to continue &#x1F449;</div>
          </div>
            <div className="signup-container">
            <h2>Login</h2>
            <form className="signup-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" onChange={handleChange}/>
              </div>
              <button type="submit" onClick={handleClick} className="btn">Log In</button>
              <small>Don't have an account? <Link href="/">Signup</Link></small>
              <p className="error">{err}</p>
            </form>
          </div>
      </div>
      </>
    );
}

export default page;