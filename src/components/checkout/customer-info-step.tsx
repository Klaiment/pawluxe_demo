"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, User, Mail, Phone, MapPin } from "lucide-react";
import type { CheckoutData } from "@/lib/types";
import {
  setCustomerForOrder,
  setOrderBillingAddress,
  getCurrentOrder,
} from "@/services/orderService";
import { useCart } from "@/components/cart/cart-provider";

interface CustomerInfoStepProps {
  data: CheckoutData;
  onUpdate: (data: Partial<CheckoutData>) => void;
  onNext: () => void;
}

export function CustomerInfoStep({
  data,
  onUpdate,
  onNext,
}: CustomerInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refreshOrder } = useCart();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!data.customerInfo.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
    }
    if (!data.customerInfo.lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
    }
    if (!data.customerInfo.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(data.customerInfo.email)) {
      newErrors.email = "L'email n'est pas valide";
    }
    if (!data.customerInfo.phone.trim()) {
      newErrors.phone = "Le téléphone est requis";
    }

    if (!data.billingAddress.street.trim()) {
      newErrors.street = "L'adresse est requise";
    }
    if (!data.billingAddress.city.trim()) {
      newErrors.city = "La ville est requise";
    }
    if (!data.billingAddress.postalCode.trim()) {
      newErrors.postalCode = "Le code postal est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Récupérer d'abord la commande active pour vérifier si un client existe déjà
      const currentOrder = await getCurrentOrder();

      // Si aucun client n'est défini, on peut en définir un
      if (!currentOrder?.customer) {
        try {
          await setCustomerForOrder({
            emailAddress: data.customerInfo.email,
            firstName: data.customerInfo.firstName,
            lastName: data.customerInfo.lastName,
            phoneNumber: data.customerInfo.phone,
          });
        } catch (customerError) {
          console.warn(
            "Customer already exists or cannot be set:",
            customerError,
          );
          // Continuer même si on ne peut pas définir le client
        }
      }

      // Définir l'adresse de facturation (ceci fonctionne toujours)
      await setOrderBillingAddress({
        fullName: `${data.customerInfo.firstName} ${data.customerInfo.lastName}`,
        streetLine1: data.billingAddress.street,
        city: data.billingAddress.city,
        postalCode: data.billingAddress.postalCode,
        countryCode: "FR",
        phoneNumber: data.customerInfo.phone,
      });

      await refreshOrder();
      onNext();
    } catch (error) {
      console.error("Error setting customer info:", error);

      // Afficher une erreur plus spécifique à l'utilisateur
      if (error instanceof Error && error.message.includes("déjà connecté")) {
        // Si le problème est juste le client, on peut continuer avec l'adresse
        try {
          await setOrderBillingAddress({
            fullName: `${data.customerInfo.firstName} ${data.customerInfo.lastName}`,
            streetLine1: data.billingAddress.street,
            city: data.billingAddress.city,
            postalCode: data.billingAddress.postalCode,
            countryCode: "FR",
            phoneNumber: data.customerInfo.phone,
          });
          await refreshOrder();
          onNext();
          return;
        } catch (addressError) {
          console.error("Error setting billing address:", addressError);
        }
      }

      // Afficher une erreur générique
      alert(
        "Erreur lors de l'enregistrement des informations. Veuillez réessayer.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateCustomerInfo = (field: string, value: string) => {
    onUpdate({
      customerInfo: {
        ...data.customerInfo,
        [field]: value,
      },
    });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const updateBillingAddress = (field: string, value: string) => {
    onUpdate({
      billingAddress: {
        ...data.billingAddress,
        [field]: value,
      },
    });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Information */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <User className="h-5 w-5 text-amber-600" />
          <h3 className="text-lg font-semibold">Informations personnelles</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium">
              Prénom *
            </Label>
            <div className="relative">
              <Input
                id="firstName"
                value={data.customerInfo.firstName}
                onChange={(e) =>
                  updateCustomerInfo("firstName", e.target.value)
                }
                className={`pl-4 transition-all duration-300 focus:ring-2 focus:ring-amber-500 ${
                  errors.firstName
                    ? "border-red-500 bg-red-50"
                    : "border-amber-200 focus:border-amber-500"
                }`}
                placeholder="Votre prénom"
              />
            </div>
            {errors.firstName && (
              <p className="text-red-500 text-sm flex items-center mt-1">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {errors.firstName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium">
              Nom *
            </Label>
            <Input
              id="lastName"
              value={data.customerInfo.lastName}
              onChange={(e) => updateCustomerInfo("lastName", e.target.value)}
              className={`transition-all duration-300 focus:ring-2 focus:ring-amber-500 ${
                errors.lastName
                  ? "border-red-500 bg-red-50"
                  : "border-amber-200 focus:border-amber-500"
              }`}
              placeholder="Votre nom"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm flex items-center mt-1">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {errors.lastName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={data.customerInfo.email}
                onChange={(e) => updateCustomerInfo("email", e.target.value)}
                className={`pl-10 transition-all duration-300 focus:ring-2 focus:ring-amber-500 ${
                  errors.email
                    ? "border-red-500 bg-red-50"
                    : "border-amber-200 focus:border-amber-500"
                }`}
                placeholder="votre@email.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm flex items-center mt-1">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Téléphone *
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                value={data.customerInfo.phone}
                onChange={(e) => updateCustomerInfo("phone", e.target.value)}
                className={`pl-10 transition-all duration-300 focus:ring-2 focus:ring-amber-500 ${
                  errors.phone
                    ? "border-red-500 bg-red-50"
                    : "border-amber-200 focus:border-amber-500"
                }`}
                placeholder="+33 1 23 45 67 89"
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-sm flex items-center mt-1">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {errors.phone}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Billing Address */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <MapPin className="h-5 w-5 text-amber-600" />
          <h3 className="text-lg font-semibold">Adresse de facturation</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="street" className="text-sm font-medium">
              Adresse *
            </Label>
            <Input
              id="street"
              value={data.billingAddress.street}
              onChange={(e) => updateBillingAddress("street", e.target.value)}
              className={`transition-all duration-300 focus:ring-2 focus:ring-amber-500 ${
                errors.street
                  ? "border-red-500 bg-red-50"
                  : "border-amber-200 focus:border-amber-500"
              }`}
              placeholder="123 Rue de la Paix"
            />
            {errors.street && (
              <p className="text-red-500 text-sm flex items-center mt-1">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {errors.street}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium">
                Ville *
              </Label>
              <Input
                id="city"
                value={data.billingAddress.city}
                onChange={(e) => updateBillingAddress("city", e.target.value)}
                className={`transition-all duration-300 focus:ring-2 focus:ring-amber-500 ${
                  errors.city
                    ? "border-red-500 bg-red-50"
                    : "border-amber-200 focus:border-amber-500"
                }`}
                placeholder="Paris"
              />
              {errors.city && (
                <p className="text-red-500 text-sm flex items-center mt-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {errors.city}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode" className="text-sm font-medium">
                Code postal *
              </Label>
              <Input
                id="postalCode"
                value={data.billingAddress.postalCode}
                onChange={(e) =>
                  updateBillingAddress("postalCode", e.target.value)
                }
                className={`transition-all duration-300 focus:ring-2 focus:ring-amber-500 ${
                  errors.postalCode
                    ? "border-red-500 bg-red-50"
                    : "border-amber-200 focus:border-amber-500"
                }`}
                placeholder="75001"
              />
              {errors.postalCode && (
                <p className="text-red-500 text-sm flex items-center mt-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {errors.postalCode}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country" className="text-sm font-medium">
              Pays
            </Label>
            <Input
              id="country"
              value={data.billingAddress.country}
              disabled
              className="bg-gray-50 text-muted-foreground"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg transform hover:scale-105"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Enregistrement...
            </div>
          ) : (
            <>
              Continuer vers la livraison
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
