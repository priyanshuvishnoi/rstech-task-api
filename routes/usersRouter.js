const express = require('express');
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.post('/userlogin', (req, res) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then(async user => {
      if (!user) {
        res.json({ message: 'user not found' });
      } else {
        if (user.blocked === true) {
          res.json({ message: 'user blocked by admin' });
        } else {
          const valid = await bcryptjs.compare(req.body.pin, user.pin);
          if (valid) {
            const token = authenticate.getToken({
              id: user._id,
              email: user.email,
            });
            res.status(200).json({ token });
          } else {
            res.status(401).json({ message: 'wrong password' });
          }
        }
      }
    })
    .catch(err => console.log(err));
});

router.post('/usersignup', async (req, res) => {
  console.log(
    JSON.stringify(req.body) + '**************************************'
  );
  const newUser = new User({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    email: req.body.email,
    mobileNumber: req.body.mobileNumber,
    pin: await bcryptjs.hash(`${req.body.pin}`, 10),
  });

  newUser
    .save()
    .then(result => {
      res.json(result);
      console.log(result);
    })
    .catch(err => {
      res.json(err);
      console.log(err);
    });
});

router.post('/getuserdata', (req, res) => {
  const { email } = jwt.decode(req.body.token);
  User.findOne({ email })
    .exec()
    .then(result => {
      res.status(200).json({ user: result });
    })
    .catch(err => console.log(err));
});

router.patch('/updatedetails/:value', async (req, res) => {
  const { email } = jwt.decode(req.body.token);
  if (req.params.value == ':name') {
    User.findOneAndUpdate({ email }, { name: req.body.name })
      .exec()
      .then(result => {
        res.status(200).json({ message: 'name updated' });
      });
  } else if (req.params.value == ':pin') {
    User.findOneAndUpdate(
      { email },
      { pin: await bcryptjs.hash(req.body.pin, 10) }
    )
      .exec()
      .then(result => {
        res.status(200).json({ message: 'name updated' });
      });
  } else if (req.params.value == ':mobileNumber') {
    User.findOneAndUpdate({ email }, { mobileNumber: req.body.mobileNumber })
      .exec()
      .then(result => {
        res.status(200).json({ message: 'name updated' });
      });
  }
});

module.exports = router;
