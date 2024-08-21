const express= require('express');
const { requiresSignIn, isAdmin } = require('../middlewares/authMiddleware');
const { createCategoryController, updateCategoryController, categoryController, singleCategoryController, deleteCategoryController } = require('../controllers/categoryController');

const router= express.Router()

//routes
//Create Category
router.post('/create-category', requiresSignIn, isAdmin, createCategoryController);

//Update Category
router.put('/update-category/:id', requiresSignIn, isAdmin, updateCategoryController);


//GetAll Category 
router.get('/get-category', categoryController)

//Single Category
router.get('/single-category/:slug', singleCategoryController);

//delete Category
router.delete('/delete-category/:id', requiresSignIn, isAdmin, deleteCategoryController);

module.exports= router;
