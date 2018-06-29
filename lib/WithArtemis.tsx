import initArtemis, { ArtemisState } from "./initArtemis";
import Head from "next/head";
import { getDataFromTree } from "react-apollo";
import React from "react";
import { ApolloClient } from "apollo-client";

const isBrowser = typeof window !== undefined;

interface IProps<T> {
    artemisClient: ApolloClient<ArtemisState<T>>;
    artemisState: ArtemisState<T>;
}

interface IArtemisMembers<T> {
    artemisClient: ApolloClient<ArtemisState<T>>;
}

export default (App) => {
    return class Artemis<T extends IArtemisMembers<any>> extends React.Component<IProps<T>, {}> {
        public static displayName = "withArtemis(App)";
        public artemisClient: ApolloClient<any>;
        public static async getInitialProps(ctx) {
            const { Component, router } = ctx;

            let appProps = {};
            if (App.getInitialProps) {
                appProps = await App.getInitialProps(ctx);
            }

            let artemisState = {};
            const artemis = initArtemis();
            try {
                await getDataFromTree(
                    <App
                        {...appProps}
                        Component={Component}
                        router={router}
                        apolloState={artemisState}
                        apolloClient={artemis}
                    />,
                );
            } catch (error) {
                // tslint:disable-next-line:no-console
                console.error("Error while running `getDataFromTree`", error);
            }

            if (!isBrowser) {
                // getDataFromTree does not call componentWillUnmount
                // we need to clear the <Head> manually
                Head.rewind();
            }

            artemisState = artemis.cache.extract();

            return {
                ...appProps,
                artemisState,
            };
        }

        constructor(props) {
            super(props);
            this.artemisClient = props.artemisClient || initArtemis(props.artemisState);
        }

        public render() {
            return <App {...this.props} artemisClient={this.artemisClient}/>;
        }
    };
};
