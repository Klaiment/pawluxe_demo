import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card.tsx";
import { Link } from "react-router";

export function FeaturedProducts({ featuredProducts }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex(
      (prev) => (prev + 1) % Math.ceil(featuredProducts.length / 4),
    );
  };

  const prevSlide = () => {
    setActiveIndex((prev) =>
      prev === 0 ? Math.ceil(featuredProducts.length / 4) - 1 : prev - 1,
    );
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="relative">
      {/* Navigation Arrows */}
      <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={prevSlide}
          className="rounded-full w-10 h-10 bg-white/80 backdrop-blur-sm border border-amber-200 shadow-md hover:bg-amber-50"
        >
          <ChevronLeft className="h-5 w-5 text-amber-700" />
        </Button>
      </div>
      <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={nextSlide}
          className="rounded-full w-10 h-10 bg-white/80 backdrop-blur-sm border border-amber-200 shadow-md hover:bg-amber-50"
        >
          <ChevronRight className="h-5 w-5 text-amber-700" />
        </Button>
      </div>

      {/* Products */}
      <div className="overflow-hidden">
        <motion.div
          className="flex transition-all duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {Array.from({ length: Math.ceil(featuredProducts.length / 4) }).map(
            (_, pageIndex) => (
              <div key={pageIndex} className="min-w-full">
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {featuredProducts
                    .slice(pageIndex * 4, pageIndex * 4 + 4)
                    .map((product) => (
                      <motion.div key={product.id} variants={item}>
                        <Link
                          to={`/products/${product.slug}`}
                          className="group block h-full"
                        >
                          <ProductCard product={product} showAddToCart={true} />
                        </Link>
                      </motion.div>
                    ))}
                </motion.div>
              </div>
            ),
          )}
        </motion.div>
      </div>

      {/* Indicators */}
      <div className="flex justify-center space-x-2 mt-8">
        {Array.from({ length: Math.ceil(featuredProducts.length / 4) }).map(
          (_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeIndex === index ? "bg-amber-600 w-6" : "bg-amber-200"
              }`}
              aria-label={`Page ${index + 1}`}
            ></button>
          ),
        )}
      </div>
    </div>
  );
}
