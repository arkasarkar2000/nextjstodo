'use client'

import { useEffect, useState, useRef } from "react";
import "../app/globals.css"
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";


const Todos = () => {
  const pathname = usePathname()
  const user_id = pathname.slice(pathname.lastIndexOf('/')+1)
  const [showTodo,setShowTodo] = useState(false)
  const[token,setToken] = useState("")
  const [todos,setTodos] = useState([])
  const [post,setPost] = useState({
        title:"",
        text:""
    })
  const[userName,setUserName] = useState("")

  const [filterStatus,setFilterStatus] = useState("all")
  const [filteredTodos,setFilteredTodos] = useState([])


    const[refetch,setRefetch] = useState(false)
    const titleInputRef = useRef(null);
    const textInputRef = useRef(null);

  useEffect(() => {
      const clientToken = localStorage.getItem('token')
      const clientName = localStorage.getItem("userName")
      if(clientToken && clientName){
        setToken(clientToken)
        setUserName(clientName)
      }
  }, []); 

  // handling input changes
   const handleChange = (e)=>{
      const {name,value} = e.target
      setPost({...post,[name]:value,
      })
  }

    //handling click to add todo
    const handleClick = async () => {
      const apiUrl = `http://localhost:3001/create/${user_id}`;
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(post),
      };
      try {
        const response = await fetch(apiUrl, requestOptions);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        setPost({
          title:"",
          text:""
        })
        titleInputRef.current.value = ""
        textInputRef.current.value = ""

        setRefetch(true)
      } catch (err) {
        console.error(err);
      }
    };

    //showing all todos on reload according to user token
    useEffect(()=>{
        const getAllTodos = async () => {
            try {
              const apiUrl = `http://localhost:3001/todos/${user_id}`;
              const requestOptions = {
                method: "GET",
                headers:{
                  'Authorization':`Bearer ${token}`,
                },
              };
              const response = await fetch(apiUrl,requestOptions);
          
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              const data = await response.json();
              setTodos(data);
            } catch (err) {
              console.error(err);
            }
          };
          getAllTodos()
        setRefetch(false)
    },[token,user_id,refetch])

    
    //deleting from todo list
    const handleDelete = async (id) => {
        try {
          const response = await fetch(`http://localhost:3001/todos/${id}`, {
            method: 'DELETE',
            headers:{
              'Authorization':`Bearer ${token}`,
            }
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

      //search feature for our todo
      const searchTodo = () => {
        const searchbox = document.getElementById("search").value.toLowerCase();
        const items = document.querySelectorAll(".card");
      
        items.forEach((item) => {
          const titleElement = item.querySelector(".title");
          const descElement = item.querySelector(".desc");
      
          if (titleElement && descElement) {
            const titleText = titleElement.textContent.toLowerCase();
            const descText = descElement.textContent.toLowerCase();
      
            if (titleText.includes(searchbox) || descText.includes(searchbox)) {
              item.style.display = "";
            } else {
              item.style.display = "none";
            }
          }
        });
      };


      //updating the status of our todos 
      const handleStatusChange = async (id,status)=>{
        const apiUrl = `http://localhost:3001/todos/${id}`
        const requestOptions = {
          method: "PUT",
          headers:{
            "Content-Type":"application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({is_completed: status === "completed"})
        }
        try{
          const response = await fetch (apiUrl,requestOptions)
          if(!response.ok){
            return response.json({mssg:"Error"}).status(400)
          }

          const updatedTodos = todos.map((item)=>{
            if(item.id===id){
              return {...item, is_completed: status==="completed"}
            }
            return item
          })
          setTodos(updatedTodos)
          return response.json({mssg:"success"}).status(500)
        }catch(err){
          console.log(err)
        }
      }
      const handleCopy = ()=>{
        let copiedText = document.getElementById("copytext")

        copiedText.select()
        document.execCommand("copy")

      }

      
      const handleSecondCopy = (id)=>{
        let copiedText1 = document.getElementById(`todo-desc-${id}`)
        copiedText1.select()
        document.execCommand("copy")
      }

      const handleFilter = (status)=>{
        setFilterStatus(status)
        if(status === "completed"){
          const completedTodos = todos.filter((item)=> item.is_completed)
          setFilteredTodos(completedTodos)
          const button = document.querySelector(".btn1")
          const button2 = document.querySelector(".btn2")
          const button3 = document.querySelector(".btn3")
          button.classList.add ("active")
          button2.classList.remove("active")
          button3.classList.remove("active")
        }
        else if(status === "not_completed"){
          const notCompletedTodos = todos.filter((item)=> !item.is_completed)
          setFilteredTodos(notCompletedTodos)
          const button = document.querySelector(".btn1")
          const button2 = document.querySelector(".btn2")
          const button3 = document.querySelector(".btn3")
          button.classList.remove("active")
          button2.classList.add("active")
          button3.classList.remove("active")
        }else{
          setFilteredTodos([])
          const button = document.querySelector(".btn1")
          const button2 = document.querySelector(".btn2")
          const button3 = document.querySelector(".btn3")
          button.classList.remove("active")
          button2.classList.remove("active")
          button3.classList.add("active")
        }
      }

    return (
        <>
           <Navbar userName={userName} searchTodo={searchTodo}/>

        <button onClick={()=> {console.log("Clicked"); setShowTodo(!showTodo)}} className={!showTodo? "button-9" : "remove-btn"}> Add a todo</button>
        {showTodo && (
          <div className="popup">
            <h1>Add new todos</h1>
            <input type="text" placeholder="title" name="title" onChange={handleChange} required value={post.title} ref={titleInputRef} ></input><br></br>
            <textarea type="text" placeholder="Enter your todo" name="text" onChange={handleChange} required value={post.text} ref={textInputRef} id="copytext"></textarea><br></br>
            <button onClick={handleClick} className="add">ADD TODO</button>
            <button onClick={handleCopy} className="add">Copy </button>
            <button onClick={()=> setShowTodo(false)} className="close-btn">❌</button>
          </div>
        )}
      <div className="filter-buttons">
        <button onClick={()=> handleFilter("completed")} className="filter-button btn1">Completed</button>
        <button onClick={()=> handleFilter("not_completed")} className="filter-button btn2">Not Completed</button>
        <button onClick={()=> handleFilter("all")} className="filter-button btn3 active">All</button>
      </div>

        <div className="todo-container">
            {filterStatus === "all" ? todos.map(item=>(
                <div className="card" key={item.id} data-id={item.id}>
                    <h2 className={`title ${item.is_completed ? "completed":"not_completed"}`} id="todo-title">{item.title}</h2>
                    <h5>Created on: {item.updated_date.split('T')[0]}</h5>
                    <select name="status" className="status" value={item.is_completed ? "completed": "not_completed"} onChange={(e)=> handleStatusChange(item.id, e.target.value)}>
                      <option value="completed" className="comp">Completed</option>
                      <option value="not_completed" className="notcomp">Not Completed</option>
                    </select><br></br>
                    <Link href = {`/update/${item.id}`}> <button className="update">✏️</button></Link>
                    <button onClick={()=>{console.log("Clicked"); handleDelete(item.id)}} className="delete"> 🗑️ </button>
                    <button onClick={()=>handleSecondCopy(item.id)} className="add copy" >📑</button>
                    <textarea className={`desc ${item.is_completed? "completed":"not_completed"}`} id={`todo-desc-${item.id}`} readOnly>{item.text}</textarea>
                </div>
            )
            ):filteredTodos.map((item)=>(
              <div className="card" key={item.id} data-id={item.id}>
              <h2 className={`title ${item.is_completed ? "completed":"not_completed"}`} id="todo-title">{item.title}</h2>
              <h5>Created on: {item.updated_date.split('T')[0]}</h5>
              <select name="status" className="status" value={item.is_completed ? "completed": "not_completed"} onChange={(e)=> handleStatusChange(item.id, e.target.value)}>
                <option value="completed" className="comp">Completed</option>
                <option value="not_completed" className="notcomp">Not Completed</option>
              </select><br></br>
              <Link href = {`/update/${item.id}`}> <button className="update">✏️</button></Link>
              <button onClick={()=>{console.log("Clicked"); handleDelete(item.id)}} className="delete"> 🗑️ </button>
              <button onClick={()=>handleSecondCopy(item.id)} className="add copy" >📑</button>
              <textarea className={`desc ${item.is_completed? "completed":"not_completed"}`} id={`todo-desc-${item.id}`} readOnly>{item.text}</textarea>
          </div>   
            ))
            }
        </div>
        </>
    );
}

export default Todos;