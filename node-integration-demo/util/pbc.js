const util = require('util');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const jwks = require('jwks-rsa');

const { getToken, setToken, getIntegration } = require('../util/db.js');

const baseUrl = 'https://api.playbook.cloud/v1';
const jwksUri = 'https://auth.playbook.cloud/.well-known/jwks.json';
const jwtDomain = 'auth.playbook.cloud';

let jwksClient = jwks({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: jwksUri
});

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
    let result = await fetch(`${baseUrl}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        playbook_id: playbook_id,
        playbook_revision: playbook_revision
      })
    });
    if (result.status !== 201) {
      throw new Error(`Failed to run playbooks for user ${userId}. Status code is ${result.status}.`);
    }
    let body = await result.json();
    console.info(body);
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
  let payload = await verifyToken(body.token);
  let exp = payload.exp*1000 - Date.now() - 5000;
  await setToken(userId, body.token, exp);
  return body.token;
}

async function verifyToken(token) {
  function getKey(header, callback) {
    jwksClient.getSigningKey(header.kid, function(err, key) {
      if (err) {
        callback(err);
      } else {
        callback(null, key.publicKey || key.rsaPublicKey);
      }
    });
  }
  return await util.promisify(jwt.verify.bind(jwt))(token, getKey, {
    audience: `https://${jwtDomain}`,
    issuer: `https://${jwtDomain}/`,
    algorithms: ['RS256']
  });
}