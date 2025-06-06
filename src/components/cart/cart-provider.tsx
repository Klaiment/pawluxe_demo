"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/types";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format-currency";

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateCartItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateCartItemQuantity: () => {},
  clearCart: () => {},
});

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedCart = localStorage.getItem("pawluxe-cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("pawluxe-cart", JSON.stringify(cart));
    }
  }, [cart, isClient]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((i) => i.id === item.id);

      if (existingItemIndex !== -1) {
        const updatedCart = [...prevCart];
        const newQuantity =
          updatedCart[existingItemIndex].quantity + item.quantity;
        const finalQuantity = Math.min(
          newQuantity,
          item.variantList.items[0].actualStockLevel,
        );

        updatedCart[existingItemIndex].quantity = finalQuantity;

        toast.success("Quantité mise à jour !", {
          description: (
            <div className="flex items-center gap-3 mt-2">
              <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                <img
                  src={item.featuredAsset.preview || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">
                  Quantité: {finalQuantity} •{" "}
                  {formatCurrency(
                    item.variantList.items[0].priceWithTax * finalQuantity,
                    "€",
                  )}
                </p>
              </div>
            </div>
          ),
          duration: 5000,
          className: "bg-amber-50 border-amber-200",
          style: {
            backgroundColor: "#fef3c7",
            borderColor: "#fcd34d",
            color: "#92400e",
          },
        });

        return updatedCart;
      } else {
        toast.success("Ajouté au panier !", {
          description: (
            <div className="flex items-center gap-3 mt-2">
              <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                <img
                  src={item.featuredAsset.preview || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">
                  Quantité: {item.quantity} •{" "}
                  {formatCurrency(
                    item.variantList.items[0].priceWithTax * item.quantity,
                    "€",
                  )}
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

        return [...prevCart, item];
      }
    });
  };

  const removeFromCart = (id: string) => {
    const itemToRemove = cart.find((item) => item.id === id);

    setCart((prevCart) => prevCart.filter((item) => item.id !== id));

    if (itemToRemove) {
      toast.error("Produit retiré", {
        description: (
          <div className="flex items-center gap-3 mt-2">
            <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center opacity-60">
              <img
                src={itemToRemove.featuredAsset.preview || "/placeholder.svg"}
                alt={itemToRemove.name}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{itemToRemove.name}</p>
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
  };

  const updateCartItemQuantity = (id: string, quantity: number) => {
    const item = cart.find((item) => item.id === id);

    if (quantity === 0) {
      removeFromCart(id);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );

    if (item) {
      toast.success("Quantité modifiée", {
        description: (
          <div className="flex items-center gap-3 mt-2">
            <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
              <img
                src={item.featuredAsset.preview || "/placeholder.svg"}
                alt={item.name}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-500">
                Nouvelle quantité: {quantity} •{" "}
                {formatCurrency(
                  item.variantList.items[0].priceWithTax * quantity,
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
  };

  const clearCart = () => {
    const itemCount = cart.length;
    setCart([]);

    if (itemCount > 0) {
      toast.info("Panier vidé", {
        description: `${itemCount} produit${itemCount > 1 ? "s" : ""} retiré${itemCount > 1 ? "s" : ""} du panier`,
        duration: 3000,
        className: "bg-gray-50 border-gray-200",
        style: {
          backgroundColor: "#f9fafb",
          borderColor: "#d1d5db",
          color: "#374151",
        },
      });
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
