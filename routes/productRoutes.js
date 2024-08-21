const express = require('express')
const { 
        createProductController, 
        getProductController, 
        getSingleProductController, 
        productPhotoController, 
        deleteProductController,
        updateProductController,
        productFiltersController,
        productCountController,
        productListController,
        searchController,
        relatedProductController,
        productCategoryController,
        braintreeTokenController,
        brainTreePaymentController
    } = require( '../controllers/productController')

const {isAdmin, requiresSignIn} = require('../middlewares/authMiddleware')
const formidable= require('express-formidable')

const router= express.Router()

//routes
router.post('/create-product', requiresSignIn, isAdmin,formidable(), createProductController)

// Update route
router.put('/update-product/:pid', requiresSignIn, isAdmin,formidable(), updateProductController)


// Get Products
router.get('/get-product', getProductController)

//single Product
router.get('/get-product/:slug', getSingleProductController)

//get photo
router.get('/product-photo/:pid', productPhotoController)

//delete product
router.delete('/delete-product/:pid', deleteProductController);

//Filter Product
router.get('/product-filters', productFiltersController)

//product count
router.get('/product-count', productCountController);

//Product per page 
router.get('/product-list/:page', productListController)

//Search product 
router.get('/search/:keyword', searchController)

//Similar Product
router.get('/related-product/:pid/:cid', relatedProductController)

//category wise product
router.get('/product-category/:slug', productCategoryController)

//Payments routes
//token
router.get('/braintree/token', braintreeTokenController)

//Payments
router.post('/braintree/payment', requiresSignIn, brainTreePaymentController)


module.exports= router