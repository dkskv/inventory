import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  fromPromise,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { AuthTokensDto, RefreshTokensDocument } from "../../gql/graphql";

const enum TokensKeys {
  accessToken = "accessToken",
  refreshToken = "refreshToken",
}

const authLink = setContext((_, { headers }) => {
  const accessToken = localStorage.getItem(TokensKeys.accessToken);

  return {
    headers: {
      ...headers,
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  };
});

const logout = () => {
  localStorage.removeItem(TokensKeys.accessToken);
  localStorage.removeItem(TokensKeys.refreshToken);

  window.location.href = "/sign-in";
};

export const saveTokens = ({ refreshToken, accessToken }: AuthTokensDto) => {
  localStorage.setItem(TokensKeys.accessToken, accessToken);
  localStorage.setItem(TokensKeys.refreshToken, refreshToken);
};

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (!graphQLErrors) {
    return;
  }

  for (const err of graphQLErrors) {
    if (err.extensions?.code === "UNAUTHENTICATED") {
      const refreshToken = localStorage.getItem(TokensKeys.refreshToken);

      if (typeof refreshToken !== "string") {
        logout();
        throw new Error("Refresh token missing");
      }

      return fromPromise(
        refreshTokens(refreshToken)
          .then(saveTokens)
          .catch((refreshError) => {
            console.error({ refreshError });

            logout();
            throw refreshError;
          })
      ).flatMap(() => forward(operation));
    }
  }
});

const refreshTokens = async (refreshToken: string): Promise<AuthTokensDto> => {
  const { data } = await client.mutate({
    mutation: RefreshTokensDocument,
    variables: { refreshToken },
  });

  if (!data) {
    throw new Error("Failed to refresh tokens");
  }

  return data.refresh;
};

export const client = new ApolloClient({
  link: from([
    errorLink,
    authLink,
    new HttpLink({ uri: import.meta.env.VITE_API_URL }),
  ]),
  cache: new InMemoryCache(),
});
