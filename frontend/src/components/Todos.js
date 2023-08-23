'use client'

import { useEffect, useState } from "react";
import "../app/globals.css"
import Link from "next/link";
import { useRouter } from "next/navigation";

const Todos = () => {
  const router = useRouter()
    const [todos,setTodos] = useState([])

    const [post,setPost] = useState({
        title:"",
        text:""
    })

    
        // handling input changes
        const handleChange = (e)=>{
          const {name,value} = e.target
          setPost({...post,[name]:value,
          })
      }

    //handling click to add todo
    const handleClick = async () => {
      const apiUrl = "http://localhost:3001/create";
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
          throw new Error("Network response was not ok");
        }
        alert("ToDo added")
        setPost({
          title:"",
          text:""
        })
        router.reload
        
        
      } catch (err) {
        console.error(err);
      }
    };



    //showing all todos on reload
    useEffect(()=>{
        const getAllTodos = async () => {
            try {
              const apiUrl = "http://localhost:3001/todos";
              const response = await fetch(apiUrl);
          
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              const data = await response.json();
              setTodos(data);
              console.log(todos)
            } catch (err) {
              console.error(err);
            }
          };
        getAllTodos();
    },[])

    //deleting from todo list
    const handleDelete = async (id) => {
        try {
          const response = await fetch(`http://localhost:3001/todos/${id}`, {
            method: 'DELETE',
          });
          if (response.ok) {  
            setTodos((prev)=> prev.filter((i)=> i.id!== id))
          } else {
            console.log('Error:', response.statusText);
          }
        } catch (err) {
          console.error(err);
        }
      };

    return (
        <>
        <div className="form">
            <h1>Add new todos</h1>
            <input type="text" placeholder="title" name="title" onChange={handleChange} required></input>
            <textarea type="text" placeholder="Enter your todo" name="text" onChange={handleChange} required></textarea><br></br>
            <button onClick={handleClick} className="add">ADD TODO</button>
        </div>
    
        <div className="todo-container">
            {todos ? todos.map(item=>(
            <>
                <div className="card" key={item.id}>
                    <h2 className="title">{item.title}</h2>
                    <button className="update"><Link href = {`/update/${item.id}`}>Update</Link></button>
                    <button onClick={()=> handleDelete(item.id)} className="delete"> Delete </button>
                    <p className="desc">{item.text}</p>
                </div>
            </>
            )
            ):<h2>No todos</h2>}
            
        </div>
        </>
    );
}

export default Todos;