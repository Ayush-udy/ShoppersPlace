const productModel = require("../models/productModel");
const fs = require("fs");
const slugify = require("slugify");
const { measureMemory } = require("vm");
const categoryModel = require("../models/categoryModel")
const braintree= require("braintree")
const orderModel= require("../models/orderModel")
require('dotenv').config();

//Payment Gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});


exports.createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    //Validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res.status(500).send({
          error: "Photo is required and should be less than 1mb",
        });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating product",
    });
  }
};

//Update Products
exports.updateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    //Validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res.status(500).send({
          error: "Photo is required and should be less than 1mb",
        });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Updating product",
    });
  }
};

//get all Products
exports.getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      products,
      message: "All Products",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting products",
      error: error.message,
    });
  }
};

//Get Single Controller
exports.getSingleProductController = async (req, res) => {
  try {
    const slug = req.params.slug;
    const product = await productModel
      .findOne({ slug })
      .select("-photo")
      .populate("category");

    return res.status(200).send({
      success: true,
      message: "Product Not Found",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting single product",
      error,
    });
  }
};

//Get Photo Product Controller
exports.productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting photo",
      error,
    });
  }
};

//Delete Product controller
exports.deleteProductController = async (req, res) => {
  try {
    const product = await productModel
      .findById(req.params.pid)
      .select("-photo");
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product Not Found",
      });
    }

    await product.deleteOne({ _id: req.params._id });

    res.status(200).send({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

//Filters
exports.productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      success: false,
      message: "Error while filtering products",
      err,
    });
  }
};

//Product Count Controller
exports.productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      message: "Error in product count",
      err,
      success: false,
    });
  }
};

//Product List Controller
exports.productListController = async (req, res) => {
  try {
    const perPage = 3;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip(perPage * page - perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      products,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      message: "Error in per page ctrl",
      err,
      success: false,
    });
  }
};

//Seacrh Controller Function
exports.searchController =async (req, res)=>{
  try{
    const {keyword}= req.params
    const results = await productModel.find({
      $or:[
        {name:{$regex: keyword, $options:"i"}},
        {description:{$regex: keyword, $options:"i"}}
      ]
    }).select("-photo")
    res.json(results)
  }catch(err){
    console.log(err);
    res.status(400).send({
      success:false,
      message:"Error in Search Product API",
      err
    })
    
  }
}

//Similar Product
exports.relatedProductController= async(req, res)=>{
  try{
    const {pid, cid}= req.params
    const products= await productModel.find({
      category:cid,
    _id:{$ne:pid},
    }).select("-photo")
    .limit(3)
    .populate('category')

    res.status(200).send({
      success:true,
      products
    })
  }
  catch(err){
    console.log(err)
    res.status(400).send({
      success:false,
      message:"Error in Related Product API",
      err
    })
  }
}

// get product by category
exports.productCategoryController = async(req, res)=>{
  try{
    const category= await categoryModel.findOne({slug:req.params.slug})
    const products= await productModel.find({category}).populate('category')
    res.status(200).send({
      success:true,
      products,
      category
    })
  }catch(err){
    console.log(err)
    res.status(400).send({
      success:false, 
      err, 
      message:'Error while getting products '
    })
  }
}

//Payment Gateway API
// Token
exports.braintreeTokenController= async(req, res)=>{
  try{
    gateway.clientToken.generate({}, function(err, response){
      if(err){
        res.status(500).send({
          err,
        })
    }else {
      res.send(response)
    }
  }
  )
  }catch(error){
    console.log(error)

  }
}
//Payment
exports.brainTreePaymentController= async(req, res)=>{
  try{
    const {cart, nonce} = req.body
    let total=0
    cart.map(i=> {
      total+= i.price
    })
    let newTransaction= gateway.transaction.sale({
      amount:total,
      PaymentMethodNonce: nonce,
      options:{
        submitForSettelement: true,
      }
    }, 
    function (error, result){
      if(result){
        const order= new orderModel({
          products: cart,
          payment: result,
          buyer: req.user._id
        }).save()
        res.json({ok:true})
      }
      else{
        res.status(500).send(error)
      }
    }
  )
  }
  catch(error){
    console.log(error)
  }
}