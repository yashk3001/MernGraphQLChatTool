const Jwt = require("jsonwebtoken");
const { PubSub } = require("apollo-server");
const dotenv = require("dotenv");
dotenv.config();

const pubsub = new PubSub();

const JWT_SECRET = process.env.JWT_KEY;

const contextMiddleware = (context) => {
  let token;
  if (context.req && context.req.headers.authorization) {
    token = context.req.headers.authorization.split("Bearer ")[1];
  } else if (context.connection && context.connection.context.Authorization) {
    token = context.connection.context.Authorization.split("Bearer ")[1];
  }

  if (token) {
    Jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      context.user = decodedToken;
    });
  }

  context.pubsub = pubsub;

  return context;
};

module.exports = contextMiddleware;
