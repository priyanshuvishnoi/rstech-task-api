const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { getToken } = require('../middlewares/authenticate');
const router = express.Router();

router.post('/login', (req, res) => {
  const { email, pin } = req.body;
  console.log(req.body);
  if (email === 'admin@gmail.com' && pin == 1234) {
    const token = getToken({ id: pin, email });
    res.status(200).json({ token });
  } else {
    res.status(401).json({ message: 'Wrong email or password' });
  }
});

router.get('/getusers/:token', (req, res) => {
  const { email } = jwt.decode(req.params.token.substring(1));
  if (email === 'admin@gmail.com') {
    User.find({})
      .exec()
      .then(doc => res.status(200).json({ users: doc }))
      .catch(err => console.log(err));
  } else {
    res.status(401);
  }
});

router.get('/blockuser/:id', (req, res) => {
  User.findOneAndUpdate({ _id: req.params.id.substring(1) }, { blocked: true })
    .exec()
    .then(result => {
      res.status(200).json({ message: 'user blocked' });
    })
    .catch(err => console.log(err));
});

router.get('/deleteuser/:id', (req, res) => {
  User.findOneAndDelete({ _id: req.params.id.substring(1) })
    .exec()
    .then(result => res.status(200).json({ message: 'user deleted' }))
    .catch(err => console.log(err));
});

module.exports = router;
