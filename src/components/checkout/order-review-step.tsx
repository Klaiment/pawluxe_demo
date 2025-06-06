"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard, MapPin, Truck, User } from "lucide-react";
import type { CheckoutData, CartItem } from "@/lib/types";

interface OrderReviewStepProps {
  data: CheckoutData;
  cart: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  onPrev: () => void;
  onSubmit: () => void;
  isProcessing: boolean;
}

export function OrderReviewStep({
  data,
  cart,
  subtotal,
  shippingCost,
  total,
  onPrev,
  onSubmit,
  isProcessing,
}: OrderReviewStepProps) {
  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "card":
        return "Carte bancaire";
      case "paypal":
        return "PayPal";
      case "transfer":
        return "Virement bancaire";
      default:
        return method;
    }
  };

  const getShippingMethodLabel = (method: string) => {
    switch (method) {
      case "standard":
        return "Livraison standard (3-5 jours)";
      case "express":
        return "Livraison express (24-48h)";
      default:
        return method;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Récapitulatif de votre commande
        </h3>

        {/* Customer Info */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-amber-50 rounded-lg">
            <User className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Informations personnelles</h4>
              <p className="text-sm text-muted-foreground">
                {data.customerInfo.firstName} {data.customerInfo.lastName}
              </p>
              <p className="text-sm text-muted-foreground">
                {data.customerInfo.email}
              </p>
              <p className="text-sm text-muted-foreground">
                {data.customerInfo.phone}
              </p>
            </div>
          </div>

          {/* Billing Address */}
          <div className="flex items-start space-x-3 p-4 bg-amber-50 rounded-lg">
            <MapPin className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Adresse de facturation</h4>
              <p className="text-sm text-muted-foreground">
                {data.billingAddress.street}
              </p>
              <p className="text-sm text-muted-foreground">
                {data.billingAddress.postalCode} {data.billingAddress.city}
              </p>
              <p className="text-sm text-muted-foreground">
                {data.billingAddress.country}
              </p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="flex items-start space-x-3 p-4 bg-amber-50 rounded-lg">
            <Truck className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Adresse de livraison</h4>
              {data.sameAsBilling ? ( // Correction ici: sameAsBilling au lieu de sameAsBinding
                <p className="text-sm text-muted-foreground">
                  Identique à l'adresse de facturation
                </p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    {data.shippingAddress.street}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {data.shippingAddress.postalCode}{" "}
                    {data.shippingAddress.city}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {data.shippingAddress.country}
                  </p>
                </>
              )}
              <p className="text-sm text-amber-700 font-medium mt-1">
                {getShippingMethodLabel(data.shippingMethod)}
              </p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex items-start space-x-3 p-4 bg-amber-50 rounded-lg">
            <CreditCard className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Méthode de paiement</h4>
              <p className="text-sm text-muted-foreground">
                {getPaymentMethodLabel(data.paymentMethod)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div>
        <h4 className="font-medium mb-3">Articles commandés</h4>
        <div className="space-y-3">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center space-x-3 p-3 border rounded-lg"
            >
              <img
                src={
                  item.productVariant.product.featuredAsset.preview ||
                  "/placeholder.svg"
                }
                alt={item.productVariant.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium">{item.productVariant.name}</p>
                <p className="text-sm text-muted-foreground">
                  Quantité: {item.quantity}
                </p>
              </div>
              <p className="font-medium">
                {(
                  (item.productVariant.priceWithTax / 100) *
                  item.quantity
                ).toFixed(2)}{" "}
                €
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Order Total */}
      <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between text-sm">
          <span>Sous-total</span>
          <span>{subtotal.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Livraison</span>
          <span>
            {shippingCost === 0 ? "Gratuite" : `${shippingCost.toFixed(2)} €`}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>{total.toFixed(2)} €</span>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isProcessing}
          className="bg-amber-700 hover:bg-amber-800"
          size="lg"
        >
          {isProcessing ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Traitement en cours...
            </div>
          ) : (
            "Confirmer la commande"
          )}
        </Button>
      </div>
    </div>
  );
}
