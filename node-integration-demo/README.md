# playbook.cloud Integration Example

This sample application demonstrates how to build a 3rd-party integration with playbook.cloud. It uses Node.js and Redis, and includes a GUI sample application.

![screenshot 1](screenshot1.png)

## How to Run

1. Spin up a Redis instance on localhost and the default port (6379). This can be done with a single command if you have Docker installed: `docker run --rm --network=host --name myredis redis redis-server`
2. `npm install`
3. `npm start:debug`
4. Access the application at http://localhost:3000

## Limitations

1. Runs on HTTP. Please use HTTPS in production.
2. Stores passwords and tokens unencrypted in the database. Always encrypt sensitive data before storing in your own database.
3. Requires Node.js 8 or higher.