const mongoose =require('mongoose')
const connecttodb=()=>{mongoose.connect(process.env.DB_URI);console.log("database connected")}
const UserSchema=new mongoose.Schema({
    password:String,
    firstname:String,
    lastname:String,
    email:{type:String,unique:true},
})
const CourseSchema=new mongoose.Schema({
    title:String,
    description:String,
    price:Number,
    imageUrl:String,
    createdBy:{type:mongoose.Types.ObjectId,ref:'admins'},
})
const AdminSchema=new mongoose.Schema({
    password:String,
    firstname:String,
    lastname:String,
    email:{type:String,unique:true},
})
const PurchaseSchema=new mongoose.Schema({
    courseId:{type:mongoose.Types.ObjectId,ref:'courses'},
    userId:{type:mongoose.Types.ObjectId,ref:'users'}
})


const UserModel=mongoose.model("users",UserSchema)
const CourseModel=mongoose.model("courses",CourseSchema)
const AdminModel=mongoose.model("admins",AdminSchema)
const PurchaseModel=mongoose.model("purchases",PurchaseSchema)

module.exports={
    UserModel,CourseModel,AdminModel,PurchaseModel,connecttodb
}