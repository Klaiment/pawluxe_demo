import { gql, GraphQLClient } from "graphql-request";

// Utiliser le même client pour maintenir la session
const client = new GraphQLClient("http://localhost:3000/shop-api", {
  credentials: "include",
  mode: "cors",
});

export async function fetchAllProductsFromApi() {
  const document = gql`
    {
      products {
        totalItems
        items {
          id
          name
          slug
          customFields {
            popularityScore
          }
          facetValues {
            id
            name
          }
          description
          featuredAsset {
            id
            preview
          }
          assets {
            id
            name
            preview
          }
          variantList {
            items {
              id
              name
              priceWithTax
              productId
              price
              stockLevel
              actualStockLevel
            }
          }
        }
      }
    }
  `;

  return await client.request(document);
}

export function getProductDetails(slug: string) {
  const document = gql`
    query Product($slug: String!) {
      product(slug: $slug) {
        id
        name
        slug
        customFields {
          popularityScore
        }
        description
        facetValues {
          id
          name
        }
        featuredAsset {
          id
          preview
        }
        assets {
          id
          name
          preview
        }
        variantList {
          items {
            id
            name
            priceWithTax
            productId
            price
            stockLevel
            actualStockLevel
          }
        }
      }
    }
  `;

  return client.request(document, { slug });
}

export async function fetchTopProductsFromApi() {
  const document = gql`
    {
      products {
        totalItems
        items {
          id
          name
          slug
          customFields {
            popularityScore
          }
          facetValues(filter: { name: { eq: "top" } }) {
            id
            name
          }
          description
          featuredAsset {
            id
            preview
          }
          assets {
            id
            name
            preview
          }
          variantList {
            items {
              id
              name
              priceWithTax
              productId
              price
              stockLevel
            }
          }
        }
      }
    }
  `;

  return await client.request(document);
}
