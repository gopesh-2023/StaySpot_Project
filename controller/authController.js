const { check, validationResult } = require("express-validator");
const User=require('../models/user');
const bcrypt=require('bcryptjs');
const user = require("../models/user");

exports.getLogin=(req, res, next)=>{
    console.log("Handling for /login");
    res.render('auth/login',{
        pageTitle: 'Login', 
        currentPage: 'login', 
        isLoggedIn:false, errors:[],
         oldInput:{email:''},
        user:{} });
}

exports.getSignup=(req, res, next)=>{
    console.log("Handling for /signup");
    res.render('auth/signup',{
        pageTitle: 'SignUp', 
        currentPage: 'signup',
         isLoggedIn:false, 
         errors:[], 
         oldInput:{firstName:'',lastName:'',email:'',password:'',userType:''},
        user:{} });
}
exports.postSignup=[
    check("firstName")
    .trim()
    .isLength({min:2})
    .withMessage("First Name must be at least 2 characters long")
    .matches(/^[A-Za-z]+$/)
    .withMessage("First Name must contain only alphabets"),

    check("lastName")
    .matches(/^[A-Za-z]+$/)
    .withMessage("First Name must contain only alphabets"),

    check("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

    check("password")
    .isLength({min:8})
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter") 
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one digit")
    .matches(/[!@&]/)
    .withMessage("Password must contain at least one special character")
    .trim(),  

    check("confirmPassword")
    .custom((value,{req})=>{
        if(value!==req.body.password){  
            throw new Error("Passwords do not match");
        }   
        return true;
    }),  
    
    check("userType")
    .notEmpty()
    .withMessage("User Type is required")
    .isIn(["guest","host"])
    .withMessage("Invalid User Type"),

    check("terms")
    .notEmpty()
    .withMessage("You must accept the terms and conditions")
    .custom((value,{req})=>{
        if(value!== 'on'){ 
            throw new Error("You must accept the terms and conditions");
        }   
        return true;
    }),
    
    (req, res, next)=>{
           
    const{firstName,lastName,email,password,userType}=req.body;   
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('auth/signup',{
            pageTitle:'SignUp', 
            currentPage:'signup',
            isLoggedIn:false,
            errors:errors.array().map(err=>err.msg),
            oldInput:{firstName,lastName,email,password, userType}
        });
    }

bcrypt.hash(password,12).then(hashedPassword=>{
    const user=new User({firstName,lastName,email,password:hashedPassword,userType});
    return user.save();
}).then(()=>{
    console.log("User Registered Successfully");
    res.redirect('/login');
}).catch(err=>{
    return res.status(500).render('auth/signup',{
        pageTitle:'SignUp',
        currentPage:'signup',
        isLoggedIn:false,
        errors:[err.message],
        oldInput:{firstName,lastName,email,password,userType},
        user:{},
    });
});

   
}];


exports.postLogin=async (req, res, next)=>{
    const {email,password}=req.body;
    const user=await User.findOne({email});
    if(!user){
        return res.status(422).render('auth/login',{  
            pageTitle:'Login',
            currentPage:'login',
            isLoggedIn:false,   
            error:['Invalid email or password'],
            oldInput:{email},
            user:{},

        });
    }
    const isMatch=await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(422).render('auth/login',{
            pageTitle:'Login',
            currentPage:'login',
            isLoggedIn:false,   
            error:['Invalid email or password'],
            oldInput:{email},
            user:{},
        });
    }   

    const sessionUser = {
      _id: user._id.toString(), // Convert ObjectId to String to prevent crash
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType
  };

    req.session.isLoggedIn=true;
    req.session.user = sessionUser;
   req.session.save((err) => {
      if (err) {
          console.log("Session save error:", err);
      }
      // Redirect ONLY after save is complete
      res.redirect('/'); 
  });
}  

exports.postLogout=(req, res, next)=>{
    req.session.destroy(()=>{
        console.log("Session destroyed");
        res.redirect('/login');
    }  );
    
}
