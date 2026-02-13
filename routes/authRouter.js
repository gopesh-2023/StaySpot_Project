
const path=require('path');

const express = require("express");

//local modules
const rootDir=require('../utils/pathutils');
const authController=require("../controller/authController");

const authRouter = express.Router();

authRouter.use(express.static(path.join(rootDir, "public")));

authRouter.get("/login", authController.getLogin);
authRouter.post("/login", authController.postLogin);   
authRouter.post("/logout", authController.postLogout);
authRouter.get("/signup", authController.getSignup);
authRouter.post("/signup", authController.postSignup);

module.exports = authRouter;
 