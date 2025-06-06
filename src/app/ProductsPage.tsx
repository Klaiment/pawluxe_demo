"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Search,
  Filter,
  X,
  SlidersHorizontal,
  Check,
  ArrowUpDown,
} from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useInView } from "react-intersection-observer";
import { fetchAllProductsFromApi } from "@/services/productService.ts";
import { Link } from "react-router-dom";

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const products = await fetchAllProductsFromApi();
        // @ts-ignore
        setAllProducts((products.products as { items: Product[] }).items);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
      }
    };

    fetchAllProducts();
  }, []);
  const [products, setProducts] = useState<Product[]>(allProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [headerRef] = useInView({ threshold: 0.1 });
  const [productsRef, productsInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const images = document.querySelectorAll("img");
    const promises = Array.from(images).map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) {
            resolve(true);
          } else {
            img.onload = () => resolve(true);
            img.onerror = () => resolve(true);
          }
        }),
    );

    Promise.all(promises).then(() => setIsLoading(false));
  }, []);

  const categories = Array.from(
    new Set(allProducts.map((product) => product.facetValues[0]?.name)),
  );

  const minPrice = Math.min(
    ...allProducts.map(
      (product) => product.variantList.items[0].priceWithTax / 100,
    ),
  );
  const maxPrice = Math.max(
    ...allProducts.map(
      (product) => product.variantList.items[0].priceWithTax / 100,
    ),
  );

  useEffect(() => {
    let filteredProducts = [...allProducts];

    if (searchQuery) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.facetValues[0]?.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedCategories.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        selectedCategories.includes(product.facetValues[0]?.name),
      );
    }

    filteredProducts = filteredProducts.filter((product) => {
      const price = product.variantList.items[0].priceWithTax / 100;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    if (inStockOnly) {
      filteredProducts = filteredProducts.filter(
        (product) => product.variantList.items[0].stockLevel == "IN_STOCK",
      );
    }

    // Apply featured filter
    if (featuredOnly) {
      filteredProducts = filteredProducts.filter(
        (product) => product.facetValues[0]?.name === "top",
      );
    }

    // Apply sorting
    switch (sortOption) {
      case "price-asc":
        filteredProducts.sort(
          (a, b) =>
            parseFloat((a.variantList.items[0].priceWithTax / 100).toFixed(2)) -
            parseFloat((b.variantList.items[0].priceWithTax / 100).toFixed(2)),
        );
        break;
      case "price-desc":
        filteredProducts.sort(
          (a, b) =>
            parseFloat((b.variantList.items[0].priceWithTax / 100).toFixed(2)) -
            parseFloat((a.variantList.items[0].priceWithTax / 100).toFixed(2)),
        );
        break;
      case "name-asc":
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Featured sorting (default)
        filteredProducts.sort((a, b) => a.id.localeCompare(b.id));
        break;
    }

    setProducts(filteredProducts);
  }, [
    searchQuery,
    sortOption,
    selectedCategories,
    priceRange,
    inStockOnly,
    featuredOnly,
    allProducts,
  ]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setPriceRange([minPrice, maxPrice]);
    setInStockOnly(false);
    setFeaturedOnly(false);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <main className="flex min-h-screen flex-col">
      <section
        ref={headerRef}
        className="relative bg-gradient-to-br from-amber-900 via-amber-800 to-orange-900 py-16 md:py-24 overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/90 via-amber-800/90 to-orange-900/90"></div>
        </div>

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

        <div className="container mx-auto px-4 md:px-6 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center max-w-3xl mx-auto"
          >
            <Badge
              className="mb-6 bg-white/10 backdrop-blur-sm text-white border-white/20 px-3 py-1"
              variant="outline"
            >
              Collection PawLuxe
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 font-playfair">
              Découvrez Notre Collection Exclusive
            </h1>
            <p className="text-white/80 text-lg mb-8 max-w-2xl">
              Des produits de luxe soigneusement sélectionnés pour offrir à vos
              compagnons le confort et l'élégance qu'ils méritent.
            </p>

            <div className="relative w-full max-w-xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-300 h-5 w-5" />
              <Input
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 rounded-full focus:ring-2 focus:ring-white/50 focus:border-white/30"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8 sticky top-16 z-30 bg-white/80 backdrop-blur-md shadow-sm rounded-xl p-4 border border-amber-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full md:w-auto">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="border-amber-200 text-amber-700 hover:bg-amber-50 w-full sm:w-auto"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filtres
                    <Badge className="ml-2 bg-amber-600 text-white">
                      {getActiveFiltersCount()}
                    </Badge>
                  </Button>

                  {getActiveFiltersCount() > 0 && (
                    <Button
                      variant="ghost"
                      onClick={resetFilters}
                      className="text-amber-700 hover:bg-amber-50 w-full sm:w-auto"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Réinitialiser
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full md:w-auto">
                <div className="text-sm text-muted-foreground w-full sm:w-auto">
                  {products.length} produit{products.length !== 1 ? "s" : ""}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto justify-between border-amber-200 text-amber-700 hover:bg-amber-50"
                    >
                      <ArrowUpDown className="mr-2 h-4 w-4" />
                      {sortOption === "featured" && "En vedette"}
                      {sortOption === "price-asc" && "Prix croissant"}
                      {sortOption === "price-desc" && "Prix décroissant"}
                      {sortOption === "name-asc" && "A-Z"}
                      {sortOption === "name-desc" && "Z-A"}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-white/90 backdrop-blur-sm border-amber-100"
                  >
                    <DropdownMenuItem onClick={() => setSortOption("featured")}>
                      En vedette
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortOption("price-asc")}
                    >
                      Prix croissant
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortOption("price-desc")}
                    >
                      Prix décroissant
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOption("name-asc")}>
                      A-Z
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortOption("name-desc")}
                    >
                      Z-A
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-6 border-t border-amber-100 mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-medium mb-3 flex items-center">
                        <SlidersHorizontal className="h-4 w-4 mr-2 text-amber-600" />
                        Catégories
                      </h3>
                      <div className="space-y-2">
                        {categories
                          .filter((category) => category !== "top")
                          .map((category) => (
                            <div key={category} className="flex items-center">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleCategory(category)}
                                className={`flex items-center justify-between w-full text-left ${
                                  selectedCategories.includes(category)
                                    ? "bg-amber-100 border-amber-300 text-amber-800"
                                    : "border-amber-200 text-amber-700 hover:bg-amber-50"
                                }`}
                              >
                                <span>{category}</span>
                                {selectedCategories.includes(category) && (
                                  <Check className="h-4 w-4 ml-2" />
                                )}
                              </Button>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3 flex items-center">
                        <SlidersHorizontal className="h-4 w-4 mr-2 text-amber-600" />
                        Prix
                      </h3>
                      <div className="px-2">
                        <Slider
                          defaultValue={[minPrice, maxPrice]}
                          min={minPrice}
                          max={maxPrice}
                          step={1}
                          value={priceRange}
                          onValueChange={(value) =>
                            setPriceRange(value as [number, number])
                          }
                          className="my-6"
                        />
                        <div className="flex items-center justify-between text-sm">
                          <span>{priceRange[0].toFixed(2)} €</span>
                          <span>{priceRange[1].toFixed(2)} €</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3 flex items-center">
                        <SlidersHorizontal className="h-4 w-4 mr-2 text-amber-600" />
                        Options
                      </h3>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setInStockOnly(!inStockOnly)}
                          className={`flex items-center justify-between w-full text-left ${
                            inStockOnly
                              ? "bg-amber-100 border-amber-300 text-amber-800"
                              : "border-amber-200 text-amber-700 hover:bg-amber-50"
                          }`}
                        >
                          <span>En stock uniquement</span>
                          {inStockOnly && <Check className="h-4 w-4 ml-2" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setFeaturedOnly(!featuredOnly)}
                          className={`flex items-center justify-between w-full text-left ${
                            featuredOnly
                              ? "bg-amber-100 border-amber-300 text-amber-800"
                              : "border-amber-200 text-amber-700 hover:bg-amber-50"
                          }`}
                        >
                          <span>Produits vedettes</span>
                          {featuredOnly && <Check className="h-4 w-4 ml-2" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {getActiveFiltersCount() > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {selectedCategories.map((category) => (
                <Badge
                  key={category}
                  variant="outline"
                  className="bg-amber-100 text-amber-800 border-amber-200 px-3 py-1.5"
                >
                  {category}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCategory(category)}
                    className="ml-1 h-4 w-4 p-0 text-amber-700 hover:bg-amber-200 hover:text-amber-900 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              {priceRange[0] > minPrice || priceRange[1] < maxPrice ? (
                <Badge
                  variant="outline"
                  className="bg-amber-100 text-amber-800 border-amber-200 px-3 py-1.5"
                >
                  Prix: {priceRange[0].toFixed(2)} € -{" "}
                  {priceRange[1].toFixed(2)} €
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPriceRange([minPrice, maxPrice])}
                    className="ml-1 h-4 w-4 p-0 text-amber-700 hover:bg-amber-200 hover:text-amber-900 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ) : null}
              {inStockOnly && (
                <Badge
                  variant="outline"
                  className="bg-amber-100 text-amber-800 border-amber-200 px-3 py-1.5"
                >
                  En stock uniquement
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setInStockOnly(false)}
                    className="ml-1 h-4 w-4 p-0 text-amber-700 hover:bg-amber-200 hover:text-amber-900 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {featuredOnly && (
                <Badge
                  variant="outline"
                  className="bg-amber-100 text-amber-800 border-amber-200 px-3 py-1.5"
                >
                  Produits vedettes
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFeaturedOnly(false)}
                    className="ml-1 h-4 w-4 p-0 text-amber-700 hover:bg-amber-200 hover:text-amber-900 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          )}

          <div ref={productsRef}>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-white rounded-xl overflow-hidden shadow-md">
                      <div className="aspect-square bg-gray-200"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <motion.div
                variants={container}
                initial="hidden"
                animate={productsInView ? "show" : "hidden"}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                {products.map((product) => (
                  <motion.div key={product.id} variants={item}>
                    <Link
                      to={`/product/${product.slug}`}
                      className="block h-full"
                    >
                      <ProductCard product={product} showAddToCart={true} />
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-xl border border-amber-100 shadow-sm">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                  <Search className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Aucun produit trouvé
                </h3>
                <p className="text-muted-foreground mb-6">
                  Essayez de modifier vos critères de recherche ou de
                  réinitialiser les filtres.
                </p>
                <Button
                  onClick={resetFilters}
                  className="bg-amber-700 hover:bg-amber-800 text-white"
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );

  function getActiveFiltersCount() {
    let count = 0;
    if (selectedCategories.length > 0) count++;
    if (priceRange[0] > minPrice || priceRange[1] < maxPrice) count++;
    if (inStockOnly) count++;
    if (featuredOnly) count++;
    return count;
  }
}
