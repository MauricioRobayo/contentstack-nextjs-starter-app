import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  gql,
} from "@apollo/client";
import * as Utils from "@contentstack/utils";

const config = {
  CONTENTSTACK_API_BASE_URL: process.env.CONTENTSTACK_API_BASE_URL ?? "",
  CONTENTSTACK_DELIVERY_TOKEN: process.env.CONTENTSTACK_DELIVERY_TOKEN ?? "",
  CONTENTSTACK_API_KEY: process.env.CONTENTSTACK_API_KEY ?? "",
  CONTENTSTACK_ENVIRONMENT: process.env.CONTENTSTACK_ENVIRONMENT ?? "",
};

const missingEnvVars = Object.entries(config).filter(([, value]) => !value);

if (typeof window === "undefined" && missingEnvVars.length > 0) {
  throw new Error(
    `Missing env vars: ${missingEnvVars.map(([key]) => key).join()}`
  );
}

const link = createHttpLink({
  uri: `${config.CONTENTSTACK_API_BASE_URL}/stacks/${config.CONTENTSTACK_API_KEY}?environment=${config.CONTENTSTACK_ENVIRONMENT}`,
  headers: {
    "content-type": "application/json",
    access_token: config.CONTENTSTACK_DELIVERY_TOKEN,
  },
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  ssrMode: true,
});

export async function getPageByUid(uid: string) {
  const { data } = await client.query({
    query: gql`
      query GetPageByUid($uid: String!) {
        page(uid: $uid) {
          page_components {
            ... on PagePageComponentsSectionWithHtmlCode {
              __typename
              section_with_html_code {
                title
              }
            }
          }
          system {
            locale
            uid
          }
        }
      }
    `,
    variables: { uid },
  });
  return data;
}

export default client;
