import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "../styles/index.css";

import { HomePage } from "../pages/Home/HomePage";
import { CollectionPage } from "../pages/Collection/CollectionPage";
import { ProductDetailPage } from "../pages/ProductDetail/ProductDetailPage";
import { CartProvider } from "../context/CartContext";
import { CartDrawer } from "../components/CartDrawer/CartDrawer";
import { CheckoutModal } from "../components/CheckoutModal/CheckoutModal";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Routes>
        <CartDrawer />
        <CheckoutModal />
      </CartProvider>
    </BrowserRouter>
  );
}
