import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// Create HTTP link for standard queries and mutations
const url = import.meta.env.VITE_MESSAGING_ENDPOINT
const httpLink = createHttpLink({
  uri: `${url}/graphql`,  // Your HTTP endpoint
});

// Initialize the Apollo Client
const client = new ApolloClient({
  link: httpLink,  // Use the HTTP link for all operations
  cache: new InMemoryCache(),  // Caching mechanism
});

export default client;
