export interface Product {
  id: string;
  name: string;
  slug: string;
  customFields: {
    popularityScore: number;
  };
  facetValues: {
    id: string;
    name: string;
  }[];
  description: string;
  featuredAsset: {
    id: string;
    preview: string;
  };
  assets: {
    id: string;
    name: string;
    preview: string;
  }[];
  variantList: {
    items: {
      id: string;
      name: string;
      priceWithTax: number;
      productId: string;
      stockLevel: string;
      price: string;
      actualStockLevel: number;
    }[];
  };
}

// Nouveau type pour les articles du panier basé sur Vendure
export interface CartItem {
  id: string; // orderLineId
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

// Type pour la commande Vendure
export interface VendureOrder {
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
  lines: CartItem[];
  shippingAddress?: {
    fullName: string;
    streetLine1: string;
    city: string;
    postalCode: string;
    country: string;
    phoneNumber?: string;
  };
  billingAddress?: {
    fullName: string;
    streetLine1: string;
    city: string;
    postalCode: string;
    country: string;
    phoneNumber?: string;
  };
  customer?: {
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber?: string;
  };
}

export interface ProductResponse {
  totalItems: number;
  items: Product[];
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CheckoutData {
  customerInfo: CustomerInfo;
  billingAddress: Address;
  shippingAddress: Address;
  sameAsBilling: boolean;
  shippingMethod: string;
  paymentMethod: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  priceWithTax: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  isEligible: boolean;
}
