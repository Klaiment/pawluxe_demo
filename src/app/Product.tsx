import * as React from "react";
import { useParams } from "react-router-dom";
import { getProductDetails } from "@/services/productService.ts";
import {useEffect} from "react";

export const Product: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = React.useState<any>(null);
  if (!slug) {
    return <div>Error: Product slug is missing.</div>;
  }
  useEffect(() => {
    const fetchProductDetails = async () => {
      const productDetails = await getProductDetails(slug);
      // @ts-ignore
      setProduct(productDetails)
      console.log("Product Details:", productDetails);
    };
    fetchProductDetails();
  }, [slug]);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Product Page</h1>
      <p className="text-lg">This is the product page for {slug}.</p>
    </div>
  );
};
