const mongoose = require('mongoose');

const provinceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    toJSON: { virtuals: true },
    versionKey: false,
    id: false,
    timestamps: true
});

provinceSchema.virtual('cities', {
    ref: 'City',
    localField: '_id',
    foreignField: 'province',
});

provinceSchema.pre('remove', async function(next) {
    await this.model('City').deleteMany({ province: this._id });
    next();
});

module.exports = mongoose.model('Province', provinceSchema);