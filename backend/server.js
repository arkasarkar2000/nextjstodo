const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const PORT = 3001

const app = express()

app.use(cors())

app.use(express.json())


app.get('/',(req,res)=>{
    res.json({title:"HELLO"})
})
//fetching all todos
app.get('/todos', (req,res)=>{
    const query = "SELECT * FROM todos"
    db.query(query,(err,data)=>{
        if(err) return res.json(err)
        return res.send(data)
    })
})


//posting todos
app.post('/create', (req,res)=>{
    const query = "INSERT INTO todos (`title`,`text`) VALUES (?)"
    const values = [
        req.body.title,
        req.body.text
    ]

    db.query(query, [values],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

//deleting todos
app.delete('/todos/:id',(req,res)=>{
    const todoId = req.params.id
    const query = "DELETE FROM todos WHERE id = ?"

    db.query(query,[todoId],(err,data)=>{
        if(err) return res.json(err)
        return res.json("Todo Deleted")
    })
})

app.put('/update/:id',(req,res)=>{
    const todoId = req.params.id
    const query = "UPDATE todos SET `title` = ?,`text` = ? WHERE id = ?";
    const values = [
        req.body.title,
        req.body.text
    ]

    db.query(query,[...values,todoId],(err,data)=>{
        if(err) return res.json(err)
        return res.json("Todo Updated Successfully")
    })
})







app.listen(PORT, (err)=>{
    if(err) console.log("Error")
    console.log("Server running on port " + PORT)
})



var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "todoapp"
  });

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected to MySQL DB!");
});
  





module.exports = db