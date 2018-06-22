import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import fetch from "isomorphic-fetch";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
let artemisClient = null;
const isBrowser = typeof window !== undefined;

if (!isBrowser) {
    global.fetch = fetch;
}

export type ArtemisState<T extends {}> = T;

function createArtemis<T>(initialState: ArtemisState<T>): ApolloClient<any> {
    return new ApolloClient({
        connectToDevTools: isBrowser,
        ssrMode: !isBrowser,
        link: new HttpLink({
            uri: publicRuntimeConfig.graphQLEndpoint,
            credentials: "same-origin",
        }),
        cache: new InMemoryCache().restore(initialState || {}),
    });
}

export default function initArtemis<T>(initialState: ArtemisState<T>): ApolloClient<T> {
    // create a new client for each server-side request
    // avoids shared data connections
    if (!isBrowser) {
        return createArtemis(initialState);
    }

    if (!artemisClient) {
        artemisClient = createArtemis(initialState);
    }

    return artemisClient;
}
