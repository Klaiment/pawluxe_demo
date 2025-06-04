import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import { ArrowLeft } from "lucide-react";

export const Breadcrumb = ({ productName }: { productName: string }) => {
  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-amber-100 sticky top-0 z-40">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-amber-700 transition-colors">
              Accueil
            </Link>
            <span>/</span>
            <Link
              to="/products"
              className="hover:text-amber-700 transition-colors"
            >
              Produits
            </Link>
            <span>/</span>
            <span className="text-amber-700 font-medium">{productName}</span>
          </nav>
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="hover:bg-amber-50 cursor-pointer"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </div>
      </div>
    </div>
  );
};
