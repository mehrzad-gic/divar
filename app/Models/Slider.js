const mongoose = require('mongoose');

const SliderSchema = new mongoose.Schema({
    name : {type:String,required:true},
    link : {type:String,required:true},
    img : {type:String,required:true},
    status : {type:Number,required:true},
    type : {type : String, default : "main"}
});

module.exports = {
    SliderModel : mongoose.model("slider", SliderSchema)
}