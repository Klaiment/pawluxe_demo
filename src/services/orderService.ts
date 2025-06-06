import { gql, GraphQLClient } from "graphql-request";

const API_URL = "http://localhost:3000/shop-api";

// Créer un client GraphQL avec gestion des cookies
const client = new GraphQLClient(API_URL, {
  credentials: "include", // Important pour maintenir la session
  mode: "cors",
});

// Types pour les commandes
export interface OrderLine {
  id: string;
  productVariant: {
    id: string;
    name: string;
    price: number;
    priceWithTax: number;
    product: {
      id: string;
      name: string;
      slug: string;
      featuredAsset: {
        id: string;
        preview: string;
      };
    };
  };
  quantity: number;
  linePrice: number;
  linePriceWithTax: number;
}

export interface Order {
  id: string;
  code: string;
  state: string;
  total: number;
  totalWithTax: number;
  totalQuantity: number;
  subTotal: number;
  subTotalWithTax: number;
  shipping: number;
  shippingWithTax: number;
  lines: OrderLine[];
  shippingAddress?: {
    fullName: string;
    streetLine1: string;
    city: string;
    postalCode: string;
    country: string;
  };
  billingAddress?: {
    fullName: string;
    streetLine1: string;
    city: string;
    postalCode: string;
    country: string;
  };
  customer?: {
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
  };
}

// Fonction utilitaire pour récupérer la commande active (version simplifiée)
export async function getCurrentOrder(): Promise<Order | null> {
  try {
    return await getActiveOrder();
  } catch (error) {
    console.error("Error getting current order:", error);
    return null;
  }
}

// Récupérer la commande active
export async function getActiveOrder(): Promise<Order | null> {
  const document = gql`
    query GetActiveOrder {
      activeOrder {
        id
        code
        state
        total
        totalWithTax
        totalQuantity
        subTotal
        subTotalWithTax
        shipping
        shippingWithTax
        lines {
          id
          productVariant {
            id
            name
            price
            priceWithTax
            product {
              id
              name
              slug
              featuredAsset {
                id
                preview
              }
            }
          }
          quantity
          linePrice
          linePriceWithTax
        }
        shippingAddress {
          fullName
          streetLine1
          city
          postalCode
          country
        }
        billingAddress {
          fullName
          streetLine1
          city
          postalCode
          country
        }
        customer {
          firstName
          lastName
          emailAddress
          phoneNumber
        }
      }
    }
  `;

  try {
    console.log("🔍 Fetching active order...");
    const response = await client.request(document);
    console.log("📦 Active order response:", response.activeOrder);
    return response.activeOrder;
  } catch (error) {
    console.error("❌ Error fetching active order:", error);
    return null;
  }
}

// Ajouter un produit au panier
export async function addItemToOrder(
  productVariantId: string,
  quantity: number,
): Promise<Order> {
  const document = gql`
    mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!) {
      addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
        ... on Order {
          id
          code
          state
          total
          totalWithTax
          totalQuantity
          subTotal
          subTotalWithTax
          lines {
            id
            productVariant {
              id
              name
              price
              priceWithTax
              product {
                id
                name
                slug
                featuredAsset {
                  id
                  preview
                }
              }
            }
            quantity
            linePrice
            linePriceWithTax
          }
        }
        ... on ErrorResult {
          errorCode
          message
        }
      }
    }
  `;

  console.log("➕ Adding item to order:", { productVariantId, quantity });
  const response = await client.request(document, {
    productVariantId,
    quantity,
  });

  if (response.addItemToOrder.errorCode) {
    console.error("❌ Error in addItemToOrder:", response.addItemToOrder);
    throw new Error(response.addItemToOrder.message);
  }

  console.log("✅ Item added successfully:", response.addItemToOrder);
  return response.addItemToOrder;
}

// Ajuster la quantité d'une ligne de commande
export async function adjustOrderLine(
  orderLineId: string,
  quantity: number,
): Promise<Order> {
  const document = gql`
    mutation AdjustOrderLine($orderLineId: ID!, $quantity: Int!) {
      adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {
        ... on Order {
          id
          code
          state
          total
          totalWithTax
          totalQuantity
          subTotal
          subTotalWithTax
          lines {
            id
            productVariant {
              id
              name
              price
              priceWithTax
              product {
                id
                name
                slug
                featuredAsset {
                  id
                  preview
                }
              }
            }
            quantity
            linePrice
            linePriceWithTax
          }
        }
        ... on ErrorResult {
          errorCode
          message
        }
      }
    }
  `;

  console.log("🔄 Adjusting order line:", { orderLineId, quantity });
  const response = await client.request(document, {
    orderLineId,
    quantity,
  });

  if (response.adjustOrderLine.errorCode) {
    console.error("❌ Error in adjustOrderLine:", response.adjustOrderLine);
    throw new Error(response.adjustOrderLine.message);
  }

  console.log("✅ Order line adjusted successfully:", response.adjustOrderLine);
  return response.adjustOrderLine;
}

