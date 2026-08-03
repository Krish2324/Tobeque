import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "../styles/index.css";

import { HomePage } from "../pages/Home/HomePage";
import { CollectionPage } from "../pages/Collection/CollectionPage";
import { ProductDetailPage } from "../pages/ProductDetail/ProductDetailPage";
import { AboutPage } from "../pages/About/AboutPage";
import { ProfilePage } from "../pages/Profile/ProfilePage";
import { StyleJournalPage } from "../pages/StyleJournal/StyleJournalPage";
import { StyleJournalDetailPage } from "../pages/StyleJournalDetail/StyleJournalDetailPage";
import { TermsAndConditionsPage } from "../pages/TermsAndConditions/TermsAndConditionsPage";
import { PrivacyPolicyPage } from "../pages/PrivacyPolicy/PrivacyPolicyPage";
import { CookiePolicyPage } from "../pages/CookiePolicy/CookiePolicyPage";
import { CookieSettingsPage } from "../pages/CookieSettings/CookieSettingsPage";
import { CareerPage } from "../pages/Career/CareerPage";
import { FAQPage } from "../pages/FAQ/FAQPage";
import { ContactPage } from "../pages/Contact/ContactPage";
import { StealTheStylePage } from "../pages/StealTheStyle/StealTheStylePage";
import { RefundRequestPage } from "../pages/RefundRequest/RefundRequestPage";
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";
import { CurrencyProvider } from "../context/CurrencyContext";
import { CartDrawer } from "../components/CartDrawer/CartDrawer";
import { CheckoutPage } from "../pages/Checkout/CheckoutPage";
import { CartPage } from "../pages/Cart/CartPage";
import { OtpLoginModal } from "../components/OtpLoginModal/OtpLoginModal";
import { NotFoundPage } from "../pages/NotFound/NotFoundPage";

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
          <CurrencyProvider>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/collection" element={<CollectionPage />} />
              <Route path="/product-category/:categorySlug" element={<CollectionPage />} />
              <Route path="/product-category/:categorySlug/:productSlug" element={<ProductDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/style-journal" element={<StyleJournalPage />} />
              <Route path="/style-journal/:id" element={<StyleJournalDetailPage />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/cookie-policy" element={<CookiePolicyPage />} />
              <Route path="/cookie-settings" element={<CookieSettingsPage />} />
              <Route path="/career" element={<CareerPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/steal-the-style" element={<StealTheStylePage />} />
              <Route path="/refund-request" element={<RefundRequestPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <CartDrawer />
            {/* OTP Login Modal lives at root so it can appear from any page */}
            <OtpLoginModal />
          </CurrencyProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
