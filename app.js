const express=require("express");
const app=express();//*object of express
const mysql=require("mysql");//*import mysql
const path=require("path");// * for connecting css and html with hbs engine
const dotenv=require("dotenv");
const hbs=require("hbs"); // * handle bars engine
const cookieparser=require("cookie-parser");
//?-------------------------------------------------------
// ! encoding  db details 
dotenv.config({
  path:"./.env",//to secure database connection details
});

const db = mysql.createConnection({
    host     :process.env.database_host,
    user     :process.env.database_user,
    password :process.env.database_password,
    database :process.env.database,
});
//?--------------------------------------------------

db.connect((err)=>{
    
    if (err){
      console.log(err);
    }
    else{
      console.log('Connected to MySQL database.');
    }

});
app.use(cookieparser());
//* to read the objects in json from url and print in console
app.use(express.urlencoded({extended: false}));
//?-----------------------------------------
//!linking css and images
//console.log(__dirname)

const location=path.join(__dirname,'./public');//connecting to css files
app.use(express.static(location))//linking css files and express uses it
//?---------------------------------------------------------------------------
//! using hbs templating engine

app.set("view engine","hbs");

//! providing partial path for navbar

const partialpath=path.join(__dirname,"./views/partials")
hbs.registerPartials(partialpath);
//?---------------------------------------------------------------------
//! organising router
app.use('/',require("./routes/page.js"));
app.use('/auth',require("./routes/auth.js"));// ! special route for organising db
//?-------------------------------------------------------------------------

app.listen(5000,()=>{
    console.log("app is running on http://localhost:5000")
});


//comments types
//?
//!
//*