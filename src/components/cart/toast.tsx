import { toast } from "sonner";
import type { Product } from "@/lib/types.ts";
import { formatCurrency } from "@/lib/format-currency.ts";

export const successAddToBasket = ({
  productDetails,
  quantity,
}: {
  productDetails: Product;
  quantity: number;
}) => {
  return toast.success("Ajouté au panier !", {
    description: (
      <div className="flex items-center gap-3 mt-2">
        <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
          <img
            src={`${productDetails.featuredAsset.preview}`}
            alt={`${productDetails.name}`}
          />
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900">{productDetails.name}</p>
          <p className="text-sm text-gray-500">
            Quantité: {quantity} •{" "}
            {formatCurrency(
              quantity * productDetails.variantList.items[0].priceWithTax,
              "€",
            )}
          </p>
        </div>
      </div>
    ),
    duration: 5000,
    className: "bg-green-50 border-green-200",
    style: {
      backgroundColor: "#f0fdf4",
      borderColor: "#bbf7d0",
      color: "#166534",
    },
  });
};
