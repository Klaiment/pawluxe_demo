import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import { Home } from "./app/Home.tsx";
import { Header } from "@/components/layout/header.tsx";
import { Cart } from "@/app/Cart.tsx";
import { Footer } from "@/components/layout/footer.tsx";
import { Product } from "@/app/Product.tsx";
import ProductsPage from "@/app/ProductsPage.tsx";

function App() {
  return (
    <Router>
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
