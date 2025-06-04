import { gql, request } from "graphql-request";

export async function fetchProducts() {
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
