import { motion } from "framer-motion";

const benefits = [
  {
    icon: "🚚",
    title: "Livraison gratuite",
    description: "À partir de 50€ d'achat",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: "🛡️",
    title: "Garantie 2 ans",
    description: "Sur tous nos produits",
    color: "from-green-500 to-green-600",
  },
  {
    icon: "💎",
    title: "Qualité premium",
    description: "Matériaux nobles",
    color: "from-purple-500 to-purple-600",
  },
];

export const BenefitsSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {benefits.map((benefit, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300 group"
        >
          <div
            className={`w-12 h-12 bg-gradient-to-r ${benefit.color} rounded-full flex items-center justify-center text-2xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}
          >
            {benefit.icon}
          </div>
          <h3 className="font-semibold mb-2">{benefit.title}</h3>
          <p className="text-sm text-muted-foreground">{benefit.description}</p>
        </motion.div>
      ))}
    </div>
  );
};
