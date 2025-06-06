"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Shield,
  ShoppingBag,
  Star,
  Truck,
  Users,
  Zap,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/format-currency.ts";
import { useCart } from "@/components/cart/cart-provider.tsx";

export const ProductSection = ({
  productDetails,
}: {
  productDetails: Product;
}) => {
  const { addToCart, isLoading } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const viewCount = (Math.random() * 1000 + 1000).toFixed(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (
      productDetails &&
      quantity < productDetails.variantList.items[0].actualStockLevel
    ) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      // Ajouter chaque unité individuellement pour respecter la quantité
      for (let i = 0; i < quantity; i++) {
        await addToCart(productDetails.variantList.items[0].id, 1);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
      {/* Images */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-4"
      >
        {/* Main Image */}
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl border border-amber-100">
          <div className="aspect-square relative">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={
                  productDetails?.assets[currentImageIndex]?.preview ||
                  "/placeholder.svg"
                }
                alt={productDetails.slug}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              />
            </AnimatePresence>

            {/* Navigation Arrows */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm border-amber-200 shadow-lg hover:bg-white"
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev === 0 ? productDetails.assets.length - 1 : prev - 1,
                )
              }
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm border-amber-200 shadow-lg hover:bg-white"
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev === productDetails.assets.length - 1 ? 0 : prev + 1,
                )
              }
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            {/* Badges */}
            <div className="absolute top-4 left-4 space-y-2">
              {productDetails.facetValues[0]?.name == "top" && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg">
                  ⭐ Coup de cœur
                </Badge>
              )}
              {productDetails.variantList.items[0].stockLevel ==
                "LOW_STOCK" && (
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg">
                  Stock limité
                </Badge>
              )}
            </div>

            {/* Live indicators */}
            <div className="absolute bottom-4 left-4 flex items-center space-x-2">
              <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1 shadow-lg">
                <Eye className="h-3 w-3 text-amber-600" />
                <span className="text-xs font-medium">{viewCount} vues</span>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1 shadow-lg">
                <Zap className="h-3 w-3 text-green-600" />
                <span className="text-xs font-medium">Populaire</span>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Images */}
        <div className="grid grid-cols-4 gap-3">
          {productDetails.assets?.map(
            (image: { preview: string }, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  currentImageIndex === index
                    ? "border-amber-500 shadow-lg scale-105"
                    : "border-amber-200 hover:border-amber-400"
                }`}
              >
                <img
                  src={image.preview || "/placeholder.svg"}
                  alt={`Vue ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ),
          )}
        </div>
      </motion.div>

      {/* Product Info */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-col space-y-6"
      >
        <div>
          {productDetails.facetValues
            .filter(
              (facet) => !facet.name.includes("carac_") && facet.name !== "top",
            )
            .map((facet) => (
              <Badge
                key={facet.id}
                variant="outline"
                className="mb-4 border-amber-200 text-amber-700 bg-amber-50"
              >
                {facet.name}
              </Badge>
            ))}

          {/* Rating and social proof */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center mr-2">
                {renderStars(
                  Math.round(productDetails.customFields.popularityScore),
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {productDetails.customFields.popularityScore.toFixed(1)} (x
                avis)
              </span>
              <Badge
                variant="outline"
                className="border-green-200 text-green-700 bg-green-50"
              >
                <Users className="h-3 w-3 mr-1" />
                {Math.floor(Math.random() * 50) + 20} achetés cette semaine
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`${isWishlisted ? "border-red-500 text-red-500 bg-red-50" : "border-amber-200 text-amber-700 hover:bg-amber-50"}`}
              >
                <Heart
                  className={`h-4 w-4 ${isWishlisted ? "fill-red-500" : ""}`}
                />
              </Button>
            </div>
          </div>

          <div className="flex items-baseline space-x-4 mb-6">
            <p className="text-3xl font-bold text-amber-800 font-playfair">
              {formatCurrency(
                productDetails.variantList.items[0].priceWithTax,
                "€",
              )}
            </p>
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <Truck className="h-3 w-3 mr-1" />
              Livraison gratuite
            </Badge>
          </div>

          {/* Description Preview */}
          <div className="mb-6">
            <p className="text-muted-foreground leading-relaxed">
              {showFullDescription ||
              productDetails.description.length <= 100 ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: productDetails.description,
                  }}
                />
              ) : (
                <>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: `${productDetails.description.substring(0, 100)}...`,
                    }}
                  />
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-amber-700 hover:text-amber-800 ml-2 font-medium"
                  >
                    {showFullDescription ? "Voir moins" : "Voir plus"}
                  </button>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center p-4 bg-white rounded-xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-2">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xs font-medium text-center">
              Garantie 2 ans
            </span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-2">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <span className="text-xs font-medium text-center">
              Livraison 24-48h
            </span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-2">
              <RotateCcw className="h-5 w-5 text-white" />
            </div>
            <span className="text-xs font-medium text-center">
              Retour 30 jours
            </span>
          </div>
        </div>

        {/* Quantity and Add to Cart */}
        <div className="space-y-6 bg-white p-6 rounded-xl border border-amber-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Quantité:</span>
              <div className="flex items-center border-2 border-amber-200 rounded-lg overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="h-10 w-10 rounded-none hover:bg-amber-50"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium bg-amber-50">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={increaseQuantity}
                  disabled={
                    quantity >=
                    productDetails.variantList.items[0].actualStockLevel
                  }
                  className="h-10 w-10 rounded-none hover:bg-amber-50"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center">
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${productDetails.variantList.items[0].actualStockLevel > 0 ? "bg-green-500" : "bg-red-500"}`}
                ></div>
                <span className="text-sm">
                  {productDetails.variantList.items[0].actualStockLevel > 0
                    ? `${productDetails.variantList.items[0].actualStockLevel} en stock`
                    : "Rupture de stock"}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                SKU: PL-{productDetails.id.padStart(4, "0")}
              </span>
            </div>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={
              isAdding ||
              isLoading ||
              productDetails.variantList.items[0].actualStockLevel === 0
            }
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-6 text-lg font-medium transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            {isAdding || isLoading ? (
              <div className="flex items-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 0.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                />
                Ajout en cours...
              </div>
            ) : (
              <div className="flex items-center">
                <ShoppingBag className="mr-3 h-5 w-5" />
                Ajouter au panier •{" "}
                {formatCurrency(
                  productDetails.variantList.items[0].priceWithTax * quantity,
                  "€",
                )}
              </div>
            )}
          </Button>

          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>Commandez avant 14h pour une expédition le jour même</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
    />
  ));
};
