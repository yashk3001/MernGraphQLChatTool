const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const resolvers = require("./graphql/resolvers/index");
const typeDefs = require("./graphql/typeDefs");
const contextMiddleware = require("./util/contextMiddleware.js");

const MONGODB = process.env.CONNECTION_URL;
const PORT = 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMiddleware,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

mongoose.set("strictQuery", true);

mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log("DB connected");
  })

  .catch((err) => {
    console.log("error:::", err);
  });
