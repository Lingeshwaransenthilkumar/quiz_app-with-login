const express=require("express");
const userController=require("../controllers/users");
const routes=express.Router();
//! these routes leads to inner loop routes like /../../
routes.post("/register",userController.register);
routes.post("/login",userController.login);
routes.get("/logout",userController.logout);
module.exports=routes;