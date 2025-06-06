import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format-currency";
import type { Product } from "@/lib/types";

interface UpsellSectionProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
}

export const UpsellSection = ({
  products,
  onAddProduct,
}: UpsellSectionProps) => {
  if (products.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-lg p-6 border border-amber-200">
      <div className="flex items-center mb-4">
        <Sparkles className="h-5 w-5 text-amber-600 mr-2" />
        <h2 className="text-xl font-semibold">Complétez votre commande</h2>
      </div>
      <p className="text-muted-foreground mb-6">
        Nos clients qui ont acheté ces articles ont également choisi :
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg border border-amber-100 p-4 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              <img
                src={product.featuredAsset.preview || "/placeholder.svg"}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-md border border-amber-100"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{product.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {product.facetValues.map(
                    (facetValue, index) =>
                      facetValue.name &&
                      facetValue.name !== "top" &&
                      !facetValue.name.startsWith("carac_") && (
                        <span key={index}>{facetValue.name}</span>
                      ),
                  )}
                </p>
                <p className="font-semibold text-amber-800 mt-1">
                  {formatCurrency(
                    product.variantList.items[0].priceWithTax,
                    "€",
                  )}
                </p>
              </div>
              <Button
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-xs px-3"
                onClick={() => onAddProduct(product)}
              >
                Ajouter
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
