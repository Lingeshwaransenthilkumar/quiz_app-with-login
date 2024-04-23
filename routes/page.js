const express=require("express");
const routes=express.Router();
const userController=require('../controllers/users');
//! organising routes

routes.get(["/","/login"],(req,res)=>{
    res.render("login");
});
routes.get("/register",(req,res)=>{
  res.render("register");
});
routes.get("/profile",userController.isLoggedIn,(req,res)=>{
  if(req.user){
    res.render("profile",{user:req.user});
  }
  else{
    res.redirect("/login");
  }
});
routes.get("/home",userController.isLoggedIn,(req,res)=>{
  //console.log(req.name);
  if (req.user){
    res.render("home",{user:req.user});;
  }
  else{
    res.redirect("/login");

  }
});

//* exporting whole module
module.exports=routes;
//* if we export single method , we use 
//*export default method_name;