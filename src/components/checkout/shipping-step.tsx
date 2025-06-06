"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ArrowRight, Truck, Zap } from "lucide-react";
import type { CheckoutData } from "@/lib/types";

interface ShippingStepProps {
  data: CheckoutData;
  onUpdate: (data: Partial<CheckoutData>) => void;
  onNext: () => void;
  onPrev: () => void;
  subtotal: number;
}

export function ShippingStep({
  data,
  onUpdate,
  onNext,
  onPrev,
  subtotal,
}: ShippingStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    if (data.sameAsBilling) {
      // Correction ici: sameAsBilling au lieu de sameAsBinding
      return true;
    }

    const newErrors: Record<string, string> = {};

    if (!data.shippingAddress.street.trim()) {
      newErrors.shippingStreet = "L'adresse de livraison est requise";
    }
    if (!data.shippingAddress.city.trim()) {
      newErrors.shippingCity = "La ville de livraison est requise";
    }
    if (!data.shippingAddress.postalCode.trim()) {
      newErrors.shippingPostalCode = "Le code postal de livraison est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  const updateShippingAddress = (field: string, value: string) => {
    onUpdate({
      shippingAddress: {
        ...data.shippingAddress,
        [field]: value,
      },
    });
    if (errors[`shipping${field.charAt(0).toUpperCase() + field.slice(1)}`]) {
      setErrors({
        ...errors,
        [`shipping${field.charAt(0).toUpperCase() + field.slice(1)}`]: "",
      });
    }
  };

  const handleSameAsBilling = (checked: boolean) => {
    // Correction ici: sameAsBilling au lieu de sameAsBinding
    onUpdate({
      sameAsBilling: checked, // Correction ici
      ...(checked && { shippingAddress: data.billingAddress }),
    });
  };

  const standardShippingCost = subtotal >= 50 ? 0 : 4.99;
  const expressShippingCost = 9.99;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Adresse de livraison</h3>

        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="sameAsBilling"
            checked={data.sameAsBilling}
            onCheckedChange={handleSameAsBilling}
          />
          <Label htmlFor="sameAsBilling">
            Utiliser la même adresse que la facturation
          </Label>
        </div>

        {!data.sameAsBilling && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="shippingStreet">Adresse *</Label>
              <Input
                id="shippingStreet"
                value={data.shippingAddress.street}
                onChange={(e) =>
                  updateShippingAddress("street", e.target.value)
                }
                className={errors.shippingStreet ? "border-red-500" : ""}
              />
              {errors.shippingStreet && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.shippingStreet}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shippingCity">Ville *</Label>
                <Input
                  id="shippingCity"
                  value={data.shippingAddress.city}
                  onChange={(e) =>
                    updateShippingAddress("city", e.target.value)
                  }
                  className={errors.shippingCity ? "border-red-500" : ""}
                />
                {errors.shippingCity && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.shippingCity}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="shippingPostalCode">Code postal *</Label>
                <Input
                  id="shippingPostalCode"
                  value={data.shippingAddress.postalCode}
                  onChange={(e) =>
                    updateShippingAddress("postalCode", e.target.value)
                  }
                  className={errors.shippingPostalCode ? "border-red-500" : ""}
                />
                {errors.shippingPostalCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.shippingPostalCode}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Mode de livraison</h3>
        <RadioGroup
          value={data.shippingMethod}
          onValueChange={(value) => onUpdate({ shippingMethod: value })}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-amber-50 transition-colors">
            <RadioGroupItem value="standard" id="standard" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-amber-600" />
                  <Label htmlFor="standard" className="font-medium">
                    Livraison standard
                  </Label>
                </div>
                <span className="font-medium">
                  {standardShippingCost === 0
                    ? "Gratuite"
                    : `${standardShippingCost.toFixed(2)} €`}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Livraison en 3-5 jours ouvrés
                {subtotal < 50 && " • Gratuite à partir de 50€"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-amber-50 transition-colors">
            <RadioGroupItem value="express" id="express" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-amber-600" />
                  <Label htmlFor="express" className="font-medium">
                    Livraison express
                  </Label>
                </div>
                <span className="font-medium">
                  {expressShippingCost.toFixed(2)} €
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Livraison en 24-48h
              </p>
            </div>
          </div>
        </RadioGroup>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <Button type="submit" className="bg-amber-700 hover:bg-amber-800">
          Continuer <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
