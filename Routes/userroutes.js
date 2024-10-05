const {Router} =require('express')
const router=Router({ mergeParams: true });
const {UserModel, PurchaseModel, CourseModel}=require('../db')
const {z}=require('zod')
const jwt=require('jsonwebtoken');
const { checkUser } = require('../middlewares/authmiddleware');
const { UserJwtSecret } = require('../constants');
const bcrypt=require('bcrypt')

const validuser=z.object({
    password:z.string(),
    firstname:z.string(),
    lastname:z.string(),
    email:z.string().email()
})
const logincreds=z.object({
    email:z.string().email(),
    password:z.string()
})

//user routers
router.post("/login",async(req,res)=>{
    const valid=logincreds.safeParse(req.body)
    if(!valid.success) return res.status(403).json(valid.error.message)
    // valid.data.password=await bcrypt.compare(valid.data.password)
    const user=await UserModel.findOne({email:valid.data.email})
    const password=await bcrypt.compare(valid.data.password,user.password)
    console.log(password)
    // console.log(user,"from db")
    if(!user || !password) return res.status(404).json("no user found with these credentials")
    const token=jwt.sign({id:user._id,email:user.email},UserJwtSecret)
    res.set('token',token);
    res.json({"login succesfull":user})
})
router.post("/signup",async (req,res)=>{
    const response=validuser.safeParse(req.body)
    console.log("request is got",req.body)
    if(!response.success) return res.status(400).json(response.error.message)
    response.data.password=await bcrypt.hash(response.data.password,10)
    const dbresponse=await UserModel.create(response.data)
    console.log(dbresponse,"this response is from db")
    res.json(response)
})
router.get("/allcourses",async(req,res)=>{
    const allcourses=await CourseModel.find({})
    res.status(200).json(allcourses)
})
router.use(checkUser)
router.post("/purchase",async(req,res)=>{
    const {courseId}=req.body;
    const purchase=await PurchaseModel.create({courseId,userId:req.userId})
    console.log(purchase)
    res.status(200).json("purchase succesfull")
    
})
router.post("/course",async(req,res)=>{
    //TODO: implement the endpoint to show the array of the courses purchases by the user
    const purchases=await PurchaseModel.find({userId:req.userId})
    console.log(purchases.map(course=>course.courseId))
    const courses=await CourseModel.find({ _id: { "$in" : purchases.map(course=>course.courseId)} })
    console.log(courses)
    res.json(courses)
})
router.get('/user-details',async(req,res)=>{
    const user =await UserModel.findOne({_id:req.userId}).select("-password")
    res.json(user)
})



module.exports=router