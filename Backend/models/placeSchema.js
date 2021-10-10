const mongoose = require('mongoose')
const placeSchema = new mongoose.Schema({
    title:{type:String,required:true},
    info:{type:String,required:true},
    desc:{type:String,required:true},
    user:{type:mongoose.Types.ObjectId,required:true,ref:'User'}

})
module.exports = mongoose.model('Place',placeSchema)