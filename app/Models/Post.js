const { types } = require('joi');
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    name : {type:String,required:true},
    des : {type:String,required:true},
    img : {type:String,required:true},
    status : {type:Number,required:true},
    author : {types:mongoose.Types.ObjectId,ref:'user',required:true},
    tags : {types:[mongoose.Types.ObjectId],ref:'tag',required:true},
    likes : {type : [mongoose.Types.ObjectId], ref: "user", default : []},
    dislikes : {type : [mongoose.Types.ObjectId], ref: "user", default : []},
    bookmarks : {type : [mongoose.Types.ObjectId], ref: "user", default : []}
},{
    timestamps : true, 
    versionKey : false,
    toJSON : {
        virtuals: true
    }
});

module.exports = {
    PostModel : mongoose.model('post',PostSchema)
}