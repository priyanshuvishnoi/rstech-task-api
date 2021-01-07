const jwt = require('jsonwebtoken');

exports.getToken = ({ _id, email }) =>
  jwt.sign({ _id, email }, process.env.TOKEN_SECRET);
