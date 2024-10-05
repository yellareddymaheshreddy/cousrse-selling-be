require('dotenv').config()
const cors=require('cors')
const express=require('express')
const user=require("./Routes/userroutes")
const adminroutes = require('./Routes/adminroutes')
const { connecttodb } = require('./db')

const app=express()
app.use(cors({
    exposedHeaders: ['token', 'x-access-token'] 
}))
app.use(express.json())
app.use("/api/v1/user",user)
app.use('/api/v1/admin',adminroutes)
const PORT=3000;




connecttodb()
app.listen(PORT,()=>{
    console.log(`The app is listening on http://localhost:${PORT}`)
})