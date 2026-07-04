import { GraphQLClient } from "graphql-request";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8080";

export const graphqlClient = new GraphQLClient(`${API_BASE_URL}/graphql`, {
  headers: {
    Accept: "application/json",
  },
});

export { API_BASE_URL };
