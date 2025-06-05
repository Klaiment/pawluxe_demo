import { gql, request } from "graphql-request";

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
            }
          }
        }
      }
    }
  `;

  return await request("http://localhost:3000/shop-api", document);
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

  return request("http://localhost:3000/shop-api", document, { slug });
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

  return await request("http://localhost:3000/shop-api", document);
}
