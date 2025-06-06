import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Lock, Shield, CreditCard } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CustomerInfoStep } from "@/components/checkout/customer-info-step";
import { ShippingStep } from "@/components/checkout/shipping-step";
import { PaymentStep } from "@/components/checkout/payment-step";
import { OrderReviewStep } from "@/components/checkout/order-review-step";
import type { CheckoutData } from "@/lib/types";

const steps = [
  {
    id: 1,
    title: "Vos informations",
    subtitle: "Coordonnées personnelles",
    icon: "👤",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: 2,
    title: "Livraison",
    subtitle: "Adresse et mode d'expédition",
    icon: "🚚",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: 3,
    title: "Paiement",
    subtitle: "Méthode de règlement",
    icon: "💳",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 4,
    title: "Confirmation",
    subtitle: "Vérification finale",
    icon: "✅",
    color: "from-purple-500 to-violet-500",
  },
];

export const Checkout = () => {
  const router = useNavigate();
  const { cart, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    customerInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
    billingAddress: {
      street: "",
      city: "",
      postalCode: "",
      country: "France",
    },
    shippingAddress: {
      street: "",
      city: "",
      postalCode: "",
      country: "France",
    },
    sameAsBilling: true,
    shippingMethod: "standard",
    paymentMethod: "card",
  });

  const subtotal = cart.reduce(
    (total, item) =>
      total + (item.productVariant.priceWithTax / 100) * item.quantity,
    0,
  );
  const shippingCost =
    checkoutData.shippingMethod === "express"
      ? 9.99
      : subtotal >= 50
        ? 0
        : 4.99;
  const total = subtotal + shippingCost;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (cart.length === 0) {
        router("/cart");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [cart.length, router]);

  const updateCheckoutData = (data: Partial<CheckoutData>) => {
    setCheckoutData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCompletedSteps((prev) => new Set(prev).add(currentStep));
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToStep = (stepNumber: number) => {
    if (stepNumber <= currentStep || completedSteps.has(stepNumber - 1)) {
      setCurrentStep(stepNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFinalSubmit = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      clearCart();
      router("/checkout/success");
    }, 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <CustomerInfoStep
            data={checkoutData}
            onUpdate={updateCheckoutData}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <ShippingStep
            data={checkoutData}
            onUpdate={updateCheckoutData}
            onNext={nextStep}
            onPrev={prevStep}
            subtotal={subtotal}
          />
        );
      case 3:
        return (
          <PaymentStep
            data={checkoutData}
            onUpdate={updateCheckoutData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <OrderReviewStep
            data={checkoutData}
            cart={cart}
            subtotal={subtotal}
            shippingCost={shippingCost}
            total={total}
            onPrev={prevStep}
            onSubmit={handleFinalSubmit}
            isProcessing={isProcessing}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-32 bg-amber-200 rounded mb-4"></div>
          <div className="h-4 w-48 bg-amber-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-amber-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router("/cart")}
                className="hover:bg-amber-50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
              <div>
                <h1 className="text-xl font-bold font-playfair">
                  Finaliser votre commande
                </h1>
                <p className="text-sm text-muted-foreground">
                  Étape {currentStep} sur {steps.length}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Paiement sécurisé</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Progress Steps - Enhanced */}
          <div className="mb-12">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                  }}
                />
              </div>

              {/* Steps */}
              <div className="relative flex justify-between">
                {steps.map((step) => {
                  const isActive = currentStep === step.id;
                  const isCompleted =
                    completedSteps.has(step.id) || currentStep > step.id;
                  const isClickable =
                    step.id <= currentStep || completedSteps.has(step.id - 1);

                  return (
                    <div
                      key={step.id}
                      className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${
                        isClickable
                          ? "hover:scale-105"
                          : "cursor-not-allowed opacity-60"
                      }`}
                      onClick={() => isClickable && goToStep(step.id)}
                    >
                      {/* Step Circle */}
                      <div
                        className={`
                        relative w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-500 mb-3
                        ${
                          isCompleted
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-110"
                            : isActive
                              ? `bg-gradient-to-r ${step.color} text-white shadow-lg scale-110 animate-pulse`
                              : "bg-white border-2 border-gray-200 text-gray-400"
                        }
                      `}
                      >
                        {isCompleted ? (
                          <Check className="h-6 w-6" />
                        ) : (
                          <span>{step.icon}</span>
                        )}

                        {/* Active Ring */}
                        {isActive && (
                          <div className="absolute inset-0 rounded-full border-4 border-amber-300 animate-ping opacity-75" />
                        )}
                      </div>

                      {/* Step Info */}
                      <div className="text-center max-w-24">
                        <div
                          className={`text-sm font-semibold transition-colors duration-300 ${
                            isActive
                              ? "text-amber-700"
                              : isCompleted
                                ? "text-green-700"
                                : "text-gray-500"
                          }`}
                        >
                          {step.title}
                        </div>
                        <div className="text-xs text-muted-foreground hidden sm:block mt-1">
                          {step.subtitle}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardContent className="p-8">
                  {/* Step Header */}
                  <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-2">
                      <div
                        className={`w-8 h-8 rounded-full bg-gradient-to-r ${steps[currentStep - 1].color} flex items-center justify-center text-white text-sm`}
                      >
                        {steps[currentStep - 1].icon}
                      </div>
                      <h2 className="text-2xl font-bold font-playfair">
                        {steps[currentStep - 1].title}
                      </h2>
                    </div>
                    <p className="text-muted-foreground">
                      {steps[currentStep - 1].subtitle}
                    </p>
                  </div>

                  {/* Step Content */}
                  <div className="transition-all duration-500 ease-in-out">
                    {renderStepContent()}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary - Enhanced */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
                  {/* Header with gradient */}
                  <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 text-white">
                    <h3 className="text-xl font-bold font-playfair flex items-center">
                      <Shield className="mr-2 h-5 w-5" />
                      Récapitulatif
                    </h3>
                    <p className="text-amber-100 text-sm mt-1">
                      Commande sécurisée
                    </p>
                  </div>

                  <CardContent className="p-6">
                    {/* Cart Items */}
                    <div className="space-y-4 mb-6">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg"
                        >
                          <div className="relative">
                            <img
                              src={
                                item.productVariant.product.featuredAsset
                                  .preview || "/placeholder.svg"
                              }
                              alt={item.productVariant.name}
                              className="w-12 h-12 object-cover rounded border border-amber-200"
                            />
                            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-amber-600 text-xs">
                              {item.quantity}
                            </Badge>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {item.productVariant.name}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-amber-800">
                            {(
                              (item.productVariant.priceWithTax / 100) *
                              item.quantity
                            ).toFixed(2)}{" "}
                            €
                          </p>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-6" />

                    {/* Pricing */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Sous-total
                        </span>
                        <span className="font-medium">
                          {subtotal.toFixed(2)} €
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Livraison</span>
                        <span
                          className={`font-medium ${shippingCost === 0 ? "text-green-600" : ""}`}
                        >
                          {shippingCost === 0
                            ? "Gratuite"
                            : `${shippingCost.toFixed(2)} €`}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-amber-800">
                          {total.toFixed(2)} €
                        </span>
                      </div>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-6 pt-6 border-t border-amber-100">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>SSL sécurisé</span>
                        </div>
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Données protégées</span>
                        </div>
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>Paiement 3D Secure</span>
                        </div>
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          <span>Garantie qualité</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Icons */}
                    <div className="mt-6 pt-6 border-t border-amber-100">
                      <p className="text-xs text-muted-foreground mb-3 text-center">
                        Moyens de paiement acceptés
                      </p>
                      <div className="flex justify-center space-x-3">
                        <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center">
                          <CreditCard className="h-3 w-3 text-white" />
                        </div>
                        <div className="w-8 h-6 bg-yellow-500 rounded flex items-center justify-center text-xs font-bold text-white">
                          PP
                        </div>
                        <div className="w-8 h-6 bg-green-600 rounded flex items-center justify-center text-xs font-bold text-white">
                          VB
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
