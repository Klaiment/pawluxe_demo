import { ShoppingBag, Gift, ArrowRight, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/format-currency";

interface CartSummaryProps {
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  freeShippingThreshold: number;
  onCheckout: () => void;
}

export const CartSummary = ({
  itemCount,
  subtotal,
  shipping,
  total,
  freeShippingThreshold,
  onCheckout,
}: CartSummaryProps) => {
  return (
    <div className="bg-white rounded-lg border border-amber-100 p-6 sticky top-24 shadow-sm">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <ShoppingBag className="mr-2 h-5 w-5 text-amber-600" />
        Récapitulatif
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Sous-total ({itemCount} article{itemCount > 1 ? "s" : ""})
          </span>
          <span className="font-medium">{subtotal.toFixed(2)} €</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Livraison</span>
          <span
            className={`font-medium ${shipping === 0 ? "text-green-600" : ""}`}
          >
            {shipping === 0 ? (
              <span className="flex items-center">
                <Gift className="h-3 w-3 mr-1" />
                Gratuite
              </span>
            ) : (
              `${shipping.toFixed(2)} €`
            )}
          </span>
        </div>

        <Separator className="my-4" />

        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span className="text-amber-800">{formatCurrency(total, "€")}</span>
        </div>

        {subtotal >= freeShippingThreshold && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-700 font-medium flex items-center">
              <Gift className="h-4 w-4 mr-2" />
              Vous économisez 4,99 € sur la livraison !
            </p>
          </div>
        )}
      </div>

      <Button
        className="w-full mt-6 bg-amber-700 hover:bg-amber-800 transition-all duration-300 hover:shadow-lg"
        size="lg"
        onClick={onCheckout}
      >
        <div className="flex items-center">
          Passer commande
          <ArrowRight className="ml-2 h-4 w-4" />
        </div>
      </Button>

      <div className="mt-4 space-y-2">
        <div className="text-xs text-muted-foreground text-center">
          Livraison gratuite à partir de 50€ d'achat
        </div>
        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
          <span className="flex items-center">
            <Truck className="h-3 w-3 mr-1" />
            Livraison rapide
          </span>
          <span>•</span>
          <span>Paiement sécurisé</span>
        </div>
      </div>
    </div>
  );
};
