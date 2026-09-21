<?php
// Tobeque Dynamic Open Graph & Meta Tag Injector for Hostinger (Apache/LiteSpeed PHP)
// Solves WhatsApp / Facebook / Twitter / iMessage link preview metadata for SPA routes.

$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$parsedUrl = parse_url($requestUri, PHP_URL_PATH);

// Load static index.html built by Vite
$indexPath = __DIR__ . '/index.html';
if (!file_exists($indexPath)) {
    http_response_code(404);
    echo "App index.html not found";
    exit;
}

$html = file_get_contents($indexPath);

// Safe HTTP fetcher (cURL with SSL bypass & fallback to file_get_contents)
function fetchApiJson($url) {
    if (function_exists('curl_init')) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 2);
        curl_setopt($ch, CURLOPT_TIMEOUT, 3);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_USERAGENT, 'TobequeMetaFetcher/1.0');
        $output = curl_exec($ch);
        curl_close($ch);
        if ($output !== false) return $output;
    }

    $ctx = stream_context_create([
        'http' => [
            'method' => 'GET',
            'timeout' => 3,
            'header' => "User-Agent: TobequeMetaFetcher/1.0\r\n",
            'ignore_errors' => true
        ],
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false
        ]
    ]);
    return @file_get_contents($url, false, $ctx);
}

// Helper function to format category slug into title
function formatSlugToTitle($slug) {
    $words = explode('-', $slug);
    $words = array_map('ucfirst', $words);
    return implode(' ', $words);
}

