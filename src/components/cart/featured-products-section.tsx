import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/product-card.tsx";

interface FeaturedProductsSectionProps {
  products: Product[];
}

export const FeaturedProductsSection = ({
  products,
}: FeaturedProductsSectionProps) => {
  const getFeaturedProducts = (products: Product[]) => {
    return products.filter((product) =>
      product.facetValues.some((facet) => facet.name === "top"),
    );
  };

  return (
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
          Découvrez les produits les plus appréciés par nos clients pour leurs
          compagnons
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {getFeaturedProducts(products)
          .slice(0, 4)
          .map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
            >
              <Link
                to={`/product/${product.slug}`}
                className="group block h-full"
              >
                <ProductCard product={product} showAddToCart={true} />
              </Link>
            </motion.div>
          ))}
      </div>
    </motion.section>
  );
};
