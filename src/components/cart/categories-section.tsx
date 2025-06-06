import { motion } from "framer-motion";
import { Link } from "react-router";

const categories = [
  {
    name: "Colliers",
    icon: "🦮",
    count: "15 produits",
    color: "from-red-400 to-pink-500",
  },
  {
    name: "Couchage",
    icon: "🛏️",
    count: "8 produits",
    color: "from-blue-400 to-blue-500",
  },
  {
    name: "Alimentation",
    icon: "🍽️",
    count: "12 produits",
    color: "from-green-400 to-green-500",
  },
  {
    name: "Jouets",
    icon: "🎾",
    count: "10 produits",
    color: "from-yellow-400 to-orange-500",
  },
];

export const CategoriesSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="mb-16"
    >
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-playfair">
          Explorez par catégorie
        </h2>
        <p className="text-muted-foreground">
          Trouvez exactement ce que vous cherchez
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
          >
            <Link
              to={`/products?category=${encodeURIComponent(category.name)}`}
              className="group block"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-amber-100 shadow-sm hover:shadow-lg transition-all duration-300 text-center group-hover:scale-105">
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center text-3xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}
                >
                  {category.icon}
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-amber-700 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {category.count}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};
