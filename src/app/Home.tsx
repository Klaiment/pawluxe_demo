import { ProductCard } from "@/components/product/product-card.tsx";
import {motion} from "framer-motion";
import {Badge} from "@/components/ui/badge.tsx";
import {ChevronRight, Shield, Sparkles, Star, Truck} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import { useRef } from "react";
import {Link} from "react-router";

export const Home = () => {


    const parallaxStyle = {
        transform: `translateY(${scrollY * 0.4}px)`,
    }
    const heroRef = useRef<HTMLDivElement>(null);

    return (
    <>
        <main className="flex min-h-screen flex-col overflow-hidden">
            {/* Hero Section - Enhanced */}
            <section
                ref={heroRef}
                className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-900 via-amber-800 to-orange-900"
            >
                {/* Background Elements */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/40 z-10"></div>
                    <div
                        className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-1000 ease-out"
                        style={{
                            backgroundImage: `url('/images/hero-banner.png')`,
                            ...parallaxStyle,
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-20"></div>
                </div>

                {/* Floating Elements */}
                <div className="absolute inset-0 z-10 overflow-hidden">
                    <div
                        className="absolute top-[20%] left-[10%] w-24 h-24 rounded-full bg-amber-500/20 blur-3xl animate-pulse"
                        style={{ animationDuration: "8s" }}
                    ></div>
                    <div
                        className="absolute bottom-[30%] right-[15%] w-32 h-32 rounded-full bg-orange-500/20 blur-3xl animate-pulse"
                        style={{ animationDuration: "12s" }}
                    ></div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 md:px-6 relative z-30">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-col items-center md:items-start text-center md:text-left max-w-3xl mx-auto md:mx-0"
                    >
                        <Badge
                            className="mb-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 px-4 py-1.5 text-sm font-medium"
                            variant="outline"
                        >
                            <Sparkles className="mr-2 h-4 w-4" />
                            Collection Exclusive 2025
                        </Badge>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 font-playfair leading-tight">
                            <span className="block">Le Luxe pour</span>
                            <span className="bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
                Vos Compagnons
              </span>
                        </h1>

                        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl leading-relaxed">
                            Des accessoires raffinés et des produits haut de gamme pour les animaux de compagnie qui méritent ce qu'il
                            y a de mieux. Conçus avec passion, fabriqués avec excellence.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                asChild
                                size="lg"
                                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white border-0 shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105"
                            >
                                <Link to="/products">
                                    Découvrir la Collection
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 transition-all duration-300"
                            >
                                <Link to="#featured">Produits Vedettes</Link>
                            </Button>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-12">
                            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                                <Shield className="h-4 w-4 text-amber-300 mr-2" />
                                <span className="text-white/90 text-sm">Garantie 2 ans</span>
                            </div>
                            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                                <Truck className="h-4 w-4 text-amber-300 mr-2" />
                                <span className="text-white/90 text-sm">Livraison offerte</span>
                            </div>
                            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                                <Star className="h-4 w-4 text-amber-300 mr-2" />
                                <span className="text-white/90 text-sm">Qualité premium</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    </>
  );
};
