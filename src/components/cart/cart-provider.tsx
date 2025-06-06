"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { CartItem, VendureOrder } from "@/lib/types";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format-currency";
import {
  getActiveOrder,
  addItemToOrder,
  adjustOrderLine,
  removeOrderLine,
} from "@/services/orderService";

interface CartContextType {
  order: VendureOrder | null;
  cart: CartItem[];
  addToCart: (productVariantId: string, quantity: number) => Promise<void>;
  removeFromCart: (orderLineId: string) => Promise<void>;
  updateCartItemQuantity: (
    orderLineId: string,
    quantity: number,
  ) => Promise<void>;
  clearCart: () => void;
  refreshOrder: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType>({
  order: null,
  cart: [],
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateCartItemQuantity: async () => {},
  clearCart: () => {},
  refreshOrder: async () => {},
  isLoading: false,
});

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }: { children: ReactNode }) {
  const [order, setOrder] = useState<VendureOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Récupérer la commande active au chargement
  const refreshOrder = async () => {
    try {
      setIsLoading(true);
      const activeOrder = await getActiveOrder();
      setOrder(activeOrder);
    } catch (error) {
      console.error("Error fetching active order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshOrder();
  }, []);

  // Calculer le panier à partir de la commande
  const cart = order?.lines || [];

  const addToCart = async (productVariantId: string, quantity: number) => {
    try {
      setIsLoading(true);
      const updatedOrder = await addItemToOrder(productVariantId, quantity);
      setOrder(updatedOrder);

      // Trouver le produit ajouté pour le toast
      const addedLine = updatedOrder.lines.find(
        (line) => line.productVariant.id === productVariantId,
      );

      if (addedLine) {
        toast.success("Ajouté au panier !", {
          description: (
            <div className="flex items-center gap-3 mt-2">
              <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                <img
                  src={
                    addedLine.productVariant.product.featuredAsset.preview ||
                    "/placeholder.svg"
                  }
                  alt={addedLine.productVariant.product.name}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {addedLine.productVariant.product.name}
                </p>
                <p className="text-sm text-gray-500">
                  Quantité: {addedLine.quantity} •{" "}
                  {formatCurrency(addedLine.linePriceWithTax, "€")}
                </p>
              </div>
            </div>
          ),
          duration: 5000,
          className: "bg-green-50 border-green-200",
          style: {
            backgroundColor: "#f0fdf4",
            borderColor: "#bbf7d0",
            color: "#166534",
          },
        });
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("Erreur lors de l'ajout au panier", {
        description: "Veuillez réessayer",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (orderLineId: string) => {
    try {
      setIsLoading(true);

      // Trouver l'item avant suppression pour le toast
      const itemToRemove = cart.find((item) => item.id === orderLineId);

      const updatedOrder = await removeOrderLine(orderLineId);
      setOrder(updatedOrder);

      if (itemToRemove) {
        toast.error("Produit retiré", {
          description: (
            <div className="flex items-center gap-3 mt-2">
              <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center opacity-60">
                <img
                  src={
                    itemToRemove.productVariant.product.featuredAsset.preview ||
                    "/placeholder.svg"
                  }
                  alt={itemToRemove.productVariant.product.name}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {itemToRemove.productVariant.product.name}
                </p>
                <p className="text-sm text-gray-500">Retiré du panier</p>
              </div>
            </div>
          ),
          duration: 4000,
          className: "bg-red-50 border-red-200",
          style: {
            backgroundColor: "#fef2f2",
            borderColor: "#fecaca",
            color: "#dc2626",
          },
        });
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("Erreur lors de la suppression", {
        description: "Veuillez réessayer",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItemQuantity = async (
    orderLineId: string,
    quantity: number,
  ) => {
    if (quantity === 0) {
      await removeFromCart(orderLineId);
      return;
    }

    try {
      setIsLoading(true);

      const item = cart.find((item) => item.id === orderLineId);
      const updatedOrder = await adjustOrderLine(orderLineId, quantity);
      setOrder(updatedOrder);

      if (item) {
        toast.success("Quantité modifiée", {
          description: (
            <div className="flex items-center gap-3 mt-2">
              <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                <img
                  src={
                    item.productVariant.product.featuredAsset.preview ||
                    "/placeholder.svg"
                  }
                  alt={item.productVariant.product.name}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {item.productVariant.product.name}
                </p>
                <p className="text-sm text-gray-500">
                  Nouvelle quantité: {quantity} •{" "}
                  {formatCurrency(
                    item.productVariant.priceWithTax * quantity,
                    "€",
                  )}
                </p>
              </div>
            </div>
          ),
          duration: 4000,
          className: "bg-blue-50 border-blue-200",
          style: {
            backgroundColor: "#eff6ff",
            borderColor: "#93c5fd",
            color: "#1d4ed8",
          },
        });
      }
    } catch (error) {
      console.error("Error updating item quantity:", error);
      toast.error("Erreur lors de la modification", {
        description: "Veuillez réessayer",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = () => {
    setOrder(null);
    toast.info("Panier vidé", {
      description: "Votre commande a été finalisée",
      duration: 3000,
      className: "bg-gray-50 border-gray-200",
      style: {
        backgroundColor: "#f9fafb",
        borderColor: "#d1d5db",
        color: "#374151",
      },
    });
  };

  return (
    <CartContext.Provider
      value={{
        order,
        cart,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        refreshOrder,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
