const Home=require('../models/home');
// const Favourite=require('../models/favourite');
const User=require('../models/user');

exports.getHome= (req, res, next) => {
  console.log("Session value:", req.session);
  Home.find().then(registerHomes=>{
   res.render('store/home-list',{
    registerHomes: registerHomes,
     pageTitle: 'Home', 
     currentPage: 'home',
     isLoggedIn: req.session.isLoggedIn,
     user:req.session.user}); 
  });
}
exports.getBookings= (req, res, next) => {
   Home.find().then(registerHomes=>{
    res.render('store/Bookings',{
      registerHomes: registerHomes, 
      pageTitle: 'My Bookings', 
      currentPage: 'bookings', 
      isLoggedIn: req.session.isLoggedIn, 
      user:req.session.user});
  });
}
// exports.getFavourites= (req, res, next) => {
//   Favourite.find().then(favourites=>{
//     favourites=favourites.map(fav=>fav.homeId.toString());
//      Home.find().then(registerHomes=>{
//       const favouriteHomes=registerHomes.filter(home=>favourites.includes(home._id.toString()));
//     res.render('store/favourite',{favouriteHomes: favouriteHomes, pageTitle: 'My Favourites', currentPage: 'favourite'});
//   });
//   });
  
// }

exports.getFavourites= async (req, res, next) => {
  const userId=req.session.user._id;
  const user=await User.findById(userId).populate('fovourites');
  
    res.render('store/favourite',{
      favouriteHomes: user.fovourites, 
      pageTitle: 'My Favourites', 
      currentPage: 'favourite',
     isLoggedIn: req.session.isLoggedIn, 
      user:req.session.user
    });
  
}


exports.postAddToFavourite= async (req, res, next) => {
  const homeId=req.body.homeid;
  const userId=req.session.user._id;
  const user=await User.findById(userId);
  if(!user.fovourites.includes(homeId)){
    user.fovourites.push(homeId);
    await user.save();
  }
    res.redirect('/store/favourite'); // Redirect to the favourites page after processing the
}




// const fav=new Favourite(homeId);
//   fav.save().then(result=>{
//     console.log("Added to favourite", result);
//   }).catch(err=>{
//     console.log("Error adding to favourite:", err);
//   }).finally(()=>{ 
//     res.redirect('/store/favourite'); // Redirect to the favourites page after processing the
//   });

// }

exports.postRemoveFromFavourite= async (req, res, next) => {
  const homeid=req.params.homeid;
  const userId=req.session.user._id;
  const user=await User.findById(userId);
  if(user.fovourites.includes(homeid)){
  user.fovourites=user.fovourites.filter(fav=>fav!=homeid);
  await user.save();  
}
  
    res.redirect('/store/favourite'); // Redirect to the favourites page after processing the

}


exports.getHomeDetails= (req, res, next) => {
  const homeid=req.params.homeid;
  console.log("At home details page:", homeid);
  Home.findById(homeid).then(homes  => {
    const home=homes;
    if(!home){
      console.log("Home not found");
      res.redirect('/homes');
    }
    else{
    console.log("Home Details Found:", home);
  
  res.render('store/home-details',{
    home: home, 
    pageTitle: 'Home Details', 
    currentPage: 'Home',
    isLoggedIn: req.session.isLoggedIn,
    user:req.session.user});
    }
});  
};


 
