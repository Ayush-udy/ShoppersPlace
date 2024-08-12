const express = require('express')
const { 
        createProductController, 
        getProductController, 
        getSingleProductController, 
        productPhotoController, 
        deleteProductController,
        updateProductController
    } = require( '../controllers/productController')

const {isAdmin, requiresSignIn} = require('../middlewares/authMiddleware')
const formidable= require('express-formidable')

const router= express.Router()

//routes
router.post('/create-product', requiresSignIn, isAdmin,formidable(), createProductController)

//routes
router.post('/update-product/:pid', requiresSignIn, isAdmin,formidable(), updateProductController)


// Get Products
router.get('/get-product', getProductController)

//single Product
router.get('/get-product/:slug', getSingleProductController)

//get photo
router.get('/product-photo/:pid', productPhotoController)

//delete product
router.get('/product/:pid', deleteProductController);


module.exports= router