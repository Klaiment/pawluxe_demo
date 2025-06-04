import { Badge, Menu, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { useEffect, useState } from "react";
import { useMobile } from "@/hooks/use-mobile";
import { useCart } from "@/components/cart/cart-provider.tsx";
import { Link } from "react-router";

export const Header = () => {
  const { cart } = useCart();
  const isMobile = useMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white shadow-sm" : "bg-white/80 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>

            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold font-playfair">PawLuxe</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium transition-colors hover:text-amber-700"
            >
              Accueil
            </Link>
            <Link
              to="/products"
              className="text-sm font-medium transition-colors hover:text-amber-700"
            >
              Produits
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-amber-600">
                    {totalItems}
                  </Badge>
                )}
                <span className="sr-only">Panier</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && (
        <div
          className={`fixed inset-0 bg-white z-50 transition-transform duration-300 transform ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center h-16 px-4 border-b">
            <Link
              to="/"
              className="flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="text-xl font-bold font-playfair">PawLuxe</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(false)}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>

          <nav className="flex flex-col p-4 space-y-4">
            <Link
              to="/"
              className="text-lg font-medium py-2 border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              to="/products"
              className="text-lg font-medium py-2 border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Produits
            </Link>
            <Link
              to="/cart"
              className="text-lg font-medium py-2 border-b border-gray-100 flex justify-between items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Panier
              {totalItems > 0 && (
                <Badge className="bg-amber-600">{totalItems}</Badge>
              )}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
