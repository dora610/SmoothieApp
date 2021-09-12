const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  const token = req.cookies['jwt'];
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
      if (err) {
        console.error(err);
        res.redirect('/login');
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};

// TODO: redirect back to /smoothies url after successful login

module.exports = { requireAuth };
