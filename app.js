require("dotenv").config()
const express=require("express");
const dbConn=require("./app/config/dbConn");
const session = require('express-session');
const flash = require('connect-flash');
const path=require("path");
const app=express()
dbConn()

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.set("view engine","ejs")
app.set("views","views")
app.use(express.static(path.join(__dirname,"public")))
app.use("/uploads", express.static("uploads"));
app.use(session({
  secret: 'asis12345',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});







const AdminRouter=require("./app/router/AdminRouter")
app.use(AdminRouter)


const CustomerRouter=require("./app/router/CustomerRouter")
app.use(CustomerRouter)




const port=5000 || process.env.PORT
app.listen(port,()=>{
    console.log(`app is running on port ${port}`)
})