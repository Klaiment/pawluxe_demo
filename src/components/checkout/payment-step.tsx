"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Smartphone,
  Building,
  Lock,
  Shield,
} from "lucide-react";
import type { CheckoutData } from "@/lib/types";

interface PaymentStepProps {
  data: CheckoutData;
  onUpdate: (data: Partial<CheckoutData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function PaymentStep({
  data,
  onUpdate,
  onNext,
  onPrev,
}: PaymentStepProps) {
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-6">
          <CreditCard className="h-5 w-5 text-amber-600" />
          <h3 className="text-lg font-semibold">Méthode de paiement</h3>
        </div>

        <RadioGroup
          value={data.paymentMethod}
          onValueChange={(value) => onUpdate({ paymentMethod: value })}
          className="space-y-4"
        >
          {/* Credit Card */}
          <div
            className={`relative border-2 rounded-xl p-6 transition-all duration-300 cursor-pointer ${
              data.paymentMethod === "card"
                ? "border-amber-500 bg-amber-50 shadow-lg"
                : "border-gray-200 hover:border-amber-300 hover:bg-amber-50/50"
            }`}
          >
            <div className="flex items-center space-x-4">
              <RadioGroupItem
                value="card"
                id="card"
                className="text-amber-600"
              />
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <Label
                    htmlFor="card"
                    className="font-medium text-base cursor-pointer"
                  >
                    Carte bancaire
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Visa, Mastercard, American Express
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center text-xs text-white font-bold">
                  V
                </div>
                <div className="w-8 h-6 bg-red-500 rounded flex items-center justify-center text-xs text-white font-bold">
                  M
                </div>
                <div className="w-8 h-6 bg-green-600 rounded flex items-center justify-center text-xs text-white font-bold">
                  AE
                </div>
              </div>
            </div>

            {data.paymentMethod === "card" && (
              <div className="mt-6 space-y-4 border-t border-amber-200 pt-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber" className="text-sm font-medium">
                      Numéro de carte
                    </Label>
                    <div className="relative">
                      <Input
                        id="cardNumber"
                        value={cardData.number}
                        onChange={(e) =>
                          setCardData({
                            ...cardData,
                            number: formatCardNumber(e.target.value),
                          })
                        }
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="pl-4 pr-12 border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                      />
                      <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry" className="text-sm font-medium">
                        Date d'expiration
                      </Label>
                      <Input
                        id="expiry"
                        value={cardData.expiry}
                        onChange={(e) =>
                          setCardData({
                            ...cardData,
                            expiry: formatExpiry(e.target.value),
                          })
                        }
                        placeholder="MM/AA"
                        maxLength={5}
                        className="border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv" className="text-sm font-medium">
                        CVV
                      </Label>
                      <Input
                        id="cvv"
                        value={cardData.cvv}
                        onChange={(e) =>
                          setCardData({
                            ...cardData,
                            cvv: e.target.value
                              .replace(/\D/g, "")
                              .substring(0, 4),
                          })
                        }
                        placeholder="123"
                        maxLength={4}
                        className="border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardName" className="text-sm font-medium">
                      Nom sur la carte
                    </Label>
                    <Input
                      id="cardName"
                      value={cardData.name}
                      onChange={(e) =>
                        setCardData({ ...cardData, name: e.target.value })
                      }
                      placeholder="Nom complet"
                      className="border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-green-50 p-3 rounded-lg">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>
                    Vos données sont protégées par un cryptage SSL 256 bits
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* PayPal */}
          <div
            className={`border-2 rounded-xl p-6 transition-all duration-300 cursor-pointer ${
              data.paymentMethod === "paypal"
                ? "border-amber-500 bg-amber-50 shadow-lg"
                : "border-gray-200 hover:border-amber-300 hover:bg-amber-50/50"
            }`}
          >
            <div className="flex items-center space-x-4">
              <RadioGroupItem
                value="paypal"
                id="paypal"
                className="text-amber-600"
              />
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <Label
                    htmlFor="paypal"
                    className="font-medium text-base cursor-pointer"
                  >
                    PayPal
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Paiement rapide et sécurisé
                  </p>
                </div>
              </div>
              <div className="w-16 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center text-xs text-white font-bold">
                PayPal
              </div>
            </div>

            {data.paymentMethod === "paypal" && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border-t border-blue-200">
                <p className="text-sm text-blue-700 flex items-center">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Vous serez redirigé vers PayPal pour finaliser votre paiement
                  en toute sécurité.
                </p>
              </div>
            )}
          </div>

          {/* Bank Transfer */}
          <div
            className={`border-2 rounded-xl p-6 transition-all duration-300 cursor-pointer ${
              data.paymentMethod === "transfer"
                ? "border-amber-500 bg-amber-50 shadow-lg"
                : "border-gray-200 hover:border-amber-300 hover:bg-amber-50/50"
            }`}
          >
            <div className="flex items-center space-x-4">
              <RadioGroupItem
                value="transfer"
                id="transfer"
                className="text-amber-600"
              />
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Building className="h-5 w-5 text-white" />
                </div>
                <div>
                  <Label
                    htmlFor="transfer"
                    className="font-medium text-base cursor-pointer"
                  >
                    Virement bancaire
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Paiement par virement SEPA
                  </p>
                </div>
              </div>
            </div>

            {data.paymentMethod === "transfer" && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border-t border-green-200">
                <p className="text-sm text-green-700 flex items-center">
                  <Building className="h-4 w-4 mr-2" />
                  Les informations de virement vous seront envoyées par email
                  après confirmation de votre commande.
                </p>
              </div>
            )}
          </div>
        </RadioGroup>
      </div>

      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          className="px-6 py-3 border-amber-200 text-amber-700 hover:bg-amber-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg transform hover:scale-105"
        >
          Continuer vers la confirmation
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
