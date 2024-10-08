const mongoose= require('mongoose')

const productSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
        },
    category:{
        type:mongoose.ObjectId,
        ref: 'Category',
        required:true
    },
    photo:{
        data:Buffer,
        contentType: String,
    },
    shipping:{
        type:Boolean,
    },
    quantity:{
        type:Number,
        required:true
    }
}, {timestamps:true})


const product= mongoose.model('Products', productSchema)
module.exports= product