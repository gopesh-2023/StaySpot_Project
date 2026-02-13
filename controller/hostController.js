const Home=require('../models/home');
const fs=require('fs');

exports.getAddHome=(req, res, next)=>{
    console.log("Handling for /add-home");
    res.render('host/edit-home',{
        pageTitle: 'Add Home', 
        currentPage: 'add-home', 
        editing: false, 
        isLoggedIn: req.session.isLoggedIn,
        user:req.session.user
    });
}
exports.getEditHome=(req, res, next)=>{
    const homeid=req.params.homeid;
    const editing=req.query.editing=='true';
      Home.findById(homeid).then(homes  => {
    const home=homes;
        if(!home){
            console.log("Home not found for editing");
            return res.redirect('/host/host-home-list');
        }
         res.render('host/edit-home',{
            home: home, 
            pageTitle: 'Edit Home', 
            currentPage: 'edit-home', 
            editing: editing, 
            isLoggedIn: req.session.isLoggedIn,
            user:req.session.user});
        console.log("editing home here", homeid, editing, home);
   
    });
}


exports.postEditHome=(req, res, next)=>{
    console.log('Home Registration successfully',req.body);

    const { id, homeName, price, location, description}=req.body;
    
    Home.findById(id).then((home)  => {
        
        home.homeName=homeName;
        home.price=price;
        home.location=location;
        home.description=description;
        if(req.file){
             fs.unlink(home.photo, (err) => {
                if (err) {
                    console.log("Error deleting old image file:", err);
                }   
            });

           home.photo = "/" + req.file.path.replace(/\\/g, "/");
        }
        home.save().then((result)=>{
        console.log('Home Updated Successfully', result);
        
    }).catch(err=>{
        console.log("Error updating home:", err);
    })
     res.redirect("/host/host-home-list");
}).catch(err=>{
    console.log("Error while finding home:", err);   
});
};
   

exports.getHostHomeList=(req, res, next)=>{
     Home.find().then(registerHomes=>{
        res.render('host/host-home-list',{
            registerHomes: registerHomes, 
            pageTitle: 'Host Home List', 
            currentPage: 'host-home-list', 
            isLoggedIn: req.session.isLoggedIn,
             user:req.session.user});
      });
}

exports.postAddHome=(req, res, next)=>{
    console.log('Home Registration successfully',req.body);
    const{ homeName, price, location, description}=req.body;
    console.log(req.file);
    if(!req.file){
        return res.status(422).send('Image file is required.');
    }
    const photo = "/" + req.file.path.replace(/\\/g, "/");

    const home=new Home({homeName, price, location, photo, description});
     home.save().then(()=>{
        console.log('Home Updated Successfully');
    });
    res.redirect("/host/host-home-list");
}

// exports.postEditHome=(req, res, next)=>{
//     console.log('Home Registration successfully',req.body);
//     const{id, homeName, price, location, photo, description}=req.body;
//     const home=new Home(homeName, price, location, photo, description, id);
//     // home._id=id;
//     home.save().then(result=>{
//         console.log('Home Updated Sucessfully',result);
//     } );
//     res.redirect("/host/host-home-list");
// }

exports.postDeleteHome=(req, res, next)=>{
    const homeid=req.params.homeid;
    console.log("Deleting home here", homeid);
    Home.findByIdAndDelete(homeid).then(() =>{
    res.redirect("/host/host-home-list");
    }).catch(err=>{
        console.log("Error deleting home:", err);
    });
}

 
