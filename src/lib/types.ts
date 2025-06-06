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

export interface CartItem extends Product {
  quantity: number;
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
