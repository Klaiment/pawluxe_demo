import * as React from "react";
import { useParams } from "react-router-dom";
import { getProductDetails } from "@/services/productService.ts";
import { useEffect } from "react";
import type { Product } from "@/lib/types.ts";
import { Breadcrumb } from "@/components/layout/breadcrumb.tsx";

export const Product: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = React.useState<Product | null>(null);
  if (!slug) {
    return <div>Error: Product slug is missing.</div>;
  }
  useEffect(() => {
    const fetchProductDetails = async () => {
      const productDetails = await getProductDetails(slug);
      setProduct(productDetails.product);
      console.log("Product Details:", productDetails);
    };
    fetchProductDetails();
  }, [slug]);
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <Breadcrumb productName={product?.name} />

      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Product Page</h1>
        <p className="text-lg">This is the product page for {slug}.</p>
      </div>
    </main>
  );
};
