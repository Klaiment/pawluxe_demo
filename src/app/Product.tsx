import * as React from "react";
import { useParams } from "react-router-dom";
import { getProductDetails } from "@/services/productService.ts";
import { useEffect } from "react";
import type { Product as ProductType } from "@/lib/types.ts";
import { Breadcrumb } from "@/components/layout/breadcrumb.tsx";
import { ProductSection } from "@/components/product/product-section.tsx";

export const Product: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = React.useState<ProductType | null>(null);
  if (!slug) {
    return <div>Error: Product slug is missing.</div>;
  }
  useEffect(() => {
    const fetchProductDetails = async () => {
      const productDetails = await getProductDetails(slug);
      setProduct((productDetails as { product: ProductType }).product);
      console.log("Product Details:", productDetails);
    };
    fetchProductDetails();
  }, [slug]);
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <Breadcrumb productName={product?.name} />

      <div className="container mx-auto px-4 md:px-6 py-8">
        {product && <ProductSection productDetails={product} />}
      </div>
    </main>
  );
};
