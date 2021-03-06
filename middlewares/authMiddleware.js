const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
  const token = req.cookies['jwt'];
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
      if (err) {
        console.error(err);
        res.redirect('/login');
        return;
      }
      next();
    });
  } else {
    // TODO: redirect back to /smoothies url after successful login
    // res.redirect('/login');
    res.format({
      'text/html': function () {
        res.redirect('/login');
      },
      'text/plain': function () {
        res.send('User is not logged in');
      },
      'application/json': function () {
        res.send({ err: 'User is not logged in' });
      },
    });
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies['jwt'];

  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, { id }) => {
      if (err) {
        console.error(err);
        res.locals.user = null;
        next();
      } else {
        res.locals.user = await User.findById(id).select({ email: 1 });
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
