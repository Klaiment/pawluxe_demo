"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import type { CartItem, Product } from "@/lib/types";
import { fetchAllProductsFromApi } from "@/services/productService";
import { LoadingSpinner } from "@/components/cart/loading-spinner";
import { EmptyCart } from "@/components/cart/empty-cart";
import { ShippingProgress } from "@/components/cart/shipping-progress.tsx";
import { CartItemsList } from "@/components/cart/cart-items-list";
import { CartSummary } from "@/components/cart/cart-summary";
import { UpsellSection } from "@/components/cart/upsell-section.tsx";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export const Cart = () => {
  const {
    cart,
    order,
    updateCartItemQuantity,
    removeFromCart,
    addToCart,
    isLoading,
    refreshOrder,
  } = useCart();
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isProductsLoaded, setIsProductsLoaded] = useState(false);

  const loadProducts = () => {
    fetchAllProductsFromApi()
      .then((products) => {
        const items = (products as { products: { items: Product[] } }).products
          .items;
        setAllProducts(items);
        setIsProductsLoaded(true);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des produits :", error);
        setIsProductsLoaded(true);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const cartProductIds = cart.map((item) => item.productVariant.product.id);
  const upsellProducts = allProducts
    .filter((product) => !cartProductIds.includes(product.id))
    .filter((product, key) => product.variantList.items[key]?.priceWithTax > 30)
    .slice(0, 4);

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    console.log("🔄 Cart.tsx - handleQuantityChange:", {
      itemId: item.id,
      currentQuantity: item.quantity,
      newQuantity,
    });

    if (newQuantity >= 1) {
      updateCartItemQuantity(item.id, newQuantity);
    } else if (newQuantity === 0) {
      handleRemoveItem(item.id);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    console.log("🗑️ Cart.tsx - handleRemoveItem:", { itemId });

    setRemovingItems((prev) => new Set(prev).add(itemId));
    setTimeout(() => {
      removeFromCart(itemId);
      setRemovingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }, 300);
  };

  const handleAddUpsellProduct = async (product: Product) => {
    await addToCart(product.variantList.items[0].id, 1);
  };

  const handleCheckout = () => {
    window.location.href = "/checkout";
  };

  const handleRefreshOrder = async () => {
    console.log("🔄 Manual refresh order triggered");
    await refreshOrder();
  };

  if (!isProductsLoaded || isLoading) {
    return <LoadingSpinner />;
  }

  if (cart.length === 0) {
    return <EmptyCart products={allProducts} />;
  }

  return (
    <main className="container mx-auto py-12 px-4 md:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Votre Panier</h1>
          <p className="text-muted-foreground">
            {cart.length} article{cart.length > 1 ? "s" : ""} dans votre panier
            {order && (
              <span className="ml-2 text-xs text-amber-600">
                (Commande #{order.code})
              </span>
            )}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshOrder}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Actualiser
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ShippingProgress />
          <CartItemsList
            items={cart}
            removingItems={removingItems}
            onQuantityChange={handleQuantityChange}
          />
          <UpsellSection
            products={upsellProducts}
            onAddProduct={handleAddUpsellProduct}
          />
        </div>

        <div className="lg:col-span-1">
          <CartSummary onCheckout={handleCheckout} />
        </div>
      </div>
    </main>
  );
};
