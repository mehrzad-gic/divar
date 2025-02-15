const { Schema, mongoose } = require('mongoose');

const OTPSchema = new Schema({
  code: { type: String, required: true },
  expire: { type: Number, default: 0 } // Set to 0 by default, but you can change this
});


const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  slug: { type: String, unique: true, index: true },
  password: { type: String, required: true },
  email_verified_at: { type: String, default: null }, 
  otp: { type: OTPSchema, default: null }
}, { timestamps: true }); // Fix typo: timestamps (not timeStamps)

// Create and export the User model
const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = UserModel;