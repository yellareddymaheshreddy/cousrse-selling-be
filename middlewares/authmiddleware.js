const jwt=require('jsonwebtoken');
const { UserJwtSecret, AdminJwtSecret } = require('../constants');

function checkUser(req,res,next){
    const {token}=req.headers;
    try {
        const valid=jwt.verify(token,UserJwtSecret)
        if(valid){
            req.userId=valid.id;
            return next();}

    } catch (error) {
        res.status(403).json("checkfor user authentication failed"+error.message)
    }
    

}
function checkAdmin(req,res,next){
    const {token}=req.headers;
    try {
        const valid=jwt.verify(token,AdminJwtSecret)
        if(valid){
            req.userId=valid.id;
            return next();}

    } catch (error) {
        res.status(403).json("checkfor Admin authentication failed"+error.message)
    }
    

}
module.exports=  {checkUser,checkAdmin}