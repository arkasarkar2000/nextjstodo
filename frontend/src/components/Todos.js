'use client'

import { useEffect, useState, useRef } from "react";
import "../app/globals.css"
import Link from "next/link";
import { usePathname } from "next/navigation";

const Todos = () => {
  const pathname = usePathname()
  const user_id = pathname.slice(pathname.lastIndexOf('/')+1)
  const[token,setToken] = useState("")
  const [todos,setTodos] = useState([])
  const [selectedStatus, setSelectedStatus] = useState("all")

  const [post,setPost] = useState({
        title:"",
        text:""
    })

    const handleFilterClick = (filter)=>{
      setSelectedStatus(filter)
    }

    const[refetch,setRefetch] = useState(false)
    const titleInputRef = useRef(null);
    const textInputRef = useRef(null);

  useEffect(() => {
      const clientToken = localStorage.getItem('token')
      if(clientToken){
        setToken(clientToken)
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

      const handleStatusChange = async (todoId,selectedStatus)=>{
          const apiUrl = `http://localhost:3001/updateStatus/${todoId}`
          const requestOptions = {
            method: "PUT",
            headers:{
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({status: selectedStatus})
          }
          try{
            const response = await fetch(apiUrl,requestOptions)
            if(!response.ok){
              console.log("Error")
            }
            getAllTodos()
          }catch(err){
            console.log(err)
          }



      }

  /*     const updateCheckboxState = (itemId,checked)=>{
        const updatedTodos = todos.map((item)=>{
          if(item.id === itemId){
            return {...item, completed1:checked}
          }
          return item
        })

        setTodos(updatedTodos)
        localStorage.setItem("todos",JSON.stringify(updatedTodos))
      } */

      /* const change = ()=>{
        setChecked(!checked)
        localStorage.setItem("checked",checked)
      } */

      const filteredTodos = todos.filter((item)=>{
          if(selectedStatus === "completed" && item.is_completed){
            return true
          }else if(selectedStatus === "not_completed" && !item.is_completed){
            return true
          }else if(selectedStatus === "all"){
            return true
          }
          return false
        })

    return (
        <>
        <div className="form">
            <h1>Add new todos</h1>
            <input type="text" placeholder="title" name="title" onChange={handleChange} required value={post.title} ref={titleInputRef}></input>
            <textarea type="text" placeholder="Enter your todo" name="text" onChange={handleChange} required value={post.text} ref={textInputRef}></textarea><br></br>
            <button onClick={handleClick} className="add">ADD TODO</button>
        </div>
        <div className="search-container">
          <input type="search" placeholder="Search todos" onChange={searchTodo} id="search" />
        </div>

        <div className="todo-container">
            {filteredTodos.length > 0 ? filteredTodos.map(item=>(
                <div className="card" key={item.id}>
                    <h2 className="title" id="todo-title">{item.title}</h2>
                    <h6>{item.updated_date}</h6>
                    <select name="status" id="status" className="status" onChange={(e)=> handleStatusChange(item.id,e.target.value)} value={item.is_completed? "completed":"not_completed"}>
                      <option value="not_completed">Not Completed</option>
                      <option value="completed">Completed</option>
                    </select><br></br>
                    <button className="update"><Link href = {`/update/${item.id}`}>Update</Link></button>
                    <button onClick={()=> handleDelete(item.id)} className="delete"> Delete </button><br></br>
                    <p className="desc" id="todo-desc">{item.text}</p>
                </div>
            )
            ):<h2 className="notodo">No todos</h2>}
            
        </div>
        </>
    );
}

export default Todos;