const express=require("express");
const CustomerController=require("../controller/CustomerController");
const router=express.Router()


router.get("/Customer/get",CustomerController.homePage);
router.get("/product/:slug",CustomerController.getProductDetail);




module.exports=router