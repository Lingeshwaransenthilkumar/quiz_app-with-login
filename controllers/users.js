const mysql=require("mysql");
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const { promisify }=require("util");

const db = mysql.createConnection({
    host     :process.env.database_host,
    user     :process.env.database_user,
    password :process.env.database_password,
    database :process.env.database,
});
//! logging in
exports.login=async(req,res)=>{
    try{
        const{email,password}=req.body;
        console.log(req.body)
        if(!email || !password){
            return res.status(400).render('login',{msg:"please enter your email and password",
        msg_type:"error",})// render is function with 2 parameters
          } 
          
        db.query("select * from users where email=?",
        [email],
        async(error,result)=>{
            console.log(result);
            if(result.length<=0){
                return res.status(401).render("login",{
                    msg:"email incorrect and register first!!!",
                    msg_type:"error,"
                })
              }
            else{
                if(!(await bcrypt.compare(password , result[0].PASS ))){
                    return res.status(401).render("login",{
                        msg:"please enter correct password",
                        msg_type:"error,"
                    })
                }
                else{
                    // we are going get user id and pass into new page
                    const id=result[0].ID;
                    //res.send("good")
                    // creating cookie
                    //jwt.sign(user,secretkey,{expiresIN:1hr})
                    //creating digital signature for authentication and authorisation
                const token=jwt.sign({id:id},process.env.JWT_SECRET,{
                    expiresIn:process.env.JWT_EXPIRES_IN,// time of expiry 
                });
                console.log("the token is"+token);

                const cookieOptions={
                    expires: new Date(
                        Date.now()+process.env.JWT_COOKIE_EXPIRES *24*60*60*1000
                    ),
                    httpOnly:true,
                };
                res.cookie("lingesh",token,cookieOptions);
                res.status(200).redirect("/home");

                    }
                }
            }
        )// query closing
    }

    catch(error){
        console.log(error)
    }

}//login method
     







//!registering or inserting datas into db
exports.register=(req,res)=>{
    //res.send("success")
    //console.log(req.body);
    /*
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;
    const confirm_password=req.body.confirm_password;
    */
   //*single line presentation of above all lines
   const{name,email,password,confirm_password}=req.body
    console.log(name,email);
 
   db.query("select email from users where email=?",[email],async(error,result)=>{
    
   if(error){
       console.log(error);

    };
    if (result.length>0){
        return res.render("register",{msg: "Email id already taken",msg_type:"error"});
    }
    else if(password!=confirm_password){
         return res.render("register",{msg: "password is not equal to confirm_password",msg_type:"error"});
    }
    let hashedpasword=await bcrypt.hash(password,8);
    //console.log(hashedpasword)

    db.query("insert into users set ?",{name:name,email:email,pass:hashedpasword},(error,result)=>{
        if(error){
            console.log(error);
        }
        else{
            console.log(result);
            return res.render("register",{msg: "user registration success",msg_type:"good"});
        }
    })

 
 }
 )
};//*ending the exports.register bracket

//! used in page.js user for user security so only valid user can access profile
exports.isLoggedIn=async(req,res,next)=>{
    //req.name="Check login.....";
    console.log(req.cookies);
    if (req.cookies.lingesh){
        try{
            const decode=await promisify(jwt.verify)(
                req.cookies.lingesh,
                process.env.JWT_SECRET
                );
                console.log(decode);
                db.query("select * from users where id=?",[decode.id],(err,result)=>{
                    //console.log(result);
                    if(!result){
                        return next();
                    }
                    else{
                        req.user=result[0];
                        return next();
                    }

                });
    
        }
        catch(error){
            return next();
        }
       
    }
    else{
        next();
    }
};


//! deleting cookies when logging out
exports.logout=async(req,res)=>{
    res.cookie("lingesh","logout",{
        expires:new Date(Date.now()+2*1000),
        httpOnly:true,
    });
    res.status(200).redirect("/login");
}