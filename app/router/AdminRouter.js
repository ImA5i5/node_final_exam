const express=require("express");
const AdminController=require("../controller/AdminController");
const upload=require("../helper/productMulter");
const router=express.Router()


router.get("/dashboard",AdminController.AdminDashboard);


//admin/category
router.get("/category/list",AdminController.adminCategoryListPage);
router.get("/category/add",AdminController.adminCategoryAddPage);
router.post("/category/add",AdminController.adminCategoryAdd);
router.get("/category/edit/:id",AdminController.adminCategoryEditPage);
router.post("/category/update/:id",AdminController.adminCategoryUpdate);
router.get("/category/delete/:id",AdminController.adminCategoryDelete);
router.get("/category/Sdelete/:id",AdminController.adminCategorySoftDelete);


//admin/product
router.get("/product/list",AdminController.adminProductListPage);
router.get("/product/add",AdminController.adminProductAddPage);
router.post("/create/Product",upload.single("image"),AdminController.adminProductAdd);
router.get("/product/edit/:id",AdminController.adminProductEditPage);
router.post("/product/update/:id",upload.single("image"),AdminController.adminProductUpdate);
router.get("/product/delete/:id",AdminController.adminProductDelete);
router.get("/product/softDelete/:id",AdminController.adminProductSoftDelete);






module.exports=router