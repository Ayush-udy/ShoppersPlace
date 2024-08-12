const express = require('express')
const {registerController, loginController, testController, forgotPasswordController} = require('../controllers/authController');
const {requiresSignIn, isAdmin}= require('../middlewares/authMiddleware')
//route Object
const router= express.Router()

//Routing
//Register 
router.post('/register', registerController)

//Login || Post
router.post('/login', loginController)


//Forget Password || POST
router.post('/forgot-password', forgotPasswordController)

//test Routes
router.get('/test',requiresSignIn, isAdmin, testController)

// Protected User route auth
router.get("/user-auth", requiresSignIn, (req, res) =>{
    res.status(200).send({ok:true})
} )

//Protected Admin Route auth
router.get("/admin-auth", requiresSignIn, isAdmin, (req, res) =>{
    res.status(200).send({ok:true})
} )


module.exports= router;
