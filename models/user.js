const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
// user schema

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'please enter an password'],
    minlength: [6, 'minimum password length is 6 characters'],
  },
});
// @mongoose hook    fire this function after doc saved to database
userSchema.post('save', function (doc, next) {
  console.log('new user created and saved', doc);
  next();
});
// @mongoose hook    fire this function before doc saved to database
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
// static method to login user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email: email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};
const User = mongoose.model('user', userSchema);
module.exports = User;
