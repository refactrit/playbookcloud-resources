const express = require('express');
const pbc = require('../util/pbc.js');

const asyncHandler = require('../util/asyncHandler.js');
const requireUser = require('../middleware/requireUser.js');

const router = express.Router();

router.get('/', [requireUser, asyncHandler(async function(req, res) {
  let playbooks = await pbc.listPlaybooks(req.user.id);
  res.render('run', {
      user: req.user,
      playbooks: playbooks,
      integration: true
  });
})]);

module.exports = router;