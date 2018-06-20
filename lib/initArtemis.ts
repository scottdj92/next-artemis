import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import fetch from "isomorphic-unfetch";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

let apolloClient = null;
const isBrowser = typeof window !== undefined;

if (!isBrowser) {
    global.fetch = fetch;
}

function createArtemis(initialState) {
    return new ApolloClient({
        connectToDevTools: isBrowser,
        ssrMode: !isBrowser,
        link: new HttpLink({
            uri: publicRuntimeConfig.graphQLEndpoint,
            credentials: "same-origin"
        }),
        cache: new InMemoryCache().restore(initialState || {})
    })
}

export default function initArtemis(initialState) {
    // create a new client for each server-side request
    // avoids shared data connections
    if (!isBrowser) {
        return createArtemis(initialState);
    }

    if (!apolloClient) {
        apolloClient = createArtemis(initialState);
    }

    return apolloClient;
}
