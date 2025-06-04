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

          facetValues {
            id
            name
          }
          description
          featuredAsset {
            id
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
  `;

  return request("http://localhost:3000/shop-api", document, { slug });
}
