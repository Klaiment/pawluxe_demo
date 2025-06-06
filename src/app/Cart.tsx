import { useEffect, useState } from "react";
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  Minus,
  Plus,
  Gift,
  Truck,
  Sparkles,
  Star,
} from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { CartItem, Product } from "@/lib/types";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/cart/product-card";
import { Link } from "react-router";
import { formatCurrency } from "@/lib/format-currency.ts";
import { fetchAllProductsFromApi } from "@/services/productService.ts";

export const Cart = () => {
  const { cart, updateCartItemQuantity, removeFromCart, addToCart } = useCart();
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());

  const subtotal = cart.reduce(
    (total, item) =>
      total + item.variantList.items[0].priceWithTax * item.quantity,
    0,
  );
  const freeShippingThreshold = 50;
  const remainingForFreeShipping = Math.max(
    0,
    freeShippingThreshold - subtotal,
  );
  const progressPercentage = Math.min(
    100,
    (subtotal / freeShippingThreshold) * 100,
  );
  const shipping = subtotal >= freeShippingThreshold ? 0 : 4.99;
  const total = subtotal + shipping;

 const [allProducts, setAllProducts] = useState<Product[]>([]);
 useEffect(() => {
   const fetchAllProducts = async () => {
     try {
       const products = await fetchAllProductsFromApi();
       const items = (products.products as { items: Product[] }).items;
       setAllProducts(items);
     } catch (error) {
       console.error("Erreur lors de la récupération des produits :", error);
     }
   };

   fetchAllProducts().then(() => {
     console.log("Produits récupérés avec succès.");
   });
 }, []);

  const getFeaturedProducts = (products: Product[]) => {
    return products.filter((product) =>
      product.facetValues.some((facet) => facet.name === "top"),
    );
  };

  const cartProductIds = cart.map((item) => item.id);
  const upsellProducts = allProducts
    .filter((product) => !cartProductIds.includes(product.id))
    .filter((product, key) => product.variantList.items[key].priceWithTax > 30) // Premium products
    .slice(0, 4);

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    if (
      newQuantity >= 1 &&
      newQuantity <= item.variantList.items[0].actualStockLevel
    ) {
      updateCartItemQuantity(item.id, newQuantity);
    } else if (newQuantity === 0) {
      handleRemoveItem(item.id);
    }
  };

  const handleRemoveItem = (itemId: string) => {
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

  const handleAddUpsellProduct = (product: Product) => {
    addToCart({ ...product, quantity: 1 });
  };

  const handleCheckout = () => {
    window.location.href = "/checkout";
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="container mx-auto py-16 px-4 md:px-6">
          {/* Empty Cart Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <div className="relative mb-8">
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center border-4 border-white shadow-xl">
                <ShoppingBag className="h-16 w-16 text-amber-600" />
              </div>
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-3 animate-bounce">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 font-playfair">
              Votre panier est vide
            </h1>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Découvrez notre collection exclusive d'articles de luxe pour vos
              compagnons bien-aimés. Chaque produit est soigneusement
              sélectionné pour offrir le meilleur à votre animal.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                asChild
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105"
                size="lg"
              >
                <Link to="/products">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Découvrir nos produits
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-amber-200 text-amber-700 hover:bg-amber-50"
              >
                <Link to="/">Retour à l'accueil</Link>
              </Button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: "🚚",
                  title: "Livraison gratuite",
                  description: "À partir de 50€ d'achat",
                  color: "from-blue-500 to-blue-600",
                },
                {
                  icon: "🛡️",
                  title: "Garantie 2 ans",
                  description: "Sur tous nos produits",
                  color: "from-green-500 to-green-600",
                },
                {
                  icon: "💎",
                  title: "Qualité premium",
                  description: "Matériaux nobles",
                  color: "from-purple-500 to-purple-600",
                },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${benefit.color} rounded-full flex items-center justify-center text-2xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}
                  >
                    {benefit.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Featured Products Suggestions */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <Badge
                className="mb-4 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200 px-3 py-1"
                variant="outline"
              >
                <Star className="mr-2 h-4 w-4 fill-amber-500 text-amber-500" />
                Nos Coups de Cœur
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 font-playfair">
                Commencez par ces produits populaires
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Découvrez les produits les plus appréciés par nos clients pour
                leurs compagnons
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {getFeaturedProducts(allProducts)
                .slice(0, 4)
                .map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  >
                    <Link
                      to={`/products/${product.id}`}
                      className="group block h-full"
                    >
                      {/*<ProductCard product={product} showAddToCart={true} />*/}
                    </Link>
                  </motion.div>
                ))}
            </div>
          </motion.section>

          {/* Categories */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 font-playfair">
                Explorez par catégorie
              </h2>
              <p className="text-muted-foreground">
                Trouvez exactement ce que vous cherchez
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  name: "Colliers",
                  icon: "🦮",
                  count: "15 produits",
                  color: "from-red-400 to-pink-500",
                },
                {
                  name: "Couchage",
                  icon: "🛏️",
                  count: "8 produits",
                  color: "from-blue-400 to-blue-500",
                },
                {
                  name: "Alimentation",
                  icon: "🍽️",
                  count: "12 produits",
                  color: "from-green-400 to-green-500",
                },
                {
                  name: "Jouets",
                  icon: "🎾",
                  count: "10 produits",
                  color: "from-yellow-400 to-orange-500",
                },
              ].map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                >
                  <Link
                    to={`/products?category=${encodeURIComponent(category.name)}`}
                    className="group block"
                  >
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-amber-100 shadow-sm hover:shadow-lg transition-all duration-300 text-center group-hover:scale-105">
                      <div
                        className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center text-3xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}
                      >
                        {category.icon}
                      </div>
                      <h3 className="font-semibold mb-1 group-hover:text-amber-700 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {category.count}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Newsletter CTA */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 md:p-12 text-center text-white shadow-xl"
          >
            <div className="max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Gift className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 font-playfair">
                Offre de bienvenue
              </h2>
              <p className="text-white/90 mb-6 text-lg">
                Inscrivez-vous à notre newsletter et recevez 10% de réduction
                sur votre première commande
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <Button className="bg-white text-amber-800 hover:bg-white/90 px-6 py-3 font-medium">
                  S'inscrire
                </Button>
              </div>
              <p className="text-white/70 text-sm mt-4">
                Pas de spam, uniquement nos meilleures offres et nouveautés
              </p>
            </div>
          </motion.section>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto py-12 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Votre Panier</h1>
        <p className="text-muted-foreground">
          {cart.length} article{cart.length > 1 ? "s" : ""} dans votre panier
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Free Shipping Progress */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-amber-600" />
                <span className="font-medium">Livraison gratuite</span>
              </div>
              {subtotal >= freeShippingThreshold ? (
                <Badge className="bg-green-500 hover:bg-green-600">
                  <Gift className="h-3 w-3 mr-1" />
                  Obtenue !
                </Badge>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Plus que {remainingForFreeShipping.toFixed(2)} €
                </span>
              )}
            </div>

            <Progress value={progressPercentage} className="h-3 mb-2" />

            {subtotal >= freeShippingThreshold ? (
              <p className="text-sm text-green-600 font-medium">
                🎉 Félicitations ! Vous bénéficiez de la livraison gratuite
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Ajoutez {remainingForFreeShipping.toFixed(2)} € pour bénéficier
                de la livraison gratuite
              </p>
            )}
          </div>

          {/* Cart Items */}
          <div className="bg-white rounded-lg border border-amber-100 overflow-hidden">
            <div className="p-6">
              <div className="hidden md:grid grid-cols-12 gap-4 mb-4 text-sm font-medium text-muted-foreground">
                <div className="col-span-6">Produit</div>
                <div className="col-span-2 text-center">Prix</div>
                <div className="col-span-2 text-center">Quantité</div>
                <div className="col-span-2 text-center">Total</div>
              </div>

              <Separator className="mb-6" />

              {cart.map((item, index) => (
                <div
                  key={item.id}
                  className={`mb-6 transition-all duration-300 ${
                    removingItems.has(item.id) ? "opacity-50 scale-95" : ""
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="col-span-1 md:col-span-2">
                      <div className="aspect-square overflow-hidden rounded-md border border-amber-100 relative group">
                        <img
                          src={item.featuredAsset.preview || "/placeholder.svg"}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-4">
                      <h3 className="font-medium hover:text-amber-700 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.facetValues.map(
                          (facetValue, index) =>
                            facetValue.name &&
                            facetValue.name !== "top" &&
                            !facetValue.name.startsWith("carac_") && (
                              <span key={index}>{facetValue.name}</span>
                            ),
                        )}
                      </p>
                      {item.variantList.items[0].actualStockLevel < 5 && (
                        <Badge
                          variant="outline"
                          className="mt-2 border-orange-200 text-orange-700"
                        >
                          Plus que {item.variantList.items[0].actualStockLevel}{" "}
                          en stock
                        </Badge>
                      )}
                    </div>

                    <div className="col-span-1 md:col-span-2 text-left md:text-center">
                      <div className="md:hidden text-sm text-muted-foreground mb-1">
                        Prix
                      </div>
                      <span className="font-medium">
                        {formatCurrency(
                          item.variantList.items[0].priceWithTax,
                          "€",
                        )}
                      </span>
                    </div>

                    <div className="col-span-1 md:col-span-2 text-left md:text-center">
                      <div className="md:hidden text-sm text-muted-foreground mb-1">
                        Quantité
                      </div>
                      <div className="flex items-center border rounded-md w-32 mx-auto bg-white">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none hover:bg-amber-50 group"
                          onClick={() =>
                            handleQuantityChange(item, item.quantity - 1)
                          }
                        >
                          {item.quantity === 1 ? (
                            <Trash2 className="h-3 w-3 text-red-500 group-hover:text-red-700" />
                          ) : (
                            <Minus className="h-3 w-3" />
                          )}
                        </Button>
                        <span className="flex-1 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none hover:bg-amber-50"
                          onClick={() =>
                            handleQuantityChange(item, item.quantity + 1)
                          }
                          disabled={
                            item.quantity >=
                            item.variantList.items[0].priceWithTax
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 text-left md:text-center">
                      <div className="md:hidden text-sm text-muted-foreground mb-1">
                        Total
                      </div>
                      <span className="font-semibold text-amber-800">
                        {formatCurrency(
                          item.variantList.items[0].priceWithTax *
                            item.quantity,
                          "€",
                        )}
                      </span>
                    </div>
                  </div>
                  {index !== cart.length - 1 && <Separator className="my-6" />}
                </div>
              ))}
            </div>
          </div>

          {/* Upsell Section */}
          {upsellProducts.length > 0 && (
            <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-lg p-6 border border-amber-200">
              <div className="flex items-center mb-4">
                <Sparkles className="h-5 w-5 text-amber-600 mr-2" />
                <h2 className="text-xl font-semibold">
                  Complétez votre commande
                </h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Nos clients qui ont acheté ces articles ont également choisi :
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {upsellProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg border border-amber-100 p-4 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={
                          product.featuredAsset.preview || "/placeholder.svg"
                        }
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-md border border-amber-100"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {product.facetValues.map(
                            (facetValue, index) =>
                              facetValue.name &&
                              facetValue.name !== "top" &&
                              !facetValue.name.startsWith("carac_") && (
                                <span key={index}>{facetValue.name}</span>
                              ),
                          )}
                        </p>
                        <p className="font-semibold text-amber-800 mt-1">
                          {formatCurrency(
                            product.variantList.items[0].priceWithTax,
                            "€",
                          )}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-amber-600 hover:bg-amber-700 text-xs px-3"
                        onClick={() => handleAddUpsellProduct(product)}
                      >
                        Ajouter
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-amber-100 p-6 sticky top-24 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5 text-amber-600" />
              Récapitulatif
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Sous-total ({cart.length} article{cart.length > 1 ? "s" : ""})
                </span>
                <span className="font-medium">{subtotal.toFixed(2)} €</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Livraison</span>
                <span
                  className={`font-medium ${shipping === 0 ? "text-green-600" : ""}`}
                >
                  {shipping === 0 ? (
                    <span className="flex items-center">
                      <Gift className="h-3 w-3 mr-1" />
                      Gratuite
                    </span>
                  ) : (
                    `${shipping.toFixed(2)} €`
                  )}
                </span>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-amber-800">
                  {formatCurrency(total, "€")}
                </span>
              </div>

              {subtotal >= freeShippingThreshold && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-700 font-medium flex items-center">
                    <Gift className="h-4 w-4 mr-2" />
                    Vous économisez 4,99 € sur la livraison !
                  </p>
                </div>
              )}
            </div>

            <Button
              className="w-full mt-6 bg-amber-700 hover:bg-amber-800 transition-all duration-300 hover:shadow-lg"
              size="lg"
              onClick={handleCheckout}
            >
              <div className="flex items-center">
                Passer commande
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </Button>

            <div className="mt-4 space-y-2">
              <div className="text-xs text-muted-foreground text-center">
                Livraison gratuite à partir de 50€ d'achat
              </div>
              <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                <span className="flex items-center">
                  <Truck className="h-3 w-3 mr-1" />
                  Livraison rapide
                </span>
                <span>•</span>
                <span>Paiement sécurisé</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
