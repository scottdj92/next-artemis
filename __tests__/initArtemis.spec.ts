import initArtemis from "../lib/initArtemis";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { makeExecutableSchema, addMockFunctionsToSchema } from "graphql-tools";
import { mockNetworkInterface } from "apollo-test-utils";

const typeDefs = `
    type User {
        id: Int
        name: String
    }

    type Query {
        user: User
    }
`;

const schema = makeExecutableSchema({ typeDefs });
addMockFunctionsToSchema({ schema });
const mockedNetworkInterface = mockNetworkInterface({ schema });

describe("initArtemis", () => {
    it("creates an instance of Apollo Client with no data supplied", () => {
        const basic = initArtemis({});
        expect(basic).toBeInstanceOf(ApolloClient);
    });

    it("creates an instance of Apollo Client with data supplied", () => {
        const mockData = {
            foo: "bar",
            baz: "foo",
        };
        const init = initArtemis(mockData);
        const apollo = new ApolloClient({
            link: mockedNetworkInterface,
            cache: new InMemoryCache().restore({ mockData }),
        });
        expect(init).toBeInstanceOf(apollo);
    });
});
