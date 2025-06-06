import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import { Home } from "./app/Home.tsx";
import { Header } from "@/components/layout/header.tsx";
import { Cart } from "@/app/Cart.tsx";
import { Footer } from "@/components/layout/footer.tsx";
import { Product } from "@/app/Product.tsx";
import ProductsPage from "@/app/ProductsPage.tsx";
import { Toaster } from "sonner";
import { CartProvider } from "@/components/cart/cart-provider.tsx";
import { Checkout } from "./app/Checkout.tsx";
import {CheckoutSuccessPage} from "@/app/Success.tsx";

function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        <div className="flex-1">
          <Toaster
            position="bottom-right"
            expand={true}
            richColors={false}
            closeButton={true}
          />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:slug" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;
