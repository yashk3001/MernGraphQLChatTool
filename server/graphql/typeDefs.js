const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    email: String
    createdAt: String
    token: String
    profilePicUrl: String
    name: String
    DOB: Date
    mobileNumber: String
    gender: String
    latestMessage: Message
  }
  scalar Date
  type Message {
    uuid: String!
    content: String!
    from: String!
    to: String!
    createdAt: String!
    reactions: [Reaction]
  }
  type Reaction {
    uuid: String!
    content: String!
    createdAt: String
    message: Message
    user: User
  }
  type Query {
    getUsers: [User]!

    getMessages(from: String!): [Message]!
  }
  type Mutation {
    register(
      email: String!
      password: String!
      confirmPassword: String!
      name: String
      gender: String
      DOB: Date
      mobileNumber: String
      profilePicUrl: String
    ): User!
    login(identifier: String!, password: String!): User!
    sendMessage(to: String!, content: String!): Message!
    reactToMessage(uuid: String!, content: String!): Reaction!
  }
  type Subscription {
    newMessage: Message!
    newReaction: Reaction!
  }
`;

module.exports = typeDefs;
