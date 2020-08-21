const router = require('express').Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Users = require("./user-model.js");
const { isValid } = require("./user-service.js");
const secret = require("../constants/secret.js");


router.post('/register', (req, res) => {
  // implement registration
  const credentials = req.body;
  if (isValid(credentials)) {
    const rounds = process.env.BCRYPT_ROUNDS || 8;
    const hash = bcryptjs.hashSync(credentials.password, rounds);
    credentials.password = hash;
    Users.add(credentials)
      .then(user => {
        res.status(201).json(user);
      })
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message: "please provide username and password and the password shoud be alphanumeric",
    });
  }
});

router.post('/login', (req, res) => {
  // implement login
  const { username, password } = req.body;
  if (isValid(req.body)) {
    Users.findBy({ username: username })
      .then(([user]) => {
        console.log(user);
        if (user && bcryptjs.compareSync(password, user.password)) {
          console.log('password matched');
          const token = generateToken(user)
          console.log(token);
          res.status(200).json({
            message: "Welcome to our API",
            token,
          });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      })
      .catch(err => {
        res.status(500).json({ message: err.message });
      });
  } else {
    res.status(400).json({
      message: "please provide username and password and the password shoud be alphanumeric",
    });
  }
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  // const secret = secret.jwtSecret;
  const options = {
    expiresIn: '1d'
  };
  return jwt.sign(payload, secret.jwtSecret, options);
}

module.exports = router;
