import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductDetails } from "@/services/productService";
import type { Product as ProductType } from "@/lib/types";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { ProductSection } from "@/components/product/product-section";

export const Product: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError("Erreur : slug du produit manquant.");
      return;
    }

    const fetchProductDetails = async () => {
      try {
        const productDetails = await getProductDetails(slug);
        // @ts-ignore
        if (!productDetails || !productDetails.product) {
          setError("Produit introuvable.");
        } else {
          // @ts-ignore
          setProduct(productDetails.product);
        }
      } catch (err) {
        console.error("Erreur lors du chargement du produit :", err);
        setError("Erreur lors du chargement du produit.");
      }
    };

    fetchProductDetails();
  }, [slug]);

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <Breadcrumb productName={product?.name} />
      <div className="container mx-auto px-4 md:px-6 py-8">
        {product ? (
          <ProductSection productDetails={product} />
        ) : (
          <div className="text-center text-sm text-gray-500">
            Chargement du produit...
          </div>
        )}
      </div>
    </main>
  );
};
