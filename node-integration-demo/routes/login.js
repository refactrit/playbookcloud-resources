const passport = require('passport');
const express = require('express');

const router = express.Router();

router.get('/', function(req, res) {
  res.render('login');
});

router.post('/', [passport.authenticate('username'), function(req, res) {
  res.redirect('/integration');
}]);

module.exports = router;