try {
    // 1. Check if request is for a Product Category page: /product-category/{slug}
    if (preg_match('#^/product-category/([^/]+)$#i', $parsedUrl, $matches)) {
        $categorySlug = strtolower(trim($matches[1]));

        if ($categorySlug !== 'all') {
            $backendUrl = "https://backend.tobeque.com/api/categories/public";
            $json = fetchApiJson($backendUrl);
            $foundCategory = null;

            if ($json) {
                $data = json_decode($json, true);
                if (!empty($data['categories']) && is_array($data['categories'])) {
                    $flatten = function($cats) use (&$flatten, &$foundCategory, $categorySlug) {
                        foreach ($cats as $cat) {
                            $cSlug = strtolower($cat['slug'] ?? '');
                            if ($cSlug === $categorySlug) {
                                $foundCategory = $cat;
                                return;
                            }
                            if (!empty($cat['subcategories'])) {
                                $flatten($cat['subcategories']);
                            }
                        }
                    };
                    $flatten($data['categories']);
                }
            }

            if ($foundCategory) {
                $pageTitle = !empty($foundCategory['seoTitle']) ? $foundCategory['seoTitle'] : (!empty($foundCategory['ogTitle']) ? $foundCategory['ogTitle'] : ($foundCategory['name'] . " Online | Stylish " . $foundCategory['name'] . " for Girls | Tobeque"));
                $pageDesc = !empty($foundCategory['seoDescription']) ? $foundCategory['seoDescription'] : (!empty($foundCategory['ogDescription']) ? $foundCategory['ogDescription'] : (!empty($foundCategory['description']) ? $foundCategory['description'] : "Shop " . strtolower($foundCategory['name']) . " at Tobeque, featuring stylish everyday pieces and aesthetic outfits for teens."));
                $imgRaw = $foundCategory['ogImage'] ?? $foundCategory['banner'] ?? $foundCategory['image'] ?? '';
                $pageImage = !empty($imgRaw) ? (strpos($imgRaw, 'http') === 0 ? $imgRaw : "https://backend.tobeque.com/" . ltrim($imgRaw, '/')) : "https://tobeque.com/2bq Logo2.png";
            } else {
                $formattedName = formatSlugToTitle($categorySlug);
                $pageTitle = $formattedName . " Online | Stylish " . $formattedName . " for Girls | Tobeque";
                $pageDesc = "Shop " . strtolower($formattedName) . " at Tobeque, featuring stylish everyday pieces and aesthetic outfits for teens.";
                $pageImage = "https://tobeque.com/2bq Logo2.png";
            }

            $canonicalUrl = "https://tobeque.com" . $parsedUrl;

            $html = preg_replace('#<title>.*?</title>#i', '<title>' . htmlspecialchars($pageTitle) . '</title>', $html);
            $html = preg_replace('#<meta name="description" content=".*?"\s*/?>#i', '<meta name="description" content="' . htmlspecialchars($pageDesc) . '" />', $html);
            $html = preg_replace('#<meta property="og:title" content=".*?"\s*/?>#i', '<meta property="og:title" content="' . htmlspecialchars($pageTitle) . '" />', $html);
            $html = preg_replace('#<meta property="og:description" content=".*?"\s*/?>#i', '<meta property="og:description" content="' . htmlspecialchars($pageDesc) . '" />', $html);
            $html = preg_replace('#<meta property="og:image" content=".*?"\s*/?>#i', '<meta property="og:image" content="' . htmlspecialchars($pageImage) . '" />', $html);
            $html = preg_replace('#<meta property="og:url" content=".*?"\s*/?>#i', '<meta property="og:url" content="' . htmlspecialchars($canonicalUrl) . '" />', $html);
            $html = preg_replace('#<meta name="twitter:title" content=".*?"\s*/?>#i', '<meta name="twitter:title" content="' . htmlspecialchars($pageTitle) . '" />', $html);
            $html = preg_replace('#<meta name="twitter:description" content=".*?"\s*/?>#i', '<meta name="twitter:description" content="' . htmlspecialchars($pageDesc) . '" />', $html);
            $html = preg_replace('#<meta name="twitter:image" content=".*?"\s*/?>#i', '<meta name="twitter:image" content="' . htmlspecialchars($pageImage) . '" />', $html);
            $html = preg_replace('#<link rel="canonical" href=".*?"\s*/?>#i', '<link rel="canonical" href="' . htmlspecialchars($canonicalUrl) . '" />', $html);
        }
    }
    // 2. Check if request is for a Product Detail page: /product-category/{catSlug}/{productSlug}
    else if (preg_match('#^/product-category/([^/]+)/([^/]+)$#i', $parsedUrl, $matches)) {
        $productSlug = strtolower(trim($matches[2]));
        $backendUrl = "https://backend.tobeque.com/api/products/" . urlencode($productSlug);
        $json = fetchApiJson($backendUrl);

        if ($json) {
            $data = json_decode($json, true);
            $product = $data['product'] ?? null;
            if ($product) {
                $pageTitle = ($product['name'] ?? 'Product') . " | Tobeque";
                $pageDesc = !empty($product['description']) ? substr(strip_tags($product['description']), 0, 160) : "Buy " . ($product['name'] ?? 'Product') . " online at Tobeque.";
                $imgRaw = $product['imageSrc'] ?? ($product['images'][0] ?? '');
                $pageImage = !empty($imgRaw) ? (strpos($imgRaw, 'http') === 0 ? $imgRaw : "https://backend.tobeque.com/" . ltrim($imgRaw, '/')) : "https://tobeque.com/2bq Logo2.png";
                $canonicalUrl = "https://tobeque.com" . $parsedUrl;

                $html = preg_replace('#<title>.*?</title>#i', '<title>' . htmlspecialchars($pageTitle) . '</title>', $html);
                $html = preg_replace('#<meta name="description" content=".*?"\s*/?>#i', '<meta name="description" content="' . htmlspecialchars($pageDesc) . '" />', $html);
                $html = preg_replace('#<meta property="og:title" content=".*?"\s*/?>#i', '<meta property="og:title" content="' . htmlspecialchars($pageTitle) . '" />', $html);
                $html = preg_replace('#<meta property="og:description" content=".*?"\s*/?>#i', '<meta property="og:description" content="' . htmlspecialchars($pageDesc) . '" />', $html);
                $html = preg_replace('#<meta property="og:image" content=".*?"\s*/?>#i', '<meta property="og:image" content="' . htmlspecialchars($pageImage) . '" />', $html);
                $html = preg_replace('#<meta property="og:url" content=".*?"\s*/?>#i', '<meta property="og:url" content="' . htmlspecialchars($canonicalUrl) . '" />', $html);
                $html = preg_replace('#<meta name="twitter:title" content=".*?"\s*/?>#i', '<meta name="twitter:title" content="' . htmlspecialchars($pageTitle) . '" />', $html);
                $html = preg_replace('#<meta name="twitter:description" content=".*?"\s*/?>#i', '<meta name="twitter:description" content="' . htmlspecialchars($pageDesc) . '" />', $html);
                $html = preg_replace('#<meta name="twitter:image" content=".*?"\s*/?>#i', '<meta name="twitter:image" content="' . htmlspecialchars($pageImage) . '" />', $html);
                $html = preg_replace('#<link rel="canonical" href=".*?"\s*/?>#i', '<link rel="canonical" href="' . htmlspecialchars($canonicalUrl) . '" />', $html);
            }
        }
    }
    // 3. Check if request is for a single blog post: /blogs/{slug-or-id}
    else if (preg_match('#^/blogs/([^/]+)$#i', $parsedUrl, $matches)) {
        $blogParam = trim($matches[1]);
        $backendUrl = "https://backend.tobeque.com/api/blogs/" . urlencode($blogParam);
        $json = fetchApiJson($backendUrl);

        if ($json) {
            $data = json_decode($json, true);
            $blog = $data['blog'] ?? $data['data'] ?? null;
            if ($blog) {
                $pageTitle = ($blog['metaTitle'] ?? $blog['title'] ?? 'Blog') . " | Tobeque Style Journal";
                $pageDesc = !empty($blog['metaDescription']) ? $blog['metaDescription'] : (!empty($blog['excerpt']) ? $blog['excerpt'] : (!empty($blog['content']) ? substr(strip_tags($blog['content']), 0, 160) : "Read our latest article on Tobeque Style Journal."));
                $imgRaw = $blog['ogImage'] ?? $blog['featuredImage'] ?? $blog['image'] ?? '';
                $pageImage = !empty($imgRaw) ? (strpos($imgRaw, 'http') === 0 ? $imgRaw : "https://backend.tobeque.com/" . ltrim($imgRaw, '/')) : "https://tobeque.com/2bq Logo2.png";
                $canonicalUrl = "https://tobeque.com" . $parsedUrl;

                $html = preg_replace('#<title>.*?</title>#i', '<title>' . htmlspecialchars($pageTitle) . '</title>', $html);
                $html = preg_replace('#<meta name="description" content=".*?"\s*/?>#i', '<meta name="description" content="' . htmlspecialchars($pageDesc) . '" />', $html);
                $html = preg_replace('#<meta property="og:title" content=".*?"\s*/?>#i', '<meta property="og:title" content="' . htmlspecialchars($pageTitle) . '" />', $html);
                $html = preg_replace('#<meta property="og:description" content=".*?"\s*/?>#i', '<meta property="og:description" content="' . htmlspecialchars($pageDesc) . '" />', $html);
                $html = preg_replace('#<meta property="og:image" content=".*?"\s*/?>#i', '<meta property="og:image" content="' . htmlspecialchars($pageImage) . '" />', $html);
                $html = preg_replace('#<meta property="og:url" content=".*?"\s*/?>#i', '<meta property="og:url" content="' . htmlspecialchars($canonicalUrl) . '" />', $html);
                $html = preg_replace('#<meta name="twitter:title" content=".*?"\s*/?>#i', '<meta name="twitter:title" content="' . htmlspecialchars($pageTitle) . '" />', $html);
                $html = preg_replace('#<meta name="twitter:description" content=".*?"\s*/?>#i', '<meta name="twitter:description" content="' . htmlspecialchars($pageDesc) . '" />', $html);
                $html = preg_replace('#<meta name="twitter:image" content=".*?"\s*/?>#i', '<meta name="twitter:image" content="' . htmlspecialchars($pageImage) . '" />', $html);
                $html = preg_replace('#<link rel="canonical" href=".*?"\s*/?>#i', '<link rel="canonical" href="' . htmlspecialchars($canonicalUrl) . '" />', $html);
            }
        }
    }
    // 4. Check for Static Pages (About, Contact, FAQ, Terms, Privacy, Careers, etc.)
    else {
        $cleanPath = trim($parsedUrl, '/');
        $routesMeta = [
            'about-tobeque' => [
                'title' => 'About Tobeque | Teen Fashion Brand for Girls in India',
                'description' => 'Learn about Tobeque, an Indian fashion brand creating stylish, comfortable clothing for teen girls with in-house design and manufacturing in Haryana, India.',
                'keywords' => 'about Tobeque, teen fashion brand India, fashion brand for teen girls, teenage girls clothing brand, girls fashion India, teen clothing brand, Tobeque Haryana'
            ],
            'about-us' => [
                'title' => 'About Tobeque | Teen Fashion Brand for Girls in India',
                'description' => 'Learn about Tobeque, an Indian fashion brand creating stylish, comfortable clothing for teen girls with in-house design and manufacturing in Haryana, India.',
                'keywords' => 'about Tobeque, teen fashion brand India, fashion brand for teen girls, teenage girls clothing brand, girls fashion India, teen clothing brand, Tobeque Haryana',
                'canonical' => 'https://tobeque.com/about-tobeque'
            ],
            'about' => [
                'title' => 'About Tobeque | Teen Fashion Brand for Girls in India',
                'description' => 'Learn about Tobeque, an Indian fashion brand creating stylish, comfortable clothing for teen girls with in-house design and manufacturing in Haryana, India.',
                'keywords' => 'about Tobeque, teen fashion brand India, fashion brand for teen girls, teenage girls clothing brand, girls fashion India, teen clothing brand, Tobeque Haryana',
                'canonical' => 'https://tobeque.com/about-tobeque'
            ],
            'contact' => [
                'title' => 'Contact Tobeque | Teen Girls Fashion Support India',
                'description' => 'Contact Tobeque for help with orders, products, returns, sizing or general questions. Reach our teen girls fashion support team in Haryana, India today.',
                'keywords' => 'contact Tobeque, Tobeque customer support, Tobeque contact details, teen fashion support India, clothing customer service, Tobeque Haryana, order support Tobeque'
            ],
            'privacy-policy' => [
                'title' => 'Privacy Policy | Tobeque Teen Fashion',
                'description' => "Read Tobeque's Privacy Policy to learn how we protect your personal information, data security, and privacy rights when shopping for teen fashion.",
                'keywords' => 'privacy policy, Tobeque privacy, data protection, security'
            ],
            'terms-and-conditions' => [
                'title' => 'Terms & Conditions | Tobeque Teen Fashion',
                'description' => 'Review the Terms & Conditions for shopping at Tobeque online store, including ordering, payment, shipping, and usage terms.',
                'keywords' => 'terms and conditions, Tobeque terms, store policies'
            ],
            'cookie-policy' => [
                'title' => 'Cookie Policy | Tobeque Teen Fashion',
                'description' => 'Learn about how Tobeque uses cookies and similar technologies to enhance your shopping experience and website security.',
                'keywords' => 'cookie policy, Tobeque cookies, tracking policies'
            ],
            'cookie-settings' => [
                'title' => 'Cookie Settings | Tobeque Teen Fashion',
                'description' => 'Manage your cookie settings and privacy preferences at Tobeque.',
                'keywords' => 'cookie settings, privacy preferences, Tobeque cookies'
            ],
            'career' => [
                'title' => 'Careers at Tobeque | Join Our Fashion Team',
                'description' => 'Explore job opportunities and careers at Tobeque. Join our passionate team of designers, marketers, and fashion enthusiasts.',
                'keywords' => 'careers at Tobeque, fashion jobs India, Tobeque hiring'
            ],
            'faq' => [
                'title' => 'Frequently Asked Questions (FAQ) | Tobeque',
                'description' => 'Find quick answers to common questions about orders, shipping, returns, sizing, payment methods, and account settings at Tobeque.',
                'keywords' => 'Tobeque FAQ, order help, shipping questions, sizing guide'
            ],
            'refund-request' => [
                'title' => 'Submit Refund Request | Tobeque',
                'description' => 'Submit a return or refund request for your Tobeque order. Fast, hassle-free 7-day return policy.',
                'keywords' => 'Tobeque return, refund request, 7 day return'
            ],
            'blogs' => [
                'title' => 'Tobeque Style Journal | Teen Fashion Tips & Trends',
                'description' => 'Discover the latest teen fashion tips, outfit ideas, styling guides, and trend updates on the Tobeque Style Journal.',
                'keywords' => 'teen fashion blog, outfit ideas, styling tips, Tobeque journal'
            ],
            'style-journal' => [
                'title' => 'Tobeque Style Journal | Teen Fashion Tips & Trends',
                'description' => 'Discover the latest teen fashion tips, outfit ideas, styling guides, and trend updates on the Tobeque Style Journal.',
                'keywords' => 'teen fashion blog, outfit ideas, styling tips, Tobeque journal',
                'canonical' => 'https://tobeque.com/blogs'
            ],
            'steal-the-style' => [
                'title' => 'Steal The Style | Curated Teen Outfits | Tobeque',
                'description' => 'Get inspired by curated outfits and complete looks designed for teenagers at Tobeque.',
                'keywords' => 'steal the style, outfit inspiration, teen outfits, curated looks'
            ]
        ];

        if (isset($routesMeta[$cleanPath])) {
            $meta = $routesMeta[$cleanPath];
            $pageTitle = $meta['title'];
            $pageDesc = $meta['description'];
            $pageKeywords = $meta['keywords'] ?? '';
            $canonicalUrl = $meta['canonical'] ?? ("https://tobeque.com/" . $cleanPath);

            $html = preg_replace('#<title>.*?</title>#i', '<title>' . htmlspecialchars($pageTitle) . '</title>', $html);
            $html = preg_replace('#<meta name="description" content=".*?"\s*/?>#i', '<meta name="description" content="' . htmlspecialchars($pageDesc) . '" />', $html);
            if ($pageKeywords) {
                if (preg_match('#<meta name="keywords" content=".*?"\s*/?>#i', $html)) {
                    $html = preg_replace('#<meta name="keywords" content=".*?"\s*/?>#i', '<meta name="keywords" content="' . htmlspecialchars($pageKeywords) . '" />', $html);
                } else {
                    $html = str_replace('</head>', '  <meta name="keywords" content="' . htmlspecialchars($pageKeywords) . '" />' . "\n" . '</head>', $html);
                }
            }
            $html = preg_replace('#<meta property="og:title" content=".*?"\s*/?>#i', '<meta property="og:title" content="' . htmlspecialchars($pageTitle) . '" />', $html);
            $html = preg_replace('#<meta property="og:description" content=".*?"\s*/?>#i', '<meta property="og:description" content="' . htmlspecialchars($pageDesc) . '" />', $html);
            $html = preg_replace('#<meta property="og:url" content=".*?"\s*/?>#i', '<meta property="og:url" content="' . htmlspecialchars($canonicalUrl) . '" />', $html);
            $html = preg_replace('#<meta name="twitter:title" content=".*?"\s*/?>#i', '<meta name="twitter:title" content="' . htmlspecialchars($pageTitle) . '" />', $html);
            $html = preg_replace('#<meta name="twitter:description" content=".*?"\s*/?>#i', '<meta name="twitter:description" content="' . htmlspecialchars($pageDesc) . '" />', $html);
            $html = preg_replace('#<link rel="canonical" href=".*?"\s*/?>#i', '<link rel="canonical" href="' . htmlspecialchars($canonicalUrl) . '" />', $html);
        }
    }
} catch (Throwable $e) {
    // Fail-safe: If any PHP exception, network timeout, or SSL issue occurs,
    // silently catch it so the page NEVER returns an HTTP 500 error!
}

// Output HTML response
header('Content-Type: text/html; charset=UTF-8');
echo $html;
