const mongoose = require('mongoose'); // Ensure mongoose is imported
const { Schema, model } = mongoose;

const CategorySchema = new Schema({
    name: { required: true, type: String },
    icon: { default: "", type: String, required: false },
    des: { required: true, type: String },
    slug: { type: String, required: true, unique: true, index: true },
    status: {type:Boolean,default:false},
    parent: { required: false, type: mongoose.Types.ObjectId, ref: "Category", default: null },
    parents: { required: false, type: [mongoose.Types.ObjectId], ref: "Category", default: [] },
}, {
    toJSON: { virtuals: true },
    versionKey: false,
    id: false,
    timestamps: true
});

// Virtual for children
CategorySchema.virtual('children', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'parent',
});

// Pre-find middleware to populate parent data
CategorySchema.pre(['find', 'findOne'], function() {
    this.populate('parent', 'name slug'); // Adjust fields as needed
});

// Pre-remove middleware
CategorySchema.pre('remove', async function(next) {
    await this.model('Category').deleteMany({ parent: this._id });
    next();
});

const CategoryModel = model('Category', CategorySchema); // Use 'Category' instead of 'category'

module.exports = CategoryModel;
