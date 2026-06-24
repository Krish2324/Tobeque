export type ProductColor = {
  name: string;
  class: string;
  bgStyle?: React.CSSProperties;
};

export type Product = {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  imageSrc: string;
  hoverImageSrc?: string;
  imageAlt?: string;
  badge?: string;
  badgeClass?: string;
  colors?: string[]; // Simplified colors for general cards
  detailedColors?: ProductColor[]; // Rich colors for product details
  sizes?: string[];
  description?: string;
  fabricCare?: string;
  shippingReturns?: string;
  galleryImages?: string[];
  galleryImageObjects?: { url: string; color?: string }[];
};

export const productsData: Product[] = [
  {
    id: "round-neck-fitted-mesh-top",
    name: "Round Neck Fitted Mesh Top",
    price: "?145.00",
    originalPrice: "?180.00",
    imageSrc: "/src/assets/images/product-mesh-top-1.jpg",
    hoverImageSrc: "/src/assets/images/product-mesh-top-2.jpg",
    imageAlt: "Leopard Print Fitted Mesh Top",
    badge: "New In",
    badgeClass: "bg-primary text-on-primary",
    colors: ["bg-[#8B5A2B]", "bg-primary"],
    detailedColors: [
      {
        name: "LEOPARD",
        class: "bg-[#8B5A2B]",
        bgStyle: {
          backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'><defs><pattern id='leopard' patternUnits='userSpaceOnUse' width='10' height='10'><circle cx='2' cy='2' r='1' fill='%233b2106'/><circle cx='8' cy='7' r='1.5' fill='%233b2106'/><path d='M4,8 Q5,6 7,8' stroke='%233b2106' fill='none'/></pattern></defs><rect width='100%' height='100%' fill='url(%23leopard)'/></svg>\")"
        }
      },
      { name: "BLACK", class: "bg-primary" }
    ],
    sizes: ["XS", "S", "M", "L"],
    description: "A striking fitted top crafted from semi-sheer stretch mesh. Featuring a classic round neckline, long sleeves, and a bold leopard print motif. The piece is designed to contour the body, offering a seamless layering option or a standalone statement piece for evening wear.",
    fabricCare: "92% Polyamide, 8% Elastane. Hand wash cold separately. Do not bleach. Lay flat to dry. Do not iron. Dry clean recommended for best results.",
    shippingReturns: "Orders are processed within 1-2 business days. Returns are accepted within 14 days of delivery for full-priced items in unworn condition with tags attached.",
    galleryImages: [
      "/src/assets/images/product-mesh-top-1.jpg",
      "/src/assets/images/product-mesh-top-2.jpg",
      "/src/assets/images/product-silk-blouse-2.jpg",
      "/src/assets/images/product-rib-top-1.jpg",
      "/src/assets/images/product-strappy-crop-1.jpg",
      "/src/assets/images/product-ribbed-vest-1.jpg"
    ]
  },
  {
    id: "square-neck-rib-top",
    name: "Square Neckline Cut Out Rib Top",
    price: "?120.00",
    imageSrc: "/src/assets/images/product-rib-top-1.jpg",
    hoverImageSrc: "/src/assets/images/product-rib-top-2.jpg",
    imageAlt: "Ribbed knit top",
    colors: ["bg-black", "bg-[#E5E4E2]"],
    detailedColors: [
      { name: "BLACK", class: "bg-primary" },
      { name: "OATMEAL", class: "bg-[#E5E4E2]" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "An elevated rib knit top displaying architectural elegance with a contemporary square neckline and subtle cut-out details. Perfect as a refined layering essential or a chic statement item.",
    fabricCare: "80% Cotton, 20% Silk. Hand wash cold separately. Dry flat.",
    shippingReturns: "Complimentary shipping on orders over ?300. 14-day returns.",
    galleryImages: [
      "/src/assets/images/product-rib-top-1.jpg",
      "/src/assets/images/product-rib-top-2.jpg",
      "/src/assets/images/product-silk-blouse-1.jpg",
      "/src/assets/images/product-silk-blouse-2.jpg"
    ]
  },
  {
    id: "structured-black-blouse",
    name: "Structured Black Blouse",
    price: "?145.00",
    imageSrc: "/src/assets/images/product-rib-top-2.jpg",
    hoverImageSrc: "/src/assets/images/product-rib-top-1.jpg",
    imageAlt: "Structured Black Blouse",
    colors: ["bg-black"],
    detailedColors: [{ name: "BLACK", class: "bg-primary" }],
    sizes: ["XS", "S", "M", "L"],
    description: "A tailored structural masterpiece featuring precise seam lines and structural definition. Gives an iconic profile with refined details.",
    fabricCare: "100% Premium Cotton. Dry clean only.",
    shippingReturns: "Complimentary shipping on orders over ?300. 14-day returns.",
    galleryImages: [
      "/src/assets/images/product-rib-top-2.jpg",
      "/src/assets/images/product-rib-top-1.jpg",
      "/src/assets/images/product-linen-tee-1.jpg",
      "/src/assets/images/product-silk-blouse-2.jpg"
    ]
  },
  {
    id: "cream-silk-slip-dress",
    name: "Cream Silk Slip Dress",
    price: "?220.00",
    imageSrc: "/src/assets/images/product-slip-dress-1.jpg",
    hoverImageSrc: "/src/assets/images/product-slip-dress-2.jpg",
    imageAlt: "Cream Silk Slip Dress",
    colors: ["bg-[#FFFDD0]"],
    detailedColors: [{ name: "CREAM", class: "bg-[#FFFDD0]" }],
    sizes: ["XS", "S", "M", "L"],
    description: "Flowing luxury silk slip dress boasting a delicate draping shape and an exquisite layout.",
    fabricCare: "100% Silk. Hand wash cold separately.",
    shippingReturns: "Complimentary shipping on orders over ?300. 14-day returns.",
    galleryImages: [
      "/src/assets/images/product-slip-dress-1.jpg",
      "/src/assets/images/product-slip-dress-2.jpg",
      "/src/assets/images/product-sheer-top-1.jpg",
      "/src/assets/images/product-slip-dress-3.jpg"
    ]
  },
  {
    id: "classic-poplin-shirt",
    name: "Classic Poplin Shirt",
    price: "?95.00",
    imageSrc: "/src/assets/images/product-poplin-shirt-1.jpg",
    hoverImageSrc: "/src/assets/images/product-denim-1.jpg",
    imageAlt: "Classic Poplin Shirt",
    colors: ["bg-white"],
    detailedColors: [{ name: "WHITE", class: "bg-white" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Crisp white poplin shirt with architectural details, perfect for professional styling.",
    fabricCare: "95% Cotton, 5% Elastane. Machine wash cold.",
    shippingReturns: "Complimentary shipping on orders over ?300. 14-day returns.",
    galleryImages: [
      "/src/assets/images/product-poplin-shirt-1.jpg",
      "/src/assets/images/product-denim-1.jpg",
      "/src/assets/images/product-poplin-shirt-2.jpg",
      "/src/assets/images/product-poplin-shirt-1.jpg"
    ]
  },
  {
    id: "fine-knit-linen-tee",
    name: "Fine Knit Linen Tee",
    price: "?65.00",
    imageSrc: "/src/assets/images/product-slip-dress-2.jpg",
    hoverImageSrc: "/src/assets/images/product-slip-dress-1.jpg",
    imageAlt: "Fine Knit Linen Tee",
    colors: ["bg-[#E5E4E2]"],
    detailedColors: [{ name: "OATMEAL", class: "bg-[#E5E4E2]" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Premium light-knit linen tee designed for relaxed everyday comfort.",
    fabricCare: "100% Linen. Hand wash cold separately. Dry flat.",
    shippingReturns: "Complimentary shipping on orders over ?300. 14-day returns.",
    galleryImages: [
      "/src/assets/images/product-slip-dress-2.jpg",
      "/src/assets/images/product-slip-dress-1.jpg",
      "/src/assets/images/product-linen-tee-1.jpg",
      "/src/assets/images/product-slip-dress-2.jpg"
    ]
  },
  {
    id: "vintage-straight-denim",
    name: "Vintage Wash Straight Denim",
    price: "?110.00",
    imageSrc: "/src/assets/images/product-denim-1.jpg",
    hoverImageSrc: "/src/assets/images/product-poplin-shirt-1.jpg",
    imageAlt: "Vintage Wash Straight Denim",
    colors: ["bg-[#4682B4]"],
    detailedColors: [{ name: "MID-BLUE", class: "bg-[#4682B4]" }],
    sizes: ["24", "25", "26", "27", "28", "29", "30"],
    description: "Classic straight-leg cut denim in a gorgeous vintage-inspired mid-blue wash.",
    fabricCare: "99% Cotton, 1% Elastane. Machine wash warm with like colors.",
    shippingReturns: "Complimentary shipping on orders over ?300. 14-day returns.",
    galleryImages: [
      "/src/assets/images/product-denim-1.jpg",
      "/src/assets/images/product-poplin-shirt-1.jpg",
      "/src/assets/images/product-denim-2.jpg",
      "/src/assets/images/product-denim-1.jpg"
    ]
  },
  {
    id: "architectural-silk-blouse",
    name: "Architectural Silk Blouse",
    price: "?345.00",
    imageSrc: "/src/assets/images/product-silk-blouse-1.jpg",
    hoverImageSrc: "/src/assets/images/product-silk-blouse-2.jpg",
    badge: "New Arrival",
    badgeClass: "bg-primary text-on-primary",
    colors: ["bg-black", "bg-white"],
    detailedColors: [
      { name: "BLACK", class: "bg-primary" },
      { name: "WHITE", class: "bg-white" }
    ],
    sizes: ["XS", "S", "M", "L"],
    description: "An elegant architectural silk blouse, designed to offer refined style and clean draping silhouettes.",
    fabricCare: "100% Pure Silk. Dry clean only.",
    shippingReturns: "Complimentary shipping on orders over ?300. 14-day returns.",
    galleryImages: [
      "/src/assets/images/product-silk-blouse-1.jpg",
      "/src/assets/images/product-silk-blouse-2.jpg",
      "/src/assets/images/product-poplin-shirt-1.jpg",
      "/src/assets/images/product-silk-blouse-1.jpg"
    ]
  },
  {
    id: "ruched-sheer-print-top",
    name: "Ruched Sheer Print Top",
    price: "?285.00",
    imageSrc: "/src/assets/images/product-sheer-top-2.jpg",
    hoverImageSrc: "/src/assets/images/product-sheer-top-1.jpg",
    colors: ["bg-[#8B5A2B]"],
    detailedColors: [{ name: "BROWN PRINT", class: "bg-[#8B5A2B]" }],
    sizes: ["XS", "S", "M", "L"],
    description: "Ruched sheer print top featuring high quality materials and an exquisite form-fitting layout.",
    fabricCare: "90% Nylon, 10% Spandex. Hand wash cold.",
    shippingReturns: "Complimentary shipping on orders over ?300. 14-day returns.",
    galleryImages: [
      "/src/assets/images/product-sheer-top-2.jpg",
      "/src/assets/images/product-sheer-top-1.jpg",
      "/src/assets/images/product-sheer-top-2.jpg",
      "/src/assets/images/product-sheer-top-1.jpg"
    ]
  },
  {
    id: "essential-strappy-crop",
    name: "Essential Strappy Crop",
    price: "?145.00",
    imageSrc: "/src/assets/images/product-strappy-crop-1.jpg",
    hoverImageSrc: "/src/assets/images/product-rib-top-2.jpg",
    badge: "Best Selling",
    badgeClass: "bg-surface-container-high text-primary",
    colors: ["bg-[#CC0000]", "bg-black"],
    detailedColors: [
      { name: "RED", class: "bg-[#CC0000]" },
      { name: "BLACK", class: "bg-primary" }
    ],
    sizes: ["XS", "S", "M", "L"],
    description: "An absolute essential strappy crop top crafted to contour and fit perfectly with any modern ensemble.",
    fabricCare: "95% Cotton, 5% Spandex. Hand wash cold.",
    shippingReturns: "Complimentary shipping on orders over ?300. 14-day returns.",
    galleryImages: [
      "/src/assets/images/product-strappy-crop-1.jpg",
      "/src/assets/images/product-rib-top-2.jpg",
      "/src/assets/images/product-rib-top-1.jpg",
      "/src/assets/images/product-strappy-crop-1.jpg"
    ]
  },
  {
    id: "eyelet-ribbed-vest",
    name: "Eyelet Ribbed Vest",
    price: "?185.00",
    imageSrc: "/src/assets/images/product-ribbed-vest-1.jpg",
    hoverImageSrc: "/src/assets/images/product-rib-top-1.jpg",
    colors: ["bg-black"],
    detailedColors: [{ name: "BLACK", class: "bg-primary" }],
    sizes: ["XS", "S", "M", "L"],
    description: "Premium eyelet ribbed vest featuring high quality textures and comfortable wear.",
    fabricCare: "90% Cotton, 10% Polyester. Machine wash cold.",
    shippingReturns: "Complimentary shipping on orders over ?300. 14-day returns.",
    galleryImages: [
      "/src/assets/images/product-ribbed-vest-1.jpg",
      "/src/assets/images/product-rib-top-1.jpg",
      "/src/assets/images/product-rib-top-2.jpg",
      "/src/assets/images/product-ribbed-vest-1.jpg"
    ]
  },
  {
    id: "asymmetric-fine-knit",
    name: "Asymmetric Fine Knit",
    price: "?295.00",
    imageSrc: "/src/assets/images/product-fine-knit-1.jpg",
    hoverImageSrc: "/src/assets/images/product-slip-dress-2.jpg",
    badge: "New Arrival",
    badgeClass: "bg-primary text-on-primary",
    colors: ["bg-white", "bg-[#E5E4E2]"],
    detailedColors: [
      { name: "WHITE", class: "bg-white" },
      { name: "OATMEAL", class: "bg-[#E5E4E2]" }
    ],
    sizes: ["XS", "S", "M", "L"],
    description: "An asymmetric fine knit top showing sophisticated modern draping and an artistic flair.",
    fabricCare: "85% Viscose, 15% Nylon. Dry clean recommended.",
    shippingReturns: "Complimentary shipping on orders over ?300. 14-day returns.",
    galleryImages: [
      "/src/assets/images/product-fine-knit-1.jpg",
      "/src/assets/images/product-slip-dress-2.jpg",
      "/src/assets/images/product-slip-dress-1.jpg",
      "/src/assets/images/product-fine-knit-1.jpg"
    ]
  },
  
  /* Accessory and Carousel items to enable 100% complete routing */
  {
    id: "high-waisted-tailored-trousers",
    name: "High-Waisted Tailored Trousers",
    price: "?195.00",
    imageSrc: "/src/assets/images/product-trousers-1.jpg",
    hoverImageSrc: "/src/assets/images/product-rib-top-2.jpg",
    colors: ["bg-black"],
    detailedColors: [{ name: "BLACK", class: "bg-primary" }],
    sizes: ["XS", "S", "M", "L"],
    description: "High-waisted tailored trousers designed with a perfect structural drape to match refined evening tops.",
    fabricCare: "95% Wool, 5% Elastane. Dry clean only.",
    shippingReturns: "Complimentary shipping on orders over ?300. 14-day returns.",
    galleryImages: [
      "/src/assets/images/product-trousers-1.jpg",
      "/src/assets/images/product-rib-top-2.jpg"
    ]
  },
  {
    id: "structured-mini-leather-tote",
    name: "Structured Mini Leather Tote",
    price: "?320.00",
    imageSrc: "/src/assets/images/product-slip-dress-1.jpg",
    hoverImageSrc: "/src/assets/images/product-slip-dress-2.jpg",
    colors: ["bg-black"],
    detailedColors: [{ name: "BLACK", class: "bg-primary" }],
    sizes: ["O/S"],
    description: "A gorgeous structured mini tote made from 100% fine Italian calfskin leather.",
    fabricCare: "Treat with specialized leather conditioner.",
    shippingReturns: "Complimentary shipping on orders over ?300. 14-day returns.",
    galleryImages: [
      "/src/assets/images/product-slip-dress-1.jpg",
      "/src/assets/images/product-slip-dress-2.jpg"
    ]
  },
  {
    id: "oversized-wool-blend-blazer",
    name: "Oversized Wool Blend Blazer",
    price: "?295.00",
    originalPrice: "?370.00",
    imageSrc: "/src/assets/images/product-blazer-1.jpg",
    hoverImageSrc: "/src/assets/images/product-silk-blouse-1.jpg",
    colors: ["bg-gray-800"],
    detailedColors: [{ name: "CHARCOAL", class: "bg-gray-800" }],
    sizes: ["XS", "S", "M", "L"],
    description: "An oversized double-breasted charcoal wool blend blazer with precise shoulder framing.",
    fabricCare: "Dry clean only.",
    shippingReturns: "Complimentary shipping on orders over ?300. 14-day returns.",
    galleryImages: [
      "/src/assets/images/product-blazer-1.jpg",
      "/src/assets/images/product-silk-blouse-1.jpg"
    ]
  },
  {
    id: "minimalist-strappy-sandal",
    name: "Minimalist Strappy Sandal",
    price: "?185.00",
    imageSrc: "/src/assets/images/product-sandal-1.jpg",
    hoverImageSrc: "/src/assets/images/product-poplin-shirt-1.jpg",
    colors: ["bg-black"],
    detailedColors: [{ name: "BLACK", class: "bg-primary" }],
    sizes: ["36", "37", "38", "39", "40"],
    description: "Sleek, minimalist black leather strappy sandals with a comfortable fine heel.",
    fabricCare: "Wipe clean with soft leather cloth.",
    shippingReturns: "Complimentary shipping on orders over ?300. 14-day returns.",
    galleryImages: [
      "/src/assets/images/product-sandal-1.jpg",
      "/src/assets/images/product-poplin-shirt-1.jpg"
    ]
  },
  {
    id: "sheer-panelled-bodysuit",
    name: "Sheer Panelled Bodysuit",
    price: "?120.00",
    imageSrc: "/src/assets/images/product-bodysuit-1.jpg",
    hoverImageSrc: "/src/assets/images/product-sheer-top-1.jpg",
    colors: ["bg-black"],
    detailedColors: [{ name: "BLACK", class: "bg-primary" }],
    sizes: ["XS", "S", "M", "L"],
    description: "High-contrast sheer black panelled bodysuit styling, incredibly sleek and comfortable.",
    fabricCare: "Hand wash cold. Lay flat to dry.",
    shippingReturns: "Complimentary shipping on orders over ?300. 14-day returns.",
    galleryImages: [
      "/src/assets/images/product-bodysuit-1.jpg",
      "/src/assets/images/product-sheer-top-1.jpg"
    ]
  },
  {
    id: "asymmetric-polka-dot-slip-dress",
    name: "Asymmetric Polka Dot Slip Dress",
    price: "?210.00",
    imageSrc: "/src/assets/images/product-polka-dress-1.jpg",
    hoverImageSrc: "/src/assets/images/product-sheer-top-2.jpg",
    colors: ["bg-[#8B5A2B]"],
    detailedColors: [{ name: "POLKA DOT", class: "bg-[#8B5A2B]" }],
    sizes: ["XS", "S", "M", "L"],
    description: "An elegant asymmetrical slip dress displaying a dark brown and cream polka dot motif.",
    fabricCare: "Dry clean recommended.",
    shippingReturns: "Complimentary shipping on orders over ?300. 14-day returns.",
    galleryImages: [
      "/src/assets/images/product-polka-dress-1.jpg",
      "/src/assets/images/product-sheer-top-2.jpg"
    ]
  },
  {
    id: "cut-out-ribbed-knit-top",
    name: "Cut-Out Ribbed Knit Top",
    price: "?135.00",
    imageSrc: "/src/assets/images/product-cutout-knit-1.jpg",
    hoverImageSrc: "/src/assets/images/product-ribbed-vest-1.jpg",
    colors: ["bg-black"],
    detailedColors: [{ name: "BLACK", class: "bg-primary" }],
    sizes: ["XS", "S", "M", "L"],
    description: "Striking black ribbed knit top featuring bold architectural cut-outs.",
    fabricCare: "Hand wash cold. Lay flat to dry.",
    shippingReturns: "Complimentary shipping on orders over ?300. 14-day returns.",
    galleryImages: [
      "/src/assets/images/product-cutout-knit-1.jpg",
      "/src/assets/images/product-ribbed-vest-1.jpg"
    ]
  },
  {
    id: "draped-chiffon-mini-dress",
    name: "Draped Chiffon Mini Dress",
    price: "?245.00",
    imageSrc: "/src/assets/images/product-slip-dress-3.jpg",
    hoverImageSrc: "/src/assets/images/product-fine-knit-1.jpg",
    colors: ["bg-[#add8e6]"],
    detailedColors: [{ name: "LIGHT BLUE", class: "bg-[#add8e6]" }],
    sizes: ["XS", "S", "M", "L"],
    description: "Feminine, ethereal draped chiffon mini dress with delicate dot patterning.",
    fabricCare: "Dry clean only.",
    shippingReturns: "Complimentary shipping on orders over ?300. 14-day returns.",
    galleryImages: [
      "/src/assets/images/product-slip-dress-3.jpg",
      "/src/assets/images/product-fine-knit-1.jpg"
    ]
  }
];

export function getProductById(id: string | number | undefined): Product | undefined {
  if (!id) return undefined;
  const cleanId = String(id).split("-col-")[0];
  return productsData.find((p) => p.id === cleanId);
}
