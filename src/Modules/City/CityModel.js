const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        trim: true
    },
    province: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Province',
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

citySchema.index({ slug: 1, province: 1 }, { unique: true });

citySchema.pre(['find', 'findOne'], function(next) {
    this.populate('province');
    next();
});

module.exports = mongoose.model('City', citySchema);