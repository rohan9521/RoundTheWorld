const mongoose = require('mongoose')
const Place = require('./placeSchema')
//require('mongoose-type-email')
const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    password:{type:String,required:true},
    email:{type:String,required:true},
    places:[{type:mongoose.Types.ObjectId,required:true,ref:'Place'}]
    
})

module.exports=mongoose.model('User',userSchema)