//core module
const path=require('path');

const User = require('./models/user');

//external module
const express=require('express');
const session=require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const multer = require('multer');
const DB_path="mongodb+srv://Gopesh:root@gopesh.07ba47h.mongodb.net/airbnb_new?appName=Gopesh";



const storeRouter=require('./routes/storeRouter');    
const hostRouter = require('./routes/hostRouter');
const errorController=require('./controller/errors');
const authRouter=require('./routes/authRouter');

const { default: mongoose } = require('mongoose');



const app=express();
app.set('view engine', 'ejs');
app.set('views', 'views');

const store = new MongoDBStore({
  uri: DB_path,
  collection: 'sessions'
});

const randomString=(length)=>{
    const characters='Aabcdefghijklmnopqrstuvwxyz';
    let result='';
    for(let i=0;i<length;i++){
        result+=characters.charAt(Math.floor(Math.random()*characters.length));
    }   
    return result;
}

const Storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/");
    },
    filename:(req,file,cb)=>{
        cb(null,randomString(10)+"_"+ file.originalname);
    }
}); 
const fileFilter=(req,file,cb)=>{
    if(file.mimetype==='image/png' || file.mimetype==='image/jpg' || file.mimetype==='image/jpeg'){
        cb(null,true);
    }else{
        cb(null,false);
    }
}

const multerOptions={
   storage: Storage,
    fileFilter: fileFilter

}
//local modules
const rootDir=require("./utils/pathutils");
const { DESTRUCTION } = require('dns');

app.use(express.static(path.join(rootDir, "public")));
app.use('/uploads',express.static(path.join(rootDir, "uploads")));
app.use('/host/uploads',express.static(path.join(rootDir, "uploads")));
app.use('/homes/uploads',express.static(path.join(rootDir, "uploads")));


app.use((req, res, next)=>{
    console.log(req.url, req.method);
    next();
});

app.use(express.urlencoded());
app.use(multer(multerOptions).single('photo')); //for single file upload
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: true,
    store: store
}));    

app.use((req, res, next)=>{
   console.log("Checking for cookies:", req.get('Cookie'));
 if (!req.session.user) {
    return next();
  }
 
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user; // Make mongoose model available in req.user
      next();
    })
    .catch(err => console.log(err));
});

    
    
app.use(authRouter);
app.use(storeRouter);
app.use("/host", (req, res, next)=>{
if (req.session.isLoggedIn) { 
        next();
    } else {
        res.redirect('/login');
    }
});
app.use("/host", hostRouter);


app.use(errorController.PageNotFound);

const port=3006; 


mongoose.connect(DB_path).then(()=>{
    console.log("Connected to Mongoose");
        app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
});  

}).catch((err)=>{
    console.log("Error connecting to Mongoose:", err);
}
);

    