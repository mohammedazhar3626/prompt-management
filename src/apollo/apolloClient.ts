import {
    ApolloClient,
    InMemoryCache,
    HttpLink,
    ApolloLink,
} from "@apollo/client";

const httpLink = new HttpLink({
    uri: process.env.GRAPHQL_URL,
});

const authLink = new ApolloLink((operation, forward) => {
    const authStorage = localStorage.getItem("auth-storage");

    let token: string | null = null;

    if (authStorage) {
        try {
            const parsed = JSON.parse(authStorage);
            token = parsed?.state?.token ?? null;
        } catch {
            token = null;
        }
    }

    operation.setContext({
        headers: {
            ...(token
                ? {
                    Authorization: `Bearer ${token}`,
                }
                : {}),
        },
    });

    return forward(operation);
});

export const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});