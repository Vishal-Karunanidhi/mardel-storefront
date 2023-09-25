import { gql, ApolloClient, HttpLink, InMemoryCache, ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { getClientSideCookies } from '@Lib/common/cookieUtility';
import { SESSION_TIMEOUT_USER_CONST } from '@Constants/sessionMsgConstants';

/*TODO: Analyse and implement Refetch, NetworkCall, Caching strategy*/
const credentials = 'include';
const cache = new InMemoryCache();
const sessionResponseHeader = process.env.NEXT_PUBLIC_SESSION_RESPONSE_HEADER;

let fetchOptions = {};
if (process.env.NODE_ENV === 'development') {
  const https = require('https');
  fetchOptions = { agent: new https.Agent({ rejectUnauthorized: false }) };
}

/*Actual BFF Endpoint*/
const bffGql = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_BFF_URI}`,
  credentials,
  fetchOptions
});

const exitMessageThrow = (userType) => {
  const sessionErrorStorage = window?.localStorage?.getItem(SESSION_TIMEOUT_USER_CONST);
  if (!sessionErrorStorage) {
    window.localStorage.setItem(SESSION_TIMEOUT_USER_CONST, userType);
    window.dispatchEvent(new Event('storage'));
  }
};

const errorLink = onError((result) => {
  const { graphQLErrors, networkError, operation, response } = result;
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(`[GraphQL error]::: \nQuery: ${operation?.operationName} \nMessage: ${message}`)
    );
    for (let err of graphQLErrors) {
      const { extensions, message, locations, path } = err;
      console.error(
        `[GraphQL error]::: \nQuery: ${operation?.operationName} \nMessage: ${message}`
      );

      switch (extensions.code) {
        case 'UNAUTHENTICATED':
          if (typeof window !== 'undefined') {
            console.warn('Unauthenticated Operation for the user', operation?.operationName);
            guestLoggedInSessionValidation(networkError?.['response'], 'UNAUTHENTICATED');
          }
          break;

        case 'FORBIDDEN':
        case 'BAD_USER_INPUT':
        case 'GRAPHQL_VALIDATION_FAILED':
          break;
      }
    }
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const link = ApolloLink.from([
  errorLink,
  ApolloLink.split((operation) => operation.getContext().clientName === 'BFF', bffGql, bffGql)
]);

const isCheckoutPage = () => {
  const { pathname } = window?.location;
  return pathname?.indexOf('checkout') !== -1;
};

const guestLoggedInSessionValidation = (response, optionalInfo = null) => {
  const isPreviouslyLoggedin = response?.headers?.get('previously-loggedin');
  const isGuestSessionReset = response?.headers?.get('guest-session-resetcart');
  if (isPreviouslyLoggedin) {
    exitMessageThrow('loggedInUser');
  } else if (isGuestSessionReset && isCheckoutPage()) {
    exitMessageThrow('guestUser');
  } else if (optionalInfo === 'UNAUTHENTICATED') {
    exitMessageThrow('unAuthenticatedUser');
  }
};

const validateEncodedSession = (response) => {
  const encodedSessionData = response?.headers?.get(sessionResponseHeader);
  if (!!encodedSessionData) {
    window?.localStorage?.setItem(sessionResponseHeader, encodedSessionData);
  }
};

const afterwareLink = new ApolloLink((operation, forward) => {
  if (typeof window !== 'undefined') {
    const encodedSessionData = localStorage.getItem(sessionResponseHeader);
    if (encodedSessionData) {
      operation.setContext({
        headers: {
          [sessionResponseHeader]: encodedSessionData
        }
      });
    }
  }

  return forward(operation).map((response) => {
    const context = operation.getContext();
    if (typeof window !== 'undefined') {
      guestLoggedInSessionValidation(context.response);
      validateEncodedSession(context.response);
    }
    return response;
  });
});

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([afterwareLink.concat(link)]),
  credentials
});

const gqlGenericProps: any = (clientName, headerParams, otherProps) => ({
  fetchPolicy: 'no-cache',
  errorPolicy: 'all',
  context: {
    clientName,
    headers: {
      ...getClientSideCookies(),
      ...headerParams
    }
  },
  ...otherProps
});

/*Graphql Context where the GQL will be hit*/
const fetchDataViaGql = async (
  formedGqlQuery,
  clientName = 'BFF',
  otherProps = {},
  headerParams = {}
) => {
  try {
    return await client.query({
      query: gql`
        ${formedGqlQuery}
      `,
      ...gqlGenericProps(clientName, headerParams, otherProps)
    });
  } catch (err) {
    return null;
  }
};

const modifyDataViaGql = async (
  formedGqlMutation,
  variables = {},
  headerParams = {},
  clientName = 'BFF',
  otherProps = {}
) => {
  try {
    return await client.mutate({
      mutation: gql`
        ${formedGqlMutation}
      `,
      variables,
      ...gqlGenericProps(clientName, headerParams, otherProps)
    });
  } catch (err) {
    return null;
  }
};

/*TODO: Fix all GQL calls to use this method here and cleanup other ones*/
const fetchGqlData = async (
  formedGqlQuery,
  variables = {},
  clientName = 'BFF',
  headerParams = {},
  otherProps = {}
) => {
  try {
    const { data, loading, error } = await client.query({
      query: gql`
        ${formedGqlQuery}
      `,
      variables,
      ...gqlGenericProps(clientName, headerParams, otherProps)
    });
    return data;
  } catch (err) {
    return null;
  }
};

export default client;
export { fetchDataViaGql, modifyDataViaGql, fetchGqlData };
