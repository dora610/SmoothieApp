const User = require('../models/User');
const jwt = require('jsonwebtoken');

const maxAge = 1000 * 60 * 15;

const handleErrors = (err) => {
  // console.error(err.message, err.code);
  let errors = {};
  // check for duplicate email

  if (err.message.includes('incorrect')) {
    const prop = err.message.split(' ')[1];
    errors[prop] = `That ${prop} is not valid!`;
  }

  if (err.code == 11000) {
    errors['email'] = 'Email is already taken';
  }
  if (err.message.includes('User validation failed')) {
    errArr = Object.entries(err.errors);
    errArr.forEach(
      ([key, { properties }]) => (errors[key] = properties.message)
    );
  }
  return errors;
};

// jwt generator
const createToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

module.exports.signup_get = (req, res) => {
  res.render('signup');
};
module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, {
      maxAge,
      secure: true,
      httpOnly: true,
    });
    res.status(201).json({ user: user._id });
  } catch (err) {
    res.status(400).json({ errors: handleErrors(err) });
  }
};
module.exports.login_get = (req, res) => {
  res.render('login');
};
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(req.body);
    const token = createToken(user._id);
    res.cookie('jwt', token, {
      maxAge,
      secure: true,
      httpOnly: true,
    });
    res.status(200).json({ user: user._id });
  } catch (err) {
    res.status(400).json({ errors: handleErrors(err) });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
};
