const mongoose = require('mongoose');
const Schema = mongoose.Schema,
  ObjectId = mongoose.ObjectId;

const userSchema = new Schema(
  {
    _id: ObjectId,
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    pin: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    blocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
