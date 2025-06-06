import { motion } from "framer-motion";
import { ShoppingBag, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export const EmptyCartHero = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center max-w-2xl mx-auto mb-16"
    >
      <div className="relative mb-8">
        <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center border-4 border-white shadow-xl">
          <ShoppingBag className="h-16 w-16 text-amber-600" />
        </div>
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-3 animate-bounce">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-4 font-playfair">
        Votre panier est vide
      </h1>
      <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
        Découvrez notre collection exclusive d'articles de luxe pour vos
        compagnons bien-aimés. Chaque produit est soigneusement sélectionné pour
        offrir le meilleur à votre animal.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <Button
          asChild
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105"
          size="lg"
        >
          <Link to="/products">
            <Sparkles className="mr-2 h-5 w-5" />
            Découvrir nos produits
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="border-amber-200 text-amber-700 hover:bg-amber-50"
        >
          <Link to="/">Retour à l'accueil</Link>
        </Button>
      </div>
    </motion.div>
  );
};
