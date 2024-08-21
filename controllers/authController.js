const { hashPassword, comaprePassword } = require('../helpers/authHelper')
const userModel= require('../models/userModel')
const JWT= require('jsonwebtoken')
const orderModel= require('../models/orderModel')

exports.registerController = async(req, res) => {
    try{
        const {name, email, password, phone, address, answer}= req.body
        //Validation
        if(!name){
            return res.send({message:'Name is Required'})
        }
        if(!email){
            return res.send({message:'Email is Required'})
        }
        if(!password){
            return res.send({message:'Password is Required'})
        }
        if(!phone){
            return res.send({message:'Phone no is Required'})
        }
        if(!address){
            return res.send({message:'Address is Required'})
        }
        if(!answer){
            return res.send({message:'Answer is Required'})
        }

        //Check user
        const existingUser= await userModel.findOne({email})
        //Existing User
        if(existingUser){
            return res.status(200).send({
                success:true , 
                message:'Already Registered please login'
            })
        }
        //Register User
        const hashedPassword = await hashPassword(password)

        //save
        const user= await new userModel({
            name, 
            email, 
            phone, 
            address, 
            password:hashedPassword,
            answer
        }).save()

        res.status(201).send({
            success: true, 
            message:"User Registration Successful",
            user
        })

    } catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in Registration',
            error
        })
    }
}


//Post Login
exports.loginController= async(req, res)=>{
    try{
        const {email, password}= req.body
        //Validation
        if(!email || !password){
            return res.status(404).send({
                success:false, 
                message:'Invalid email or password'
            })
        }
        const user= await userModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success:false, 
                message:'Email is not registered'
            })
        }
        const match= await comaprePassword(password, user.password)
        if(!match){
            return res.status(200).send({
                success:false,
                message:'Invalid Password'
            })
        }

        //token
        const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET, {
            expiresIn:"7d"
        });
        res.status(200).send({
            success:true,
            message:'Login Successfully',
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role,
            },
            token,
        })
    }
    catch(err){
        console.log(err)
        res.status(500).send({
        success:false,
        message:'Error in Login',
        err
        })
    }
}

//Forgot Password
exports.forgotPasswordController= async(req, res)=>{
    try{
        const {email, answer, newpassword}= req.body

        if (!email || !answer || !newpassword) {
            return res.status(400).json({ message: 'Email, question, and new password are required' });
        }

        // Check
        const user= await userModel.findOne({email, answer})
        if(!user){
            res.status(404).send({
                success:false,
                message:'Wrong Email or Answer'
            })
        }
        const hashed= await hashPassword(newpassword)
        await userModel.findByIdAndUpdate(user._id,{password:hashed});
            res.status(200).send({
            success:true,
            message:"Password Reset Successful"
        })

    }catch(error){
        console.log("Error in reseting Password")
        res.status(500).send({
            success:false,
            message:'Something went wrong',
            error
        })
    }
}

//Test Controller
exports.testController= (req, res)=>{
    try{
        res.send('Protected Routes')
    }
    catch(err){
        console.log(err);
        res.send({err});
    }
    
}

//Update PRofile
exports.updateProfileController = async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;
    const user= await userModel.findById(req.user._id)

    //password
    if(password && password.length<6){
        return res.status(400).json({ message: 'Password must be at least 6 characters long'})
    } 
    const hashedPassword= password? await hashPassword(password): undefined

    //update user
    const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
      $set: { 
        name:name || user.name,
        password:hashedPassword || user.password, 
        phone: phone || user.phone, 
        address:address|| user.address 
    },
    }, {new:true});
    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating profile",
      error,
    });
  }
};

//Orders
exports.getOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
        .find({buyer:req.user._id})
        .populate("products", "-photo")
        .populate("buyer","name")
        res.json(orders)

        } catch (err) {
            console.log(err);
            res.status(500).send({
                success:false,
                message:"Error while geting Orders",
                err
            })
        }
}

//Get all Orders
exports.getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
        .find({})
        .populate("products", "-photo")
        .populate("buyer","name")
        .sort({createdAt: -1})
        res.json(orders)

        } catch (err) {
            console.log(err);
            res.status(500).send({
                success:false,
                message:"Error while geting Orders",
                err
            })
        }
}

//Order-status Controller
exports.orderStatusController= async(req, res)=>{
    try{
        const {orderId}= req.params
        const {status}= req.body
        const orders= await orderModel.findByIdAndUpdate(
            orderId,
            {status},
            {new:true}
        )
        res.json(orders)
    }
    catch(err){
        console.log(err)
        res.status(500).send({
            success:false,
            message:"Error while Getting orders",
            err
        })
    }
}