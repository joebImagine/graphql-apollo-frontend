import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000',
    cache: new InMemoryCache({
          typePolicies: {
      User: {
        keyFields: ["name", "age", "id"], // Combine fields to generate a unique identifier
      },
    },
  }),
});


/* Uncomment if you want to test out global pagination */
/* 
const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          users: {
            keyArgs: false, // Disables default keying by variables
                merge(existing = { edges: [] }, incoming) {
              return {
                edges: [...existing.edges, ...incoming.edges], // Append new edges
                pageInfo: incoming.pageInfo, // Overwrite pageInfo
              };
            },
          },
        },
      },
    },
  }),
});
*/

export default client;
