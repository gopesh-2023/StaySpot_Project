

const mongoose = require('mongoose');
// const favourite = require('./favourite');

const homeSchema=new mongoose.Schema({
    homeName:{type: String,  required: true},
    price:{type: Number, required: true},
    location:{type: String, required: true},
    photo: String,
    description: String,
});   

// homeSchema.pre('findOneAndDelete', async function(next) {
//     const homeId= this.getQuery()._id;
//     await favourite.deleteMany({homeId: homeId});
// });

module.exports=mongoose.model('Home', homeSchema);
