const {Schema, Types, model} = require("mongoose");

const PostSchema = new Schema({
    title: {type: String, required: true},
    userId: {type: Types.ObjectId,ref:"User", required: true},
    slug: {type: String,unique: true,trim: true},
    amount: {type: Number, required: true, default: 0},
    content: {type: String, required: true},
    category: {type: Types.ObjectId, ref: "Category", required: true},
    city: {type: Types.ObjectId,ref:"City", required: false},
    district: {type: String, required: false},
    address: {type: String, required: false},
    coordinate: {type: [Number], required: true}, //51.215485487, 52.687524154
    images: {type: [String], required: false, default: []},
    options: {type: Object, default: {}}
}, {
    timestamps: true
});

const PostModel = model("post", PostSchema);

module.exports = PostModel;