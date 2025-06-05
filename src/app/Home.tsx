import { HeroSection } from "@/components/home/hero-section.tsx";
import { ProductSectionHomePage } from "@/components/home/product-section.tsx";

export const Home = () => {
  return (
    <>
      <main className="flex min-h-screen flex-col overflow-hidden">
        <HeroSection />
        <ProductSectionHomePage />
      </main>
    </>
  );
};
