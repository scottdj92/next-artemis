# next-artemis
A companion for your Apollo app with Next.js

## Features
* Built with TypeScript for extended stability
* Built also with Jest and Enzyme for unit testing
* Apollo cache hydration + single app connections (a single connection will only have a single client)
* Exported types and interfaces
* Hooks into NextJS's configuration object

# Usage
Artemis will hook into NextJS's `getConfig()` object. You can provide it via `next.config.js`:

```tsx
module.exports = withSass(withTypescript({
    publicRuntimeConfig: {
        graphQLEndpoint: // your GraphQL endpoint,
    }
}));
```

If no object is provided, Artemis will fall back to `localhost:5000/graphql`.

`WithArtemis` is next-artemis's default export. You import this wherever you'd like to use the client. It passes down a prop called `artemisClient` to your wrapped component, which is a wrapped instance of `ApolloClient`.

In _app.tsx:

```tsx
import App, { Container } from "next/app";
import React from "react";
import { ApolloProvider } from "apollo-provider";
import { ApolloClient } from "apollo-client";
import WithArtemis, { ArtemisState } from "next-artemis";

interface AppProps {
    artemisClient: ApolloClient<ArtemisState<any>>; //where <any> is your apollo client shape
}

class MyApp extends App<AppProps> {
    public render () {
        const { Component, pageProps, router, artemisClient } = this.props;
        return (
            <ApolloProvider client={artemisClient}/>
                <Container>
                    <Component {...pageProps}/>
                </Container>
            </ApolloProvider>
        );
    }
}

export default WithArtemis(MyApp);
```

Next-Artemis also exports an `initArtemis` function that you can call with your initial state to hydrate Apollo's cache.

Usage:
```ts
import { initArtemis } from "next-artemis";

const client = initArtemis({
    data: {
        foo: "bar",
        baz: "foo"
    }
});
```
You'd import this and use it wherever you'd use an instance of ApolloClient.

## Roadmap
* Improve unit tests
* Create an Artemis Provider that handles client linking for you

# This package is currently under development - Pull Requests are greatly appreciated!
