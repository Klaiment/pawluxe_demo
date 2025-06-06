"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Heart, ShoppingBag, Eye } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

export function ProductCard({
  product,
  showAddToCart = false,
}: ProductCardProps) {
  const { addToCart, isLoading } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isHeartActive, setIsHeartActive] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAdding(true);
    try {
      // Utiliser l'ID de la première variante du produit
      await addToCart(product.variantList.items[0].id, 1);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHeartActive(!isHeartActive);
  };

  const renderStars = (rating = product.customFields.popularityScore) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-full"
    >
      <Card className="overflow-hidden h-full transition-all duration-500 group border-0 bg-white shadow-lg hover:shadow-xl rounded-xl">
        <div className="relative">
          <div className="aspect-square overflow-hidden relative">
            <motion.img
              src={product?.featuredAsset?.preview || "/placeholder.svg"}
              alt={product?.name || "Image du produit"}
              className="object-cover w-full h-full"
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.5 }}
            />
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Floating badges */}
            <div className="absolute top-3 left-3 space-y-2 space-x-2">
              {product.facetValues[0]?.name == "top" && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg">
                  ⭐ Coup de cœur
                </Badge>
              )}
              {product.variantList.items[0].stockLevel == "LOW_STOCK" && (
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg">
                  Stock limité
                </Badge>
              )}
            </div>

            {/* Floating action buttons */}
            <div
              className={`absolute top-3 right-3 space-y-2 transition-all duration-300 transform ${
                isHovered
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-2"
              }`}
            >
              <Button
                size="icon"
                variant="secondary"
                className={`h-8 w-8 rounded-full ${
                  isHeartActive
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-white/90 backdrop-blur-sm hover:bg-white"
                } shadow-lg border-0`}
                onClick={handleHeartClick}
              >
                <Heart
                  className={`h-4 w-4 ${isHeartActive ? "fill-white" : ""}`}
                />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg border-0"
              >
                <Eye className="h-4 w-4 text-gray-600" />
              </Button>
            </div>

            {/* Quick add to cart overlay */}
            {showAddToCart && (
              <div
                className={`absolute bottom-3 left-3 right-3 transition-all duration-300 transform ${
                  isHovered
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2"
                }`}
              >
                <Button
                  className={`w-full text-white shadow-lg border-0 transition-all duration-300 ${
                    isAdding || isLoading
                      ? "bg-green-500 hover:bg-green-600 scale-95"
                      : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                  }`}
                  size="sm"
                  onClick={handleAddToCart}
                  disabled={isAdding || isLoading}
                >
                  {isAdding || isLoading ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 0.5,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Ajout...
                    </motion.div>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Ajouter au panier
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        <CardContent className="pt-4 pb-2">
          <div className="space-y-2">
            {product.facetValues.map(
              (facetValue, index) =>
                facetValue.name &&
                facetValue.name !== "top" &&
                !facetValue.name.startsWith("carac_") && (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <Badge
                      variant="outline"
                      className="border-amber-200 text-amber-700 bg-amber-50 text-xs"
                    >
                      {facetValue.name}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      {renderStars()}
                    </div>
                  </div>
                ),
            )}

            <h3 className="font-semibold text-lg leading-tight font-playfair group-hover:text-amber-700 transition-colors duration-300">
              {product.name}
            </h3>

            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </p>
          </div>
        </CardContent>

        <CardFooter className="pt-0 pb-4">
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-amber-800 font-playfair">
                  {(product.variantList.items[0].priceWithTax / 100).toFixed(2)}{" "}
                  €
                </p>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
