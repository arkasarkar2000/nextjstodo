const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const PORT = 3001
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const app = express()

app.use(cors())

app.use(express.json())

function generateSecretKey(){
  return crypto.randomBytes(32).toString('hex')
}

const secretKeys = {}

app.get('/',(req,res)=>{
    res.json({title:"HELLO"})
})
//fetching all todos
app.get('/todos/:user_id', (req,res)=>{
  const user_id = req.params.user_id
    const query = "SELECT id,title,text,is_completed,updated_date FROM todos WHERE user_id = ?"
    db.query(query,[user_id], (err,data)=>{
        if(err) return res.json(err)
        return res.send(data)
    })
})

//posting todos
app.post('/create/:user_id', (req,res)=>{
    const {title, text} = req.body
    const user_id = req.params.user_id
    if(!title || !text || !user_id){
        return res.status(422).json({"message":"Please fill in the required fields."});
    }
    const query = "INSERT INTO todos (`title`,`text`,`user_id`) VALUES (?,?,?)"
    const values = [
        title,
        text,
        user_id
    ]

    db.query(query, values,(err,data)=>{
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

//updating todos
app.put('/update/:id',(req,res)=>{
    const todoId = req.params.id
    const query = "UPDATE todos SET `title` = ?,`text` = ? WHERE id = ?";
    const values = [
        req.body.title,
        req.body.text
    ]

    db.query(query,[...values,todoId],(err,data)=>{
        if(err) return res.json(err)
        return res.json({msg:"Todo Updated Successfully"})
    })
})

//posting user signup details
app.post("/signupuser", (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send({ message: "Please fill all the fields" });
    }
  
    // function to check if the email already exists in the database
    checkEmailExists(email)
      .then((emailExists) => {
        if (emailExists) {
          return res.status(400).send({ message: "The email address already exists" });
        } else {
          // hashing the password
          bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
            if (hashErr) {
              return res.status(500).json({ message: "Error while hashing password" });
            }
            const dynamicSecretkey = generateSecretKey()
            
            secretKeys[email] = dynamicSecretkey
          
            const query = "INSERT INTO users (`name`, `email`, `password`) VALUES (?,?,?)";
            const values = [name, email, hashedPassword];
            db.query(query, values, (err, result) => {
              if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error while registering user" });
              }
              const token = jwt.sign({userId: result.insertId}, dynamicSecretkey)
              return res.status(201).json({msg:"Registered successfully",token});
            });
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ message: "An error occurred" });
      });
});

//login user
app.post("/loginuser", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ message: "Please fill all the fields" });
    }
    checkEmailExists(email)
      .then((user) => {
        if (!user) {
          return res.status(400).send({ message: "User not found" });
        } else {
          bcrypt.compare(password, user.password, (compareErr, isMatch) => {
            if (compareErr) {
              console.error(compareErr);
              return res.status(500).json({ message: "Error while comparing passwords" });
            }
            
            if (isMatch) {
              const dynamicSecretkey = secretKeys[email]

              if(!dynamicSecretkey){
                return res.json({msg:"Key Not FOund"}).status(500)
              }
                const token = jwt.sign({ userId: user.id }, dynamicSecretkey);
                res.cookie("token",token,{
                  httpOnly: true,
                  maxAge: 36000000,
                });
                return res.status(200).json({userId:user.id, userName:user.name ,message: "Login successful" ,token});
        
            } else {
              return res.status(401).send({ message: "Incorrect password" });
            }
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ message: "An error occurred" });
      });
});

app.post("/logout", (req,res)=>{
  const {email} = req.body
  delete secretKeys[email]
  res.clearCookie('token')
  res.status(200).json({msg:"Loogged out sucessfully"})

})

//updating status of todos in todo field
app.put("/todos/:id", (req,res)=>{
  const todoId = req.params.id
  const {is_completed } = req.body
  
  const query = "UPDATE todos SET `is_completed` = ? WHERE id = ?"
  const values = [is_completed,todoId]

  db.query(query,values,(err,data)=>{
    if(err){
      return res.json(err)
    }
    return res.json({mssg:"Status updated successfully"})
  })
})

//function to check if the email entered exists or not
function checkEmailExists(email) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM users WHERE email = ?`;
      db.query(sql, [email], (err, results) => {
        if (err) {
          reject(err);
        } else {
          if(results.length>0){
            resolve(results[0])
          }else{
            resolve(null);
          }   
        }
      });
    });
  }

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