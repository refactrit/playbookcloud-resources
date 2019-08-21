var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (req.user) {
    res.redirect('/integration');
  } else {
    res.redirect('/login')
  }
});

module.exports = router;
