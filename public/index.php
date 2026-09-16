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

// Helper function to format category slug into title
function formatSlugToTitle($slug) {
    $words = explode('-', $slug);
    $words = array_map('ucfirst', $words);
    return implode(' ', $words);
}

// 1. Check if request is for a Product Category page: /product-category/{slug}
if (preg_match('#^/product-category/([^/]+)$#i', $parsedUrl, $matches)) {
    $categorySlug = strtolower(trim($matches[1]));

    if ($categorySlug !== 'all') {
        $backendUrl = "https://backend.tobeque.com/api/categories/public";
        
        $ctx = stream_context_create([
            'http' => [
                'method' => 'GET',
                'timeout' => 2,
                'header' => "User-Agent: TobequeMetaFetcher/1.0\r\n"
            ]
        ]);
        
        $json = @file_get_contents($backendUrl, false, $ctx);
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

    $ctx = stream_context_create([
        'http' => [
            'method' => 'GET',
            'timeout' => 2,
            'header' => "User-Agent: TobequeMetaFetcher/1.0\r\n"
        ]
    ]);

    $json = @file_get_contents($backendUrl, false, $ctx);
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

// Output HTML response
header('Content-Type: text/html; charset=UTF-8');
echo $html;
