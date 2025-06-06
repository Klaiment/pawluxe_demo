import { EmptyCartHero } from "./empty-cart-hero";
import { BenefitsSection } from "./benefits-section";
import { FeaturedProductsSection } from "./featured-products-section";
import { CategoriesSection } from "./categories-section";
import { NewsletterSection } from "./newsletter-section";
import type { Product } from "@/lib/types";

interface EmptyCartProps {
  products: Product[];
}

export const EmptyCart = ({ products }: EmptyCartProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto py-16 px-4 md:px-6">
        <EmptyCartHero />
        <BenefitsSection />
        <FeaturedProductsSection products={products} />
        <CategoriesSection />
        <NewsletterSection />
      </div>
    </div>
  );
};
