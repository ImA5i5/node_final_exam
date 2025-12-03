const mongoose=require("mongoose");
const slugify = require('slugify');
const Schema=mongoose.Schema

const CategorySchema=new Schema({
    name:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        unique: true
    },
    isDeleted: { type: Boolean, default: false }
},{timestamps:true})

// Auto-generate slug
CategorySchema.pre("validate", async function (next) {
  if (this.isModified("name") || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const CategoryTest=mongoose.model("Category",CategorySchema)
module.exports=CategoryTest
