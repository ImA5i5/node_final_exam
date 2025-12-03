const Category=require("../model/categoryModel");
const Product=require("../model/productModel");
const { createProductSchema, updateProductSchema }=require("../model/productValidation");
const path=require("path");
const fs=require("fs");


class AdminController{

    async AdminDashboard(req,res){
        try{
            const [productCount,categoryCount]=await Promise.all([
                Product.countDocuments({isDeleted:false}),
                Category.countDocuments({isDeleted:false})
            ])
            return res.render("admin/dashboard",{productCount,categoryCount})
        }catch(error){
            console.log(error.message)
        }
    }

    //admin/category

     async adminCategoryListPage(req,res){
        try{
            const categories=await Category.find({isDeleted:false}).sort({ createdAt: -1 })
            return res.render("admin/category_list",{categories})
        }catch(error){
            console.log(error.message)
        }
    }

     async adminCategoryAddPage(req,res){
        try{
           return res.render("admin/category_add") 
           
        }catch(error){
            console.log(error.message)
        }
    }

    async adminCategoryAdd(req,res){
        try{
           const {name}=req.body
             const slug = name.toLowerCase().replace(/\s+/g, "-");

             // Check if category with the same slug already exists
            const existing = await Category.findOne({ slug, isDeleted: false });
            if (existing) {
            
            return res.redirect("/category/add");
            }

            // Create and save category
            const cData = new Category({
            name,
            slug,
            isDeleted: false
            });

            await cData.save();
            return res.redirect("/category/list")
           
        }catch(error){
            console.log(error.message)
        }
    }

    async adminCategoryEditPage(req,res){
        try{
            const {id}=req.params
            const category=await Category.findById(id)
            return res.render("admin/category_edit",{category})
        }catch(error){
            console.log(error.message)
        }
    }

     async adminCategoryUpdate(req,res){
        try{
            const {id}=req.params
            const {name}=req.body
            const slug = name.toLowerCase().replace(/\s+/g, "-");
            const existing = await Category.findOne({
            slug,
            _id: { $ne: id },
            isDeleted: false
            });

            if(existing){
               return res.redirect(`/category/edit/${id}`) 
            }
            await Category.findByIdAndUpdate(id,{
                name,
                slug,
                isDeleted:false
            })
            return res.redirect("/category/list")
        }catch(error){
            console.log(error.message)
        }
    }

    async adminCategoryDelete(req,res){
        try{
            const {id}=req.params
            await Category.findByIdAndDelete(id)
            return res.redirect("/category/list")
        }catch(error){
            console.log(error.message)
        }
    }

    async adminCategorySoftDelete(req,res){
    try{
        const {id}=req.params
        await Category.findByIdAndUpdate(id, { isDeleted: true });
        req.flash("success","Category soft deleted successfully")
        return res.redirect("/category/list")
    }catch(error){
        console.log(error.message)
    }
}


    //admin/product
    async adminProductListPage(req,res){
        try{
            const product=await Product.find({isDeleted:false}).populate("category", "name").sort({createdAt: -1});
            return res.render("admin/product_list",{product})
        }catch(error){
            console.log(error.message)
        }
    }

     async adminProductAddPage(req,res){
        try{
            const categories=await Category.find({ isDeleted: false }).sort({ createdAt: -1 });
            return res.render("admin/product_add",{categories})
        }catch(error){
            console.log(error.message)
        }
    }


    async adminProductAdd(req, res) {
    try {
        const { name, category, description } = req.body;

        const { error } = createProductSchema.validate({ name, category, description }, { abortEarly: false });

        if (error) {
            const errorMessages = error.details.map(err => err.message);
            req.flash("error", errorMessages.join(", "));
            return res.redirect("/product/add");
        }

        const slug = name.toLowerCase().replace(/\s+/g, "-");

        // Check if already exists
        const existing = await Product.findOne({ slug, isDeleted: false });
        if (existing) {
            req.flash("error", "Product already exists");
            return res.redirect("/product/add");
        }

        // Image check
        if (!req.file) {
            req.flash("error", "Image is required");
            return res.redirect("/product/add");
        }

        const productData = new Product({
            name,
            category,
            description,
            slug,
            isDeleted: false,
            image: req.file.filename
        });

        await productData.save();
        req.flash("success","new product data create successfully")
        return res.redirect("/product/list");
    } catch (error) {
        console.log(error.message);
    }
    }

     async adminProductEditPage(req,res){
        try{
            const {id}=req.params
            const pData=await Product.findById(id).populate("category")
            if(!pData){
                return res.redirect("/product/list")
            }
            const categories = await Category.find({isDeleted: false});
            return res.render("admin/product_edit",{pData,categories})
        }catch(error){
            console.log(error.message)
        }
    }

    async adminProductUpdate(req,res){
        try{
            const {id}=req.params
            const{name, category, description}=req.body

              const { error } = updateProductSchema.validate({ name, category, description }, { abortEarly: false });

        if (error) {
            const errorMessages = error.details.map(err => err.message);
            req.flash("error", errorMessages.join(", "));
            return res.redirect(`/product/edit/${id}`);
        }
            
            const slug = name.toLowerCase().replace(/\s+/g, "-");
            
           const updateData = {
            name,
            category,
            description,
            slug,
            isDeleted: false
            };

            // If a new image is uploaded → delete the old one
        if (req.file) {
            const oldProduct = await Product.findById(id);
            if (oldProduct && oldProduct.image) {
                // ✅ Correct path to uploads folder
                const oldImagePath = path.resolve("uploads", oldProduct.image);

                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                    console.log(`Deleted old image: ${oldImagePath}`);
                } else {
                    console.log(`Old image not found: ${oldImagePath}`);
                }
            }
            updateData.image = req.file.filename;
        }

            await Product.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
            });

            req.flash("success","product update successfully")
            
            return res.redirect("/product/list")
        }catch(error){
            console.log(error.message)
        }
    }

     async adminProductDelete(req,res){
        try{
            const {id}=req.params

            // 1. Find the product to get the image name
        const product = await Product.findById(id);
        if (!product) {
            req.flash("error", "Product not found");
            return res.redirect("/product/list");
        }

         // 2. Delete the image file if it exists
        if (product.image) {
            const imagePath = path.resolve("uploads", product.image); // Correct path
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
                console.log(`Deleted image: ${imagePath}`);
            } else {
                console.log(`Image not found: ${imagePath}`);
            }
        }

            await Product.findByIdAndDelete(id)
            req.flash("success","product delete with image")
            return res.redirect("/product/list")
        }catch(error){
            console.log(error.message)
        }
    }

        async adminProductSoftDelete(req, res) {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            req.flash("error", "Product not found");
            return res.redirect("/product/list");
        }

        // Mark as deleted
        product.isDeleted = true;
        await product.save();
        req.flash("success","product should be softDelete")
        return res.redirect("/product/list");
    } catch (error) {
        console.log(error.message);
    }
}


}
module.exports=new AdminController()