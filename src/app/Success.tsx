import { useEffect, useState } from "react";
import {
  CheckCircle,
  ArrowLeft,
  Gift,
  Truck,
  Star,
  Heart,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router";

export const CheckoutSuccessPage = () => {
  const [orderNumber] = useState(() => `PL${Date.now().toString().slice(-6)}`);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              ✨
            </div>
          ))}
        </div>
      )}

      <div className="container mx-auto py-16 px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="relative mb-8">
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-6 w-24 h-24 mx-auto flex items-center justify-center shadow-lg">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 bg-amber-400 rounded-full p-2 animate-pulse">
              <Gift className="h-4 w-4 text-white" />
            </div>
          </div>

          {/* Main Message */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-playfair bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Commande confirmée !
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              Merci pour votre confiance, votre commande a été traitée avec
              succès.
            </p>
            <Badge
              variant="outline"
              className="border-green-200 text-green-700 bg-green-50"
            >
              Commande #{orderNumber}
            </Badge>
          </div>

          {/* Order Details Card */}
          <Card className="mb-8 border-amber-200 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto flex items-center justify-center">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">Confirmation envoyée</h3>
                  <p className="text-sm text-muted-foreground">
                    Un email de confirmation vous a été envoyé
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="bg-amber-100 rounded-full p-3 w-12 h-12 mx-auto flex items-center justify-center">
                    <Truck className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="font-semibold">Expédition sous 24h</h3>
                  <p className="text-sm text-muted-foreground">
                    Votre commande sera expédiée rapidement
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto flex items-center justify-center">
                    <Star className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold">Qualité garantie</h3>
                  <p className="text-sm text-muted-foreground">
                    Satisfaction garantie ou remboursé
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Message */}
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-6 mb-8 border border-amber-200">
            <div className="flex items-center justify-center mb-3">
              <Heart className="h-5 w-5 text-red-500 mr-2" />
              <span className="font-semibold text-amber-800">
                Message spécial
              </span>
            </div>
            <p className="text-amber-700 leading-relaxed">
              Chez PawLuxe, chaque commande est préparée avec amour et
              attention. Votre compagnon mérite ce qu'il y a de mieux, et nous
              sommes fiers de contribuer à son bonheur. Merci de faire partie de
              la famille PawLuxe !
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              asChild
              size="lg"
              className="bg-amber-700 hover:bg-amber-800"
            >
              <Link to="/products">Continuer vos achats</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à l'accueil
              </Link>
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-center space-y-2 text-sm text-muted-foreground">
            <p>
              Besoin d'aide ? Contactez notre service client au +33 1 23 45 67
              89
            </p>
            <p>ou par email à contact@pawluxe.com</p>
          </div>
        </div>
      </div>
    </main>
  );
};
