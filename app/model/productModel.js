const mongoose=require("mongoose");
const slugify = require('slugify');
const Schema=mongoose.Schema

const ProductSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        unique: true
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },



},{timestamps:true})


ProductSchema.pre("validate",async function(next){
    if(this.isModified("name") || !this.slug){
        this.slug=slugify(this.name,{lower:true,strict:true})
    }
    next();
})


const ProductTest=mongoose.model("Product",ProductSchema)
module.exports=ProductTest