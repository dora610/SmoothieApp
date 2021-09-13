const { Schema, model } = require('mongoose');
const { isEmail } = require('validator');
const { genSalt, hash, compare } = require('bcrypt');

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'You must supply an email id'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [isEmail, 'Please enter valid email id'],
  },
  password: {
    type: String,
    required: [true, 'Password is missing'],
    minlength: 6,
  },
});

userSchema.pre('save', async function (next) {
  const salt = await genSalt();
  this.password = await hash(this.password, salt);
  next();
});

userSchema.statics.login = async function ({ email, password }) {
  const user = await this.findOne({ email });
  if (user) {
    const isCorrectUser = await compare(password, user.password);
    if (isCorrectUser) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};

module.exports = model('User', userSchema);
