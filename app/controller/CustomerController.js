const Product=require("../model/productModel");
const Category=require("../model/categoryModel");

class CustomerController{

    async homePage(req,res){
        try{
             const { category, search } = req.query;
            let filter = {};

        // Filter by category (only if not "all")
        if (category && category !== "all") {
            filter.category = category;
        }

             // Search by name or description
        if (search && search.trim() !== "") {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        const products = await Product.find(filter).populate("category");
        const categories = await Category.find();

             res.render("customer/index", {
            products,
            categories,
            selectedCategory: category || "all",
            searchKeyword: search || ""
        });
        }catch(error){
            console.log(error.message)
        }
    }

    async getProductDetail(req, res) {
    try {
        let product;

        if (req.params.slug) {
            product = await Product.findOne({ slug: req.params.slug })
                                   .populate("category");
        } else if (req.params.id) {
            product = await Product.findById(req.params.id)
                                   .populate("category");
        }

        if (!product) {
            req.flash("error", "Product not found");
            return res.redirect("/Customer/get");
        }

        res.render("customer/product_detail", { product });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error");
    }
}

}
module.exports=new CustomerController()