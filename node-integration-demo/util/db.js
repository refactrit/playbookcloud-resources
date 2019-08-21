const Redis = require('ioredis');
const uuid = require('uuid/v4');

const db = new Redis();

module.exports = {
    db: db,
    createUser: async function(username) {
      let id = await db.hget('user:', username);
      if (id) {
        let user = await db.hgetall(`user:${id}`);
        user = Object.keys(user).length > 0 ? user : null;
        if (!user) {
          throw new Error(`User with id ${id} not found.`);
        }
        return user;
      } else {
        id = uuid();
        let result = await db.hsetnx('user:', username, id);
        if (result === 0) {
          throw new Error(`User with id ${id} was already created.`);
        }
        let user = {
          id: id,
          username: username,
          created: new Date().toISOString()
        };
        await db.hmset(`user:${id}`, user);
        return user;
      }
    },
    getIntegration: async function(userId) {
      let result = await db.hgetall(`integration:${userId}`);
      return Object.keys(result).length > 0 ? result : null;
    },
    setIntegration: async function(userId, integration) {
      await db.hmset(`integration:${userId}`, integration);
    },
    deleteIntegration: async function(userId) {
      await db.del(`integration:${userId}`);
    },
    getToken: async function(userId) {
      return await db.get(`token:${userId}`);
    },
    setToken: async function(userId, token) {
      return await db.set(`token:${userId}`, token);
    }
};