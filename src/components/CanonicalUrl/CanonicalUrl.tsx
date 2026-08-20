import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BASE_URL = "https://tobeque.com";

/**
 * CanonicalUrl – automatically keeps <link rel="canonical"> in sync
 * with the current page URL on every route change.
 *
 * Mount this once inside <BrowserRouter> (alongside <ScrollToTop>).
 * It will create the tag on first render and update it on navigation.
 */
export function CanonicalUrl() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Build the full canonical URL: base + path (no trailing slash except root)
    const canonical =
      pathname === "/"
        ? BASE_URL + "/"
        : BASE_URL + pathname.replace(/\/$/, "");

    // Find or create the <link rel="canonical"> tag
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonical);

    // Cleanup: remove when component unmounts (unmount = app teardown)
    return () => {
      // Don't remove – keep it in head so crawlers always see it
    };
  }, [pathname]);

  return null;
}
