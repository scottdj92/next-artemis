import initArtemis from "./initArtemis";
import Head from "next/head";
import { getDataFromTree } from "react-apollo";
import React from "react";

const isBrowser = typeof window !== undefined;

export default (App) => {
    return class Artemis extends React.Component {
        public static displayName = "withArtemis(App)";
        public static async getInitialProps(ctx) {
            const { Component, router } = ctx;

            let appProps = {};
            if (App.getInitialProps) {
                appProps = await App.getInitialProps(ctx);
            }

            const artemisState = {};
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

            artemisState.data = artemis.cache.extract();

            return {
                ...appProps,
                artemisState,
            };
        }

        constructor(props) {
            super(props);
            this.artemisClient = props.artemisClient || initArtemis(props.artemisState.data);
        }

        public render() {
            return <App {...this.props} artemisClient={this.artemisClient}/>
        }
    };
};
