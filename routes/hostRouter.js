//core modules
const path=require('path');
//external modules
const express=require('express');

//local modules
const rootDir=require("../utils/pathutils");

const hostRouter=express.Router();
const hostController=require("../controller/hostController");

hostRouter.use(express.static(path.join(rootDir, "public")));

hostRouter.get("/add-home", hostController.getAddHome);
// hostRouter.get("/edit-home", hostController.getEditHome);
hostRouter.post("/add-home", hostController.postAddHome);
hostRouter.post("/edit-home", hostController.postEditHome);
hostRouter.get("/host-home-list", hostController.getHostHomeList);

hostRouter.get("/edit-home/:homeid", hostController.getEditHome);

hostRouter.post("/edit-home", hostController.postEditHome);
hostRouter.post("/delete-home/:homeid", hostController.postDeleteHome);

module.exports=hostRouter;


