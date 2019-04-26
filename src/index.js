const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type ValidationError {
    field: String
    msg: String
  }

  type TimeoutError {
    reason: String
    seconds: Int
  }

  type Error {
    validationError: ValidationError
    timeoutError: TimeoutError
  }

  type Mutation {
    register: Error
  }

  type Query {
    hello: String
  }
`;

let showTimeoutError = false;

const resolvers = {
  Query: { hello: () => "hi" },
  Mutation: {
    register: () => {
      const error = {};

      if (showTimeoutError) {
        error.timeoutError = { reason: "too many requests", seconds: 180 };
      } else {
        error.validationError = { field: "email", msg: "already taken" };
      }

      showTimeoutError = !showTimeoutError;

      return error;
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
