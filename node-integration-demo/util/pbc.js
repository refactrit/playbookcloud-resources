const fetch = require('node-fetch');

const { getToken, setToken, getIntegration } = require('../util/db.js');

const baseUrl = 'https://api.playbook.cloud/v1'

module.exports = {
  listPlaybooks: async function(userId) {
    let token = await renewToken(userId);
    let result = await fetch(`${baseUrl}/playbooks`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (result.status !== 200) {
      throw new Error(`Failed to list playbooks for user ${userId}. Status code is ${result.status}.`);
    }
    let body = await result.json();
    return body.playbooks;
  },
  runPlaybook: async function(userId, playbook_id, playbook_revision) {
    let token = await renewToken(userId);
    let result = await fetch(`${baseUrl}/playbooks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        playbook_id: playbook_id,
        playbook_revision: parseInt(playbook_revision)
      })
    });
    if (result.status !== 200) {
      throw new Error(`Failed to run playbooks for user ${userId}. Status code is ${result.status}.`);
    }
  }
};

async function renewToken(userId) {
  let token = await getToken(userId);
  if (token) return token;
  let integration = await getIntegration(userId);
  if (!integration) throw new Error(`User with id ${userId} does not have an integration configured.`);
  let auth = Buffer.from(`${integration.username}:${integration.password}`).toString('base64');
  let result = await fetch(`${baseUrl}/token`, {
    headers: {
      Authorization: `Basic ${auth}`
    }
  });
  if (result.status !== 201) {
    throw new Error(`Failed to get token for user ${userId}. Status code is ${result.status}.`);
  }
  let body = await result.json();
  await setToken(userId, body.token);
  return body.token;
}