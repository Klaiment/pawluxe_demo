import { Link } from "react-router";

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-amber-100">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <span className="text-2xl font-bold font-playfair text-amber-800">
              PawLuxe
            </span>
          </Link>
          <p className="text-sm text-muted-foreground mt-2">
            &copy; {new Date().getFullYear()} PawLuxe. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};
