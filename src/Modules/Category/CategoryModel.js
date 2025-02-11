import mongoose, { Schema,model } from "mongoose";

const CategorySchema = new Schema({
    name : {required : true,type:String},
    icon : {default : "",type:String,required : false},
    des : {required : true,type:String},
    slug : {type:String,required : true,unique : true,index:true},
    parrent : {required : false,type:mongoose.Types.ObjectId,ref:"Category"},
    parrents : {required : false,type:[mongoose.Types.ObjectId],ref:"Category",default:[]},
},{
    toJSON:{virtuals:true},
    versionKey:false,
    id:false,
    timestamps:true
})

CategorySchema.virtual('childrens',{
    ref : 'Category',
    localField:'_id',
    foreignKey:'parent',
});


const CategoryModel = model('category',CategorySchema);

module.exports = CategoryModel;