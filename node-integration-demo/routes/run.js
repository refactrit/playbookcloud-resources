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

router.post('/', [requireUser, asyncHandler(async function(req, res) {
  await pbc.runPlaybook(req.user.id, req.body.playbook_id, parseInt(req.body.playbook_revision));
  let playbooks = await pbc.listPlaybooks(req.user.id);
  res.render('run', {
      user: req.user,
      playbooks: playbooks,
      integration: true,
      resultMessage: 'Playbook execution started!'
  });
})]);

module.exports = router;