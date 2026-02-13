
const path=require('path');

const express = require("express");

//local modules
const rootDir=require('../utils/pathutils');
const storeController=require("../controller/storeController");

const storeRouter = express.Router();

storeRouter.use(express.static(path.join(rootDir, "public")));

storeRouter.get("/",storeController.getHome);
storeRouter.get("/store/bookings",storeController.getBookings);
storeRouter.get("/store/favourite",storeController.getFavourites);

storeRouter.get("/homes/:homeid", storeController.getHomeDetails);
storeRouter.post("/store/favourite", storeController.postAddToFavourite);
storeRouter.post("/store/favourite/delete/:homeid", storeController.postRemoveFromFavourite);

module.exports = storeRouter;
 