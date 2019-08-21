const express = require('express');

const asyncHandler = require('../util/asyncHandler.js');
const requireUser = require('../middleware/requireUser.js');
const { getIntegration, setIntegration, deleteIntegration } = require('../util/db.js');

const router = express.Router();

router.get('/', [requireUser, asyncHandler(async function(req, res) {
  let integration = await getIntegration(req.user.id);
  render(req, res, integration);
})]);

router.post('/', [requireUser, asyncHandler(async function(req, res) {
  let integration = {
    username: req.body.username,
    password: req.body.password   // Encrypt me!
  };
  await setIntegration(req.user.id, integration);
  render(req, res, integration);
})]);

router.post('/delete', [requireUser, asyncHandler(async function(req, res) {
  await deleteIntegration(req.user.id);
  render(req, res);
})]);

function render(req, res, integration) {
  res.render('integration', {
    user: req.user,
    integration: integration && {
      username: integration.username
    }
  });
}

module.exports = router;
