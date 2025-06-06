import { Trash2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format-currency";
import type { CartItem } from "@/lib/types";

interface CartItemProps {
  item: CartItem;
  isRemoving: boolean;
  onQuantityChange: (item: CartItem, newQuantity: number) => void;
}

export const CartItemComponent = ({
  item,
  isRemoving,
  onQuantityChange,
}: CartItemProps) => {
  return (
    <div
      className={`mb-6 transition-all duration-300 ${isRemoving ? "opacity-50 scale-95" : ""}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="col-span-1 md:col-span-2">
          <div className="aspect-square overflow-hidden rounded-md border border-amber-100 relative group">
            <img
              src={item.featuredAsset.preview || "/placeholder.svg"}
              alt={item.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        <div className="col-span-1 md:col-span-4">
          <h3 className="font-medium hover:text-amber-700 transition-colors">
            {item.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {item.facetValues.map(
              (facetValue, index) =>
                facetValue.name &&
                facetValue.name !== "top" &&
                !facetValue.name.startsWith("carac_") && (
                  <span key={index}>{facetValue.name}</span>
                ),
            )}
          </p>
          {item.variantList.items[0].actualStockLevel < 5 && (
            <Badge
              variant="outline"
              className="mt-2 border-orange-200 text-orange-700"
            >
              Plus que {item.variantList.items[0].actualStockLevel} en stock
            </Badge>
          )}
        </div>

        <div className="col-span-1 md:col-span-2 text-left md:text-center">
          <div className="md:hidden text-sm text-muted-foreground mb-1">
            Prix
          </div>
          <span className="font-medium">
            {formatCurrency(item.variantList.items[0].priceWithTax, "€")}
          </span>
        </div>

        <div className="col-span-1 md:col-span-2 text-left md:text-center">
          <div className="md:hidden text-sm text-muted-foreground mb-1">
            Quantité
          </div>
          <div className="flex items-center border rounded-md w-32 mx-auto bg-white">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none hover:bg-amber-50 group"
              onClick={() => onQuantityChange(item, item.quantity - 1)}
            >
              {item.quantity === 1 ? (
                <Trash2 className="h-3 w-3 text-red-500 group-hover:text-red-700" />
              ) : (
                <Minus className="h-3 w-3" />
              )}
            </Button>
            <span className="flex-1 text-center font-medium">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none hover:bg-amber-50"
              onClick={() => onQuantityChange(item, item.quantity + 1)}
              disabled={
                item.quantity >= item.variantList.items[0].actualStockLevel
              }
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 text-left md:text-center">
          <div className="md:hidden text-sm text-muted-foreground mb-1">
            Total
          </div>
          <span className="font-semibold text-amber-800">
            {formatCurrency(
              item.variantList.items[0].priceWithTax * item.quantity,
              "€",
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
