const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    displayName: { type: String },
    email: {
      type: String,
      required: [true, 'Please enter an email'],
      unique: [true, 'Email already exist'],
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Please enter a valid E-mail!');
        }
      },
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      validate(value) {
        if (!validator.isLength(value, { min: 6, max: 1000 })) {
          throw Error('Length of the password should be between 6-1000');
        }
        if (value.toLowerCase().includes('password')) {
          throw Error('The password should not contain the keyword "password"!');
        }
      },
    },
    avatar: { type: String },
    social_id: { type: String },
    isActive: { type: Boolean, default: false },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    follower: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    blocking: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    blocked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);
//static method to login user:
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email: email.toLowerCase() });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};
// fire a function before doc saved to db
userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
//
const User = mongoose.model('User', userSchema);
module.exports = User;