// Supprimer une ligne de commande
export async function removeOrderLine(orderLineId: string): Promise<Order> {
  const document = gql`
    mutation RemoveOrderLine($orderLineId: ID!) {
      removeOrderLine(orderLineId: $orderLineId) {
        ... on Order {
          id
          code
          state
          total
          totalWithTax
          totalQuantity
          subTotal
          subTotalWithTax
          lines {
            id
            productVariant {
              id
              name
              price
              priceWithTax
              product {
                id
                name
                slug
                featuredAsset {
                  id
                  preview
                }
              }
            }
            quantity
            linePrice
            linePriceWithTax
          }
        }
        ... on ErrorResult {
          errorCode
          message
        }
      }
    }
  `;

  console.log("🗑️ Removing order line:", { orderLineId });
  const response = await client.request(document, {
    orderLineId,
  });

  if (response.removeOrderLine.errorCode) {
    console.error("❌ Error in removeOrderLine:", response.removeOrderLine);
    throw new Error(response.removeOrderLine.message);
  }

  console.log("✅ Order line removed successfully:", response.removeOrderLine);
  return response.removeOrderLine;
}

// Définir l'adresse de livraison
export async function setOrderShippingAddress(input: {
  fullName: string;
  streetLine1: string;
  city: string;
  postalCode: string;
  countryCode: string;
  phoneNumber?: string;
}): Promise<Order> {
  const document = gql`
    mutation SetOrderShippingAddress($input: CreateAddressInput!) {
      setOrderShippingAddress(input: $input) {
        ... on Order {
          id
          shippingAddress {
            fullName
            streetLine1
            city
            postalCode
            country
            phoneNumber
          }
        }
        ... on ErrorResult {
          errorCode
          message
        }
      }
    }
  `;

  const response = await client.request(document, { input });

  if (response.setOrderShippingAddress.errorCode) {
    throw new Error(response.setOrderShippingAddress.message);
  }

  return response.setOrderShippingAddress;
}

// Définir l'adresse de facturation
export async function setOrderBillingAddress(input: {
  fullName: string;
  streetLine1: string;
  city: string;
  postalCode: string;
  countryCode: string;
  phoneNumber?: string;
}): Promise<Order> {
  const document = gql`
    mutation SetOrderBillingAddress($input: CreateAddressInput!) {
      setOrderBillingAddress(input: $input) {
        ... on Order {
          id
          billingAddress {
            fullName
            streetLine1
            city
            postalCode
            country
            phoneNumber
          }
        }
        ... on ErrorResult {
          errorCode
          message
        }
      }
    }
  `;

  const response = await client.request(document, { input });

  if (response.setOrderBillingAddress.errorCode) {
    throw new Error(response.setOrderBillingAddress.message);
  }

  return response.setOrderBillingAddress;
}

// Obtenir les méthodes de livraison disponibles
export async function getShippingMethods() {
  const document = gql`
    query GetShippingMethods {
      eligibleShippingMethods {
        id
        name
        description
        price
        priceWithTax
      }
    }
  `;

  const response = await client.request(document);
  return response.eligibleShippingMethods;
}

// Définir la méthode de livraison
export async function setOrderShippingMethod(
  shippingMethodId: string,
): Promise<Order> {
  const document = gql`
    mutation SetOrderShippingMethod($shippingMethodId: ID!) {
      setOrderShippingMethod(shippingMethodId: $shippingMethodId) {
        ... on Order {
          id
          shipping
          shippingWithTax
          total
          totalWithTax
        }
        ... on ErrorResult {
          errorCode
          message
        }
      }
    }
  `;

  const response = await client.request(document, { shippingMethodId });

  if (response.setOrderShippingMethod.errorCode) {
    throw new Error(response.setOrderShippingMethod.message);
  }

  return response.setOrderShippingMethod;
}

// Obtenir les méthodes de paiement disponibles
export async function getPaymentMethods() {
  const document = gql`
    query GetPaymentMethods {
      eligiblePaymentMethods {
        id
        name
        description
        isEligible
      }
    }
  `;

  const response = await client.request(document);
  return response.eligiblePaymentMethods;
}

// Transition vers l'état ArrangingPayment
export async function transitionOrderToState(state: string): Promise<Order> {
  const document = gql`
    mutation TransitionOrderToState($state: String!) {
      transitionOrderToState(state: $state) {
        ... on Order {
          id
          state
        }
        ... on OrderStateTransitionError {
          errorCode
          message
          transitionError
          fromState
          toState
        }
      }
    }
  `;

  const response = await client.request(document, { state });

  if (response.transitionOrderToState.errorCode) {
    throw new Error(response.transitionOrderToState.message);
  }

  return response.transitionOrderToState;
}

// Ajouter un paiement à la commande
export async function addPaymentToOrder(input: {
  method: string;
  metadata: any;
}): Promise<Order> {
  const document = gql`
    mutation AddPaymentToOrder($input: PaymentInput!) {
      addPaymentToOrder(input: $input) {
        ... on Order {
          id
          state
          payments {
            id
            method
            amount
            state
          }
        }
        ... on ErrorResult {
          errorCode
          message
        }
      }
    }
  `;

  const response = await client.request(document, { input });

  if (response.addPaymentToOrder.errorCode) {
    throw new Error(response.addPaymentToOrder.message);
  }

  return response.addPaymentToOrder;
}

// Définir les informations client
export async function setCustomerForOrder(input: {
  emailAddress: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}): Promise<Order> {
  const document = gql`
    mutation SetCustomerForOrder($input: CreateCustomerInput!) {
      setCustomerForOrder(input: $input) {
        ... on Order {
          id
          customer {
            firstName
            lastName
            emailAddress
            phoneNumber
          }
        }
        ... on ErrorResult {
          errorCode
          message
        }
      }
    }
  `;

  const response = await client.request(document, { input });

  if (response.setCustomerForOrder.errorCode) {
    throw new Error(response.setCustomerForOrder.message);
  }

  return response.setCustomerForOrder;
}
