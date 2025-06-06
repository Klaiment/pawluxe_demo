import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge.tsx";
import { ChevronRight, Star } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import {
  fetchAllProductsFromApi,
  fetchTopProductsFromApi,
} from "@/services/productService.ts";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { FeaturedProducts } from "./featured-products";
import type { Product } from "@/lib/types.ts";

export const ProductSectionHomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState(null);
  const [featuredRef, featuredInView] = useInView({ threshold: 0.1, triggerOnce: true })


  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      const products = await fetchAllProductsFromApi();
      // @ts-ignore
      const cleanedProducts = (products.products as { items: Product[] }).items;
      const topFacetValues = cleanedProducts.filter((product: Product) =>
          product.facetValues?.some((facet) => facet.name === "top")
      );
      setFeaturedProducts(topFacetValues);
      console.log("Featured Products:", topFacetValues);
    };
    fetchFeaturedProducts();
  }, []);

  return (
    <section
      id="featured"
      className="py-24 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-amber-200/30 blur-3xl"
          style={{ animationDuration: "15s" }}
        ></div>
        <div
          className="absolute -bottom-[10%] -left-[10%] w-[30%] h-[30%] rounded-full bg-orange-200/30 blur-3xl"
          style={{ animationDuration: "20s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          ref={featuredRef}
          animate={
            featuredInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
          }
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center mb-16"
        >
          <Badge
            className="mb-4 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200 px-3 py-1"
            variant="outline"
          >
            <Star className="mr-2 h-4 w-4 fill-amber-500 text-amber-500" />
            Sélection Premium
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 font-playfair">
            Produits de Luxe pour Vos Compagnons
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre collection exclusive d'articles haut de gamme pour
            chiens et chats, conçus pour offrir confort, style et qualité
            exceptionnelle.
          </p>
        </motion.div>

        <FeaturedProducts featuredProducts={featuredProducts} />

        <div className="flex justify-center mt-16">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105"
          >
            <Link to="/products" className="flex items-center">
              Explorer toute la collection
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
