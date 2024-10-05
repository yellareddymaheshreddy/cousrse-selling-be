const express=require('express')
const { AdminModel, CourseModel } = require('../db')
const adminroutes=express.Router()
const {z}=require('zod')
const jwt=require('jsonwebtoken')
const { checkUser, checkAdmin } = require('../middlewares/authmiddleware')
const { AdminJwtSecret } = require('../constants')
const bcrypt=require('bcrypt')

//admin routes
const validuser=z.object({
    password:z.string(),
    firstname:z.string(),
    lastname:z.string(),
    email:z.string().email()
})
const validcourse=z.object({
    title:z.string(),
    description:z.string(),
    price:z.number(),
    imageUrl:z.string(),
})
const logincreds=z.object({
    email:z.string().email(),
    password:z.string()
})

adminroutes.post("/login",async(req,res)=>{
    const valid=logincreds.safeParse(req.body)
    if(!valid.success) return res.status(403).json(valid.error.message)
    const user=await AdminModel.findOne({email:valid.data.email})
    const correct=await bcrypt.compare(valid.data.password,user.password)
    if(!user ||!correct ) return res.status(404).json("no Admin found with these credentials")
    const token=jwt.sign({id:user._id,email:user.email},AdminJwtSecret)
    res.set('token',token);
    res.json({"login succesfull":user})
})
adminroutes.post("/signup",async(req,res)=>{
    const response=validuser.safeParse(req.body)
    if(!response.success) return res.status(400).json(response.error.message)
    response.data.password=await bcrypt.hash(response.data.password,10)
    const dbresponse=await AdminModel.create(response.data)
    res.json({"usercreated":response})
})

adminroutes.use(checkAdmin)
adminroutes.post("/create-course",async(req,res)=>{
    const validcourse1=validcourse.safeParse({...req.body,price:Number(req.body.price)})
    console.log(req.body)
    if(!validcourse1.success){
        res.status(400).json(validcourse1.error)
        return
    }
    const course=await CourseModel.create({...validcourse1.data,createdBy:req.userId})
    if(course)return res.json("course has created succesfully")
})
adminroutes.delete("/delete-course",async(req,res)=>{
    const {id}=req.body
    const deleted=await CourseModel.deleteOne({_id:id})
    res.json( {"deleted course":deleted})
})
adminroutes.put("/add-content",async (req,res)=>{
    const {courseId,title,description,price,imageUrl,createdBy}=req.body;
    const response= await CourseModel.findOneAndUpdate({_id:courseId,createdBy:req.userId},{title,description,price,imageUrl,createdBy})
    res.json("the course has been updated succesfulluy")
})
adminroutes.get("/getcourses",async(req,res)=>{
    const courses=await CourseModel.find({createdBy:req.userId})
    res.json(courses)
})
adminroutes.get('/admin-details',async(req,res)=>{
    const admin =await AdminModel.findOne({_id:req.userId})
    res.json(admin)
})

module.exports=adminroutes