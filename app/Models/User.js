const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name : {type:String,required:true},
    user_name : {type : string,required:true,unique:true},
    mobile : {type:String,required:true,unique:true},
    email : {type : String, lowercase : true,unique:true},
    password : {type : String},
    status : {type:Number,required:true},
    otp : {type : Object, default : {
        code : 0,
        expiresIn : 0
    }},
    bills : {type : [], default : []},
    discount : {type : Number, default : 0},
    birthday : {type : String},
    role : {type : String, default : "USER"},
    courses : {type: [mongoose.Types.ObjectId], ref : "course", default : []},
    products : {type: [mongoose.Types.ObjectId], ref : "product", default : []},
},{
    timestamps : true,
    toJSON : {
        virtuals : true
    }
});

module.exports = {
    UserModel : mongoose.model("user", UserSchema)
}