import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "../styles/index.css";

import { HomePage } from "../pages/Home/HomePage";
import { CollectionPage } from "../pages/Collection/CollectionPage";
import { ProductDetailPage } from "../pages/ProductDetail/ProductDetailPage";
import { AboutPage } from "../pages/About/AboutPage";
import { ProfilePage } from "../pages/Profile/ProfilePage";
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";
import { CartDrawer } from "../components/CartDrawer/CartDrawer";
import { CheckoutModal } from "../components/CheckoutModal/CheckoutModal";
import { OtpLoginModal } from "../components/OtpLoginModal/OtpLoginModal";

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
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/collection" element={<CollectionPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
          <CartDrawer />
          <CheckoutModal />
          {/* OTP Login Modal lives at root so it can appear from any page */}
          <OtpLoginModal />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
