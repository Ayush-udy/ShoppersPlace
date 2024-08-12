const JWT= require('jsonwebtoken')
const userModel= require('../models/userModel')

exports.requiresSignIn= async(req, res, next)=>{
    try{
        const decode = JWT.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
          );
        req.user= decode;
        next()
    }
    catch(err){
        console.log(err);
        }
}

//Admin Access
exports.isAdmin= async(req, res, next)=>{
    try{
        const user= await userModel.findById(req.user._id)
        if(user.role!== 1){
            return res.status(401).send({
                success:false,
                message:'Unauthorized Access'
            })
        }
        next()
    }catch(err){
        res.status(401).send({
            success:false, 
            err,
            message:'Error in admin Middleware'
        })
    }
}