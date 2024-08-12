const { default: slugify } = require("slugify");
const categoryModel= require("../models/categoryModel")

exports.createCategoryController= async(req, res)=>{
    try{
        const {name}= req.body;
        if(!name){
            return res.status(401).send({message:'Name is required'})
        }
        const existingCategory= await categoryModel.findOne({name})
        if(existingCategory){
            return res.status(401).send({
                message:'Category already exists', 
                success:true,
            })
        }

        const category= await new categoryModel({name, slug:slugify(name)}).save()
        res.status(201).send({
            success:true,
            message:'New category created',
            category
        })
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message:'Error in Category'
        })
   }
}

exports.updateCategoryController = async(req, res)=>{
    try{
        const {name}= req.body
        const {id}= req.params
        const category= await categoryModel.findByIdAndUpdate(id, {name, slug:slugify(name)}, {new:true})
        res.status(200).send({
            success:true, 
            message:"Category Updated Successfully",
            category
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false, 
            error, 
            message: "Error while updating category"
        })
    }
}

exports.categoryController= async(req, res) =>{
try{
    const category= await categoryModel.find({})
    res.status(200).send({
        success:true, 
        message:"All Categories List",
        category,

    })
} catch(error){
    console.log(error)
    res.status(500).send({
        success: false,
        error,
        message:"Error while getting all categories"
    })
}
}

exports.singleCategoryController= async(req, res)=>{

    
    try{
        const category= await categoryModel.findOne({slug:req.params.slug})
        res.status(200).send({
            success:true,
            message:"Category Details",
            category
        })
    }
    catch(err){
        console.log(err)
        res.status(500).send({
            success:false,
            error:err,
            message:"Error while getting single category"
        })
    }

}

exports.deleteCategoryController=async (req, res)=>{
    try{
        const category= await categoryModel.findByIdAndDelete(req.params.id)
        res.status(200).send({
            success:true,
            message:"Category deleted successfully",
            category
            })
    }catch(err){
        console.log(err)
        res.status(500).send({
            success:false,
            error:err,
            message:"Error while deleting category"
        })
    }
}