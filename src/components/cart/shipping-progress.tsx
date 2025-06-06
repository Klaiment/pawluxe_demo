import { Truck, Gift } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ShippingProgressProps {
  subtotal: number;
  freeShippingThreshold: number;
}

export const ShippingProgress = ({
  subtotal,
  freeShippingThreshold,
}: ShippingProgressProps) => {
  const remainingForFreeShipping = Math.max(
    0,
    freeShippingThreshold - subtotal,
  );
  const progressPercentage = Math.min(
    100,
    (subtotal / freeShippingThreshold) * 100,
  );

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Truck className="h-5 w-5 text-amber-600" />
          <span className="font-medium">Livraison gratuite</span>
        </div>
        {subtotal >= freeShippingThreshold ? (
          <Badge className="bg-green-500 hover:bg-green-600">
            <Gift className="h-3 w-3 mr-1" />
            Obtenue !
          </Badge>
        ) : (
          <span className="text-sm text-muted-foreground">
            Plus que {remainingForFreeShipping.toFixed(2)} €
          </span>
        )}
      </div>

      <Progress value={progressPercentage} className="h-3 mb-2" />

      {subtotal >= freeShippingThreshold ? (
        <p className="text-sm text-green-600 font-medium">
          🎉 Félicitations ! Vous bénéficiez de la livraison gratuite
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Ajoutez {remainingForFreeShipping.toFixed(2)} € pour bénéficier de la
          livraison gratuite
        </p>
      )}
    </div>
  );
};
