export interface JournalEntry {
  id: number;
  tag: string;
  title: string;
  image: string | null;
  order?: "title-first" | "image-first";
  excerpt?: string;
  readTime: string;
  isFeatured?: boolean;
  
  // Detail page fields
  author: string;
  date: string;
  content: string[]; // Array of paragraphs for the mock body content
  tags: string[];
}

export const journalEntries: JournalEntry[] = [
  {
    id: 1,
    tag: "FASHION",
    title: "Trendy Fashion Guide: Clothing for Teens and Stylish Outfit Ideas for Girls",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop&q=80",
    order: "title-first",
    excerpt: "Discover the latest essential pieces that are defining this season's teenage fashion landscape, blending comfort with undeniable style.",
    readTime: "4 MIN READ",
    isFeatured: true,
    author: "Tobeque",
    date: "February 23, 2026",
    content: [
      "Fashion is an ever-evolving form of self-expression, and for teenagers, it's a vital part of defining their identity. The modern teenage fashion landscape is a vibrant mix of comfort, bold statements, and a nod to retro aesthetics.",
      "This season, we are seeing a huge resurgence of oversized silhouettes mixed with tailored pieces. Think baggy denim paired with fitted crop tops, or chunky sneakers complementing a flowy summer dress. It's all about balance and finding what makes you feel confident.",
      "Accessories are playing a more crucial role than ever. Layered necklaces, statement belts, and colorful mini-bags can instantly elevate a simple outfit into something runway-ready. Don't be afraid to experiment with textures and colors."
    ],
    tags: ["Fashion", "Teens", "Trendy", "Outfit Ideas"]
  },
  {
    id: 2,
    tag: "FASHION",
    title: "Summer Party Wear: Trendy Summer Outfits for Teen Girls & Women",
    image: "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=800&auto=format&fit=crop&q=80",
    order: "title-first",
    readTime: "3 MIN READ",
    author: "Tobeque",
    date: "February 20, 2026",
    content: [
      "When the temperature rises, so does the need for a wardrobe that is both breathable and stylish. Summer parties call for outfits that allow you to dance the night away without compromising on your look.",
      "Lightweight fabrics like linen and cotton blends are your best friends. A chic slip dress in a vibrant summer hue, or a coordinated two-piece set, can be the perfect choice for a sunset gathering.",
      "Pair your summer looks with strappy sandals or comfortable espadrilles, and finish off with minimalist jewelry to keep the vibe effortless and fresh."
    ],
    tags: ["Summer", "Party", "Women", "Teens", "Fashion"]
  },
  {
    id: 4,
    tag: "AESTHETIC LOOK",
    title: "Aesthetic Outfits for Teens — Trendy & Stylish Aesthetic Teen Wear",
    image: "https://images.unsplash.com/photo-1550614000-4b95d466e01d?w=800&auto=format&fit=crop&q=80",
    order: "image-first",
    readTime: "5 MIN READ",
    author: "Tobeque",
    date: "February 18, 2026",
    content: [
      "The 'aesthetic' movement is more than just clothes; it's a vibe. Whether you lean towards Y2K, cottagecore, grunge, or soft girl aesthetics, there's a unique style language to explore.",
      "Curating an aesthetic wardrobe means focusing on key staple pieces that can be mixed and matched. High-waisted jeans, vintage band tees, chunky boots, and delicate cardigans are often essential building blocks.",
      "The true beauty of aesthetic fashion lies in personalization. It's about taking inspiration from internet subcultures and making them your own through DIY modifications, thrifted finds, and creative layering."
    ],
    tags: ["Aesthetic", "Style", "Teens", "Y2K", "Vintage"]
  },
  {
    id: 3,
    tag: "LATEST TREND",
    title: "Get Ready to Glow: Tobeque's Most Exciting Launch Is Coming Soon!",
    image: "https://images.unsplash.com/photo-1434389678232-0268149e917d?w=800&auto=format&fit=crop&q=80",
    order: "title-first",
    readTime: "2 MIN READ",
    author: "Tobeque Team",
    date: "February 15, 2026",
    content: [
      "We've been keeping a secret, and we can finally start dropping hints! Tobeque is gearing up for our most exciting launch of the year. This upcoming collection is designed to make you stand out and shine.",
      "Drawing inspiration from the dynamic energy of city nights and the serene beauty of the golden hour, this collection features unique fabrics, bold cuts, and a color palette that is sure to turn heads.",
      "Stay tuned to our social media channels for sneak peeks, behind-the-scenes looks, and the official launch date. You won't want to miss this!"
    ],
    tags: ["Launch", "New Collection", "Tobeque", "Latest Trend"]
  },
  {
    id: 5,
    tag: "FASHION",
    title: "Retro Party Outfit Ideas for Teen Girls - Create the Perfect Retro Party Look",
    image: "https://images.unsplash.com/photo-1549420088-37c229787ce9?w=800&auto=format&fit=crop&q=80",
    order: "title-first",
    readTime: "4 MIN READ",
    author: "Tobeque",
    date: "February 12, 2026",
    content: [
      "Retro themes are always a hit for parties. Whether it's a 70s disco night or an 80s neon bash, dressing the part is half the fun.",
      "For a groovy 70s look, opt for flared pants, platform shoes, and psychedelic prints. Don't forget the oversized sunglasses and hoop earrings to complete the ensemble.",
      "If you're channeling the 80s, embrace bold colors, shoulder pads, and metallic fabrics. Teased hair and dramatic makeup are highly encouraged for that authentic vintage vibe."
    ],
    tags: ["Retro", "Party", "Vintage", "Fashion", "Ideas"]
  },
  {
    id: 6,
    tag: "OUTFIT IDEAS",
    title: "Trendy Dresses for Teens: Stylish & Cute Outfit Ideas for Every Occasion",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80",
    order: "title-first",
    readTime: "6 MIN READ",
    author: "Tobeque",
    date: "February 10, 2026",
    content: [
      "A great dress is a versatile staple in any teen's wardrobe. From casual hangouts to formal school events, having the right dress can make getting ready a breeze.",
      "For everyday wear, wrap dresses and simple A-line silhouettes are comfortable and effortlessly stylish. Pair them with white sneakers for a relaxed, modern look.",
      "When the occasion calls for something more dressed up, explore midi dresses in floral prints or elegant slip dresses. Remember to accessorize according to the event's vibe."
    ],
    tags: ["Dresses", "Outfit Ideas", "Teens", "Cute", "Stylish"]
  },
  {
    id: 7,
    tag: "OUTFIT IDEAS",
    title: "Dresses for Teens — Trendy, Cute & Perfect for Every Occasion",
    image: "https://images.unsplash.com/photo-1520637102912-2df6bb2aec6d?w=800&auto=format&fit=crop&q=80",
    order: "title-first",
    readTime: "3 MIN READ",
    author: "Tobeque",
    date: "February 08, 2026",
    content: [
      "Finding the perfect dress that balances 'cute' and 'trendy' can sometimes be a challenge. But once you find those go-to pieces, they become instant favorites.",
      "We love the versatility of a good skater dress. It flatters almost every body type and can be dressed up with heels or dressed down with a denim jacket and boots.",
      "Don't shy away from experimenting with patterns. Polka dots, subtle animal prints, and classic stripes are timeless choices that add personality to your look."
    ],
    tags: ["Dresses", "Teens", "Fashion", "Outfit Ideas"]
  },
  {
    id: 8,
    tag: "OUTFIT IDEAS",
    title: "Stylish Outfits for Teens — Trendy Fashion Picks for Modern Teenage Girls",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&auto=format&fit=crop&q=80",
    order: "title-first",
    readTime: "4 MIN READ",
    author: "Tobeque",
    date: "February 05, 2026",
    content: [
      "Modern teenage fashion is all about breaking rules and setting new ones. It's a blend of streetwear influences and high-fashion elements translated into everyday wear.",
      "Cargo pants and utility jackets are making a massive comeback, offering both style and functionality. Pair them with fitted basics to maintain a flattering silhouette.",
      "The key to mastering modern style is confidence. Wear what makes you feel powerful, whether that's a monochromatic athleisure set or a bold, colorful statement piece."
    ],
    tags: ["Stylish", "Teens", "Modern", "Fashion Picks"]
  },
  {
    id: 9,
    tag: "OUTFIT IDEAS",
    title: "Dresses for Women — Elegant, Trendy & Perfect for Every Occasion",
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&auto=format&fit=crop&q=80",
    order: "title-first",
    readTime: "5 MIN READ",
    author: "Tobeque",
    date: "February 01, 2026",
    content: [
      "Elegance never goes out of style. While trends come and go, investing in classic dress silhouettes ensures you always have something beautiful to wear.",
      "The Little Black Dress (LBD) remains an undisputed champion. Look for subtle modern updates like interesting necklines or unexpected textures to keep it feeling fresh.",
      "For daytime elegance, consider midi-length shirt dresses. They offer a polished look that is perfectly acceptable for both a brunch date and a casual Friday at the office."
    ],
    tags: ["Women", "Dresses", "Elegant", "Outfit Ideas"]
  }
];

export const journalCategories = [
  { name: "Aesthetic Look", count: 1 },
  { name: "Casual Look", count: 1 },
  { name: "Fashion", count: 10 },
  { name: "Latest Trend", count: 8 },
  { name: "Outfit Ideas", count: 10 },
  { name: "Summer Look", count: 3 },
  { name: "Young Style", count: 4 },
];
