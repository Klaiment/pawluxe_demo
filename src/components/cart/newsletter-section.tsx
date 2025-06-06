import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

export const NewsletterSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2 }}
      className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 md:p-12 text-center text-white shadow-xl"
    >
      <div className="max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Gift className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-playfair">
          Offre de bienvenue
        </h2>
        <p className="text-white/90 mb-6 text-lg">
          Inscrivez-vous à notre newsletter et recevez 10% de réduction sur
          votre première commande
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Votre adresse email"
            className="flex-1 px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <Button className="bg-white text-amber-800 hover:bg-white/90 px-6 py-3 font-medium">
            S'inscrire
          </Button>
        </div>
        <p className="text-white/70 text-sm mt-4">
          Pas de spam, uniquement nos meilleures offres et nouveautés
        </p>
      </div>
    </motion.section>
  );
};
