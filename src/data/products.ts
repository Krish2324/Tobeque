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
};

export const productsData: Product[] = [
  {
    id: "round-neck-fitted-mesh-top",
    name: "Round Neck Fitted Mesh Top",
    price: "$145.00",
    originalPrice: "$180.00",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBq3yWDEKEuHj_3yMeJQRiiv2SOHkiFSNFbDbPaD4plnyYCV1Fy3koAB4p4drJNJ_ncleZ3WKZ8CzmjHAoqTzqT87Zqs0i3xiQsi0SnzD2nQYlHeZkxdC1revQwc6JRE8iWFK5aoy_WwKlPswjjBvvdHIcdwW5Wdlz9q9NYGrATvRMz6fK4gIHptPZNR2GxrF0oeR3vWW0BTHNcApI3OBTcTKZt-NV5rk2gHGNvNVHJRQzOh5YRLrKHs4D2iL8Eg9c-YSGOkvcTlA",
    hoverImageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXJ4gNYZWUhbmHM6ez61GTWr_Gv9sDoGBCsvJETMB6GRMr-u4bK03rS3gnw3c2uznEm8P7CKKXVv4HZl7S0KjioYKg3YwqKyMXJMiaUCGXDXCKMwrg2lQNA12Z33wSpI8j3vgdcocjkjTIQJtU5t_TTR8EHWe99aVjdaao-4Cr9-JEbN-SuAcnYugRxC4rSKwiVE7uTk8S8Ojo2YS1buMdP8NJ7sscjv_fZPs_qsCLhHCyxgp37FilSQe3BCBiCgwZWb17kf7h_w",
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
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBq3yWDEKEuHj_3yMeJQRiiv2SOHkiFSNFbDbPaD4plnyYCV1Fy3koAB4p4drJNJ_ncleZ3WKZ8CzmjHAoqTzqT87Zqs0i3xiQsi0SnzD2nQYlHeZkxdC1revQwc6JRE8iWFK5aoy_WwKlPswjjBvvdHIcdwW5Wdlz9q9NYGrATvRMz6fK4gIHptPZNR2GxrF0oeR3vWW0BTHNcApI3OBTcTKZt-NV5rk2gHGNvNVHJRQzOh5YRLrKHs4D2iL8Eg9c-YSGOkvcTlA",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCXJ4gNYZWUhbmHM6ez61GTWr_Gv9sDoGBCsvJETMB6GRMr-u4bK03rS3gnw3c2uznEm8P7CKKXVv4HZl7S0KjioYKg3YwqKyMXJMiaUCGXDXCKMwrg2lQNA12Z33wSpI8j3vgdcocjkjTIQJtU5t_TTR8EHWe99aVjdaao-4Cr9-JEbN-SuAcnYugRxC4rSKwiVE7uTk8S8Ojo2YS1buMdP8NJ7sscjv_fZPs_qsCLhHCyxgp37FilSQe3BCBiCgwZWb17kf7h_w",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDsaRw0f02Iq9lpELWsvP_wyZCEF5tNcZ4R5rvF-yP2LUcO30yKPV8kdULpqtCVapMlHCm1nstGnVEolXj8YaObHg4kzpU_xFnSu-wmI-AyZHz_NQ3fw0b5xKW5DePy_N4KzLHEfn3Fszl8I2fbcyC4JZNfwm74fTFTvFB754LbsUGMiYyEn4JZNm6Z2iBGa2lRamko2jIM-Yx54uUyO9kqF1P1ydp6qICZCu2CL1J2dfVVfSy-5Syw2bYvdUz21z9Nac9kHXZ32g",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuALpNq8IOkZqXNhTZ0WFVlHCjZjVi29o6wYONdI1cbUXsDa92sWy22Tt6yBBbEajzJYrOHaGvMBUaG3u3C7khCwFS7TTKFm4tzAu62npYA3P5TlD_V4n923KxOh4JUa5M8lcWel1sI7H0vtjxapAMm9clcZPUbs3PQj-LbwS48V19P-7ZQEaWu39cKq11TAlMH80rbUSbSLmzbO5E3zqVr_kIPgwRDHt5RJTya9UBddlL-vRX31ivlLnt6nX7TI10BENjkEuL7ZUg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCxDPECrTpuD3l-RoQh7OtmG28zJGpu_fCGkREbxQ6Bgk5K-rrZ7k7Rj9Kb9nMoaMgu8Fyoo8fr9FAh3kpIu9cEd57P8OpSp0LT7WpGB-YgtN98--xdpEwmPLZonTy58378K_JewmpBmJ3JQHN8Er063uQPkf8PdIOH-468f7EoTkstqJN4OejW9lVdnLbLSM14OGVOpPDLxGEcb4KD5W_CDIyKo-rj6Uucn2CEvLnLTd5yzFEr26MbqKEk3JU8x5PHT9-BOrb8xQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD_13SVzA0Btgp6wy_k2t4K1J_IPcLbRWpNxiWt54dpdo5ZdgB5D4cXZFj4DhCgWLA-nOFwANSOoO7Nj0EiF_IEbb-0q-AWY6oK-Utf0h2Pgt1pUEOE704FspDrtMvvzUnq-k0Z_uFGIwclnU_iNHxE_H8kfqbusWNk6SMIfXZMwoEsbRihHLd6vXfGvlK_iVLvy8ZwdVoSMLIVE4joHYFOWthLYk1zuMys1CqL0eTymWgnvcsIw1qu_R6sKSxpSpI6xTc6nrnlBQ"
    ]
  },
  {
    id: "square-neck-rib-top",
    name: "Square Neckline Cut Out Rib Top",
    price: "$120.00",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuALpNq8IOkZqXNhTZ0WFVlHCjZjVi29o6wYONdI1cbUXsDa92sWy22Tt6yBBbEajzJYrOHaGvMBUaG3u3C7khCwFS7TTKFm4tzAu62npYA3P5TlD_V4n923KxOh4JUa5M8lcWel1sI7H0vtjxapAMm9clcZPUbs3PQj-LbwS48V19P-7ZQEaWu39cKq11TAlMH80rbUSbSLmzbO5E3zqVr_kIPgwRDHt5RJTya9UBddlL-vRX31ivlLnt6nX7TI10BENjkEuL7ZUg",
    hoverImageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdnFD8OB8k4gQgVfWnNxIDf4bd3n9x5Rd-NGJpEJjpwZxeW6VUNgebYchAebxqC5gxQXIoaPB1Dx_r2-m6aqfmDUPZa3CFHNMXU98f1YQbsaFuc1Egx8dxsYb-spM3D678AxH7-iLTX5u7I_PAYWThQWoU3p5Knj4GVlqXchVSXBxWM8SkpdHNNQF60oiWIA-u-cIO3KrZjy0QwlFDPVH4RQUPraDyJkPnSSQUVGnSt2m3CDTOe-6peNPoog4RBc_RMFgXCLywQQ",
    imageAlt: "Ribbed knit top",
    colors: ["bg-black", "bg-[#E5E4E2]"],
    detailedColors: [
      { name: "BLACK", class: "bg-primary" },
      { name: "OATMEAL", class: "bg-[#E5E4E2]" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "An elevated rib knit top displaying architectural elegance with a contemporary square neckline and subtle cut-out details. Perfect as a refined layering essential or a chic statement item.",
    fabricCare: "80% Cotton, 20% Silk. Hand wash cold separately. Dry flat.",
    shippingReturns: "Complimentary shipping on orders over $300. 14-day returns.",
    galleryImages: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuALpNq8IOkZqXNhTZ0WFVlHCjZjVi29o6wYONdI1cbUXsDa92sWy22Tt6yBBbEajzJYrOHaGvMBUaG3u3C7khCwFS7TTKFm4tzAu62npYA3P5TlD_V4n923KxOh4JUa5M8lcWel1sI7H0vtjxapAMm9clcZPUbs3PQj-LbwS48V19P-7ZQEaWu39cKq11TAlMH80rbUSbSLmzbO5E3zqVr_kIPgwRDHt5RJTya9UBddlL-vRX31ivlLnt6nX7TI10BENjkEuL7ZUg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBdnFD8OB8k4gQgVfWnNxIDf4bd3n9x5Rd-NGJpEJjpwZxeW6VUNgebYchAebxqC5gxQXIoaPB1Dx_r2-m6aqfmDUPZa3CFHNMXU98f1YQbsaFuc1Egx8dxsYb-spM3D678AxH7-iLTX5u7I_PAYWThQWoU3p5Knj4GVlqXchVSXBxWM8SkpdHNNQF60oiWIA-u-cIO3KrZjy0QwlFDPVH4RQUPraDyJkPnSSQUVGnSt2m3CDTOe-6peNPoog4RBc_RMFgXCLywQQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBCO8Mb197hOQXHE0vT2zdMgkKohLfyREu4D1oDBj_aDghFEHjl3IfHlF1VIFPj7BpOp4BeHUiQFanVuGTCcrN4RYqRQ4jcYX-zEwRRRYp0f7ZhC63V6h8oMwCE8q5WtLQM8tgByxjPHKdIoyh-v0EjJe-649d6b6Zx4t_hLNikrV2kbftSwXuKm1I5BcKZUk57NWXHz2x2qARLoDrw_oIelq_NlS6Sl-EhWVAyfDZTNNEp18TUIMDLzDc_NRK0iDPcWKm8BPIldA",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDsaRw0f02Iq9lpELWsvP_wyZCEF5tNcZ4R5rvF-yP2LUcO30yKPV8kdULpqtCVapMlHCm1nstGnVEolXj8YaObHg4kzpU_xFnSu-wmI-AyZHz_NQ3fw0b5xKW5DePy_N4KzLHEfn3Fszl8I2fbcyC4JZNfwm74fTFTvFB754LbsUGMiYyEn4JZNm6Z2iBGa2lRamko2jIM-Yx54uUyO9kqF1P1ydp6qICZCu2CL1J2dfVVfSy-5Syw2bYvdUz21z9Nac9kHXZ32g"
    ]
  },
  {
    id: "structured-black-blouse",
    name: "Structured Black Blouse",
    price: "$145.00",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdnFD8OB8k4gQgVfWnNxIDf4bd3n9x5Rd-NGJpEJjpwZxeW6VUNgebYchAebxqC5gxQXIoaPB1Dx_r2-m6aqfmDUPZa3CFHNMXU98f1YQbsaFuc1Egx8dxsYb-spM3D678AxH7-iLTX5u7I_PAYWThQWoU3p5Knj4GVlqXchVSXBxWM8SkpdHNNQF60oiWIA-u-cIO3KrZjy0QwlFDPVH4RQUPraDyJkPnSSQUVGnSt2m3CDTOe-6peNPoog4RBc_RMFgXCLywQQ",
    hoverImageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuALpNq8IOkZqXNhTZ0WFVlHCjZjVi29o6wYONdI1cbUXsDa92sWy22Tt6yBBbEajzJYrOHaGvMBUaG3u3C7khCwFS7TTKFm4tzAu62npYA3P5TlD_V4n923KxOh4JUa5M8lcWel1sI7H0vtjxapAMm9clcZPUbs3PQj-LbwS48V19P-7ZQEaWu39cKq11TAlMH80rbUSbSLmzbO5E3zqVr_kIPgwRDHt5RJTya9UBddlL-vRX31ivlLnt6nX7TI10BENjkEuL7ZUg",
    imageAlt: "Structured Black Blouse",
    colors: ["bg-black"],
    detailedColors: [{ name: "BLACK", class: "bg-primary" }],
    sizes: ["XS", "S", "M", "L"],
    description: "A tailored structural masterpiece featuring precise seam lines and structural definition. Gives an iconic profile with refined details.",
    fabricCare: "100% Premium Cotton. Dry clean only.",
    shippingReturns: "Complimentary shipping on orders over $300. 14-day returns.",
    galleryImages: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBdnFD8OB8k4gQgVfWnNxIDf4bd3n9x5Rd-NGJpEJjpwZxeW6VUNgebYchAebxqC5gxQXIoaPB1Dx_r2-m6aqfmDUPZa3CFHNMXU98f1YQbsaFuc1Egx8dxsYb-spM3D678AxH7-iLTX5u7I_PAYWThQWoU3p5Knj4GVlqXchVSXBxWM8SkpdHNNQF60oiWIA-u-cIO3KrZjy0QwlFDPVH4RQUPraDyJkPnSSQUVGnSt2m3CDTOe-6peNPoog4RBc_RMFgXCLywQQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuALpNq8IOkZqXNhTZ0WFVlHCjZjVi29o6wYONdI1cbUXsDa92sWy22Tt6yBBbEajzJYrOHaGvMBUaG3u3C7khCwFS7TTKFm4tzAu62npYA3P5TlD_V4n923KxOh4JUa5M8lcWel1sI7H0vtjxapAMm9clcZPUbs3PQj-LbwS48V19P-7ZQEaWu39cKq11TAlMH80rbUSbSLmzbO5E3zqVr_kIPgwRDHt5RJTya9UBddlL-vRX31ivlLnt6nX7TI10BENjkEuL7ZUg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB-2MA5uCOJMoQa-BTlFghGhKwPmRYqtppiblortzOjj5RHGSQUSo4NVaFJx_Y6CLsC1XQQIdE4svKZn-6vGMGqyZkoTk4A8lENcruP4f37KM9Bi36lym_KPyz1tYgwKBNJKs3BVxsvmt7Deoypo1n3FugNViGeR3YwNA9wXJoROt8URTWsolax3xPDSJjVKPC47qpLdzRJumv9zeA0JUGY8t_qCdDTuKE5o2I-cm4jbjAn9rMYbvmL4AIeGd3y6ebfxW-gVIHJ0Q",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDsaRw0f02Iq9lpELWsvP_wyZCEF5tNcZ4R5rvF-yP2LUcO30yKPV8kdULpqtCVapMlHCm1nstGnVEolXj8YaObHg4kzpU_xFnSu-wmI-AyZHz_NQ3fw0b5xKW5DePy_N4KzLHEfn3Fszl8I2fbcyC4JZNfwm74fTFTvFB754LbsUGMiYyEn4JZNm6Z2iBGa2lRamko2jIM-Yx54uUyO9kqF1P1ydp6qICZCu2CL1J2dfVVfSy-5Syw2bYvdUz21z9Nac9kHXZ32g"
    ]
  },
  {
    id: "cream-silk-slip-dress",
    name: "Cream Silk Slip Dress",
    price: "$220.00",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4nsXD-VV3xeCHrAhaQdW9H_lcBIWfxcR9DDjG9Zhb3rdHLD1VLmjYpWqH87fkGEci-nrn4bYIVr2VZ91_vbkdLP2uzNeaAQvRj5Yq8VtukprI8BwCYr7Q58u7N2ZaRJhnEcVyjnIoCgUPdZ5BbTtHlJJb_dpiUvwx_yXuP9nqpXhhFhzi37hlpO4bhLxQwXIQULPAnJdVkKoHKU1ctsmpRsi9vUvZnO8N_0ZdsR6zVdRkkFDfeTF5ttUW01ga7ck7VcB68Bi8QQ",
    hoverImageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAoNp2SGWH0iWUzTZzjzaUgBSnSMDhBZOjS-t66W7hDLYCNGQkzT8ahTKTXkJn7DrFM3u06KphOFpfxaDup_SL8eVepfvYpajnV1dYWs_FYJlodhu_zd9LrBMfyBHv-U4tkbaxS_ampNRYscP6YgN5NYJ_kO7N6qYG1r8xwemTXAbq1XpMvJ82QStnoue8me17AuXTN_DUMvjQMKuEgijAGy1zyjw0hDgldWU9q0UNcWUCWC9VNtUn1ayUhA32u8dq9p9SUCtK5Q",
    imageAlt: "Cream Silk Slip Dress",
    colors: ["bg-[#FFFDD0]"],
    detailedColors: [{ name: "CREAM", class: "bg-[#FFFDD0]" }],
    sizes: ["XS", "S", "M", "L"],
    description: "Flowing luxury silk slip dress boasting a delicate draping shape and an exquisite layout.",
    fabricCare: "100% Silk. Hand wash cold separately.",
    shippingReturns: "Complimentary shipping on orders over $300. 14-day returns.",
    galleryImages: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB4nsXD-VV3xeCHrAhaQdW9H_lcBIWfxcR9DDjG9Zhb3rdHLD1VLmjYpWqH87fkGEci-nrn4bYIVr2VZ91_vbkdLP2uzNeaAQvRj5Yq8VtukprI8BwCYr7Q58u7N2ZaRJhnEcVyjnIoCgUPdZ5BbTtHlJJb_dpiUvwx_yXuP9nqpXhhFhzi37hlpO4bhLxQwXIQULPAnJdVkKoHKU1ctsmpRsi9vUvZnO8N_0ZdsR6zVdRkkFDfeTF5ttUW01ga7ck7VcB68Bi8QQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBAoNp2SGWH0iWUzTZzjzaUgBSnSMDhBZOjS-t66W7hDLYCNGQkzT8ahTKTXkJn7DrFM3u06KphOFpfxaDup_SL8eVepfvYpajnV1dYWs_FYJlodhu_zd9LrBMfyBHv-U4tkbaxS_ampNRYscP6YgN5NYJ_kO7N6qYG1r8xwemTXAbq1XpMvJ82QStnoue8me17AuXTN_DUMvjQMKuEgijAGy1zyjw0hDgldWU9q0UNcWUCWC9VNtUn1ayUhA32u8dq9p9SUCtK5Q",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDcyZIhdnnntTHgHitzmnMe-enVRfS0t8_HTwVvXbi5kvFaeGeg2H0mIVjizisleE2HIOBcy3mkDyaxoO7xsksHInCofVvPzVqP8VJyhrJAc5VnxNORUzL2ioX_9CNqAG8LnRFxzSG7IVKnsADkHR0jir3k9JnO3rFBJ3i-Ajg8ezP6uct9a6o2-q2mOASY9vpn-ctFCGNbV2MZuSPWWQOj6woK4tgmnmWnZrZY6koaYIGullRD7fYHmJQjQnRGlr_cTNqHkVJmLg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBJ7MJVnux3mLW67jLsYqgOwFh93Aq-R5vIYfKckWrFnxmxNjmhqO4heyRtXonX39mNH1k4jZHz4PJXQ0WfqdYqIc8pOIxxJBrJJN7OmeTk186nov8KmMea_CstlkCs59oLZSNY7rAKB6MoZlbvR_TThyR4truLXvzmzZBhMYTx4iSbQoYYWC6x9kV-KayRDz4YWk5-uMEG4GWw2hxqU_PCZGDHD-IS0BRL9TlWdvnFlr7dzqV35hElVxaGo39W3gLsivQhcipcYg"
    ]
  },
  {
    id: "classic-poplin-shirt",
    name: "Classic Poplin Shirt",
    price: "$95.00",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlqx12hmbL2Eb7Mk8C4VY2cXxJgk-8ROqb4RCA-H6SKF5sSROG4C0PaZtKBYpVp8MlznO8Ql29yUK76IaOSs-i-xjAi2-I0CbGxv9TZ7T5pbtdi44RxhA6OSE-KkPHMUHPzYuxURgzma3WLcvqSv06rvKWUo83DHWAXKDCY5BRfC6xLA5dpA8t_439QB9qc_OIHlhtVUiK0UnxfOXOqz7wMhSIYQ7bBVHpwLH8fOZbo1qONhGZ2ymesiEgzLzbwY8ROSOHMiXdCA",
    hoverImageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGBTKQinrUZy0Vnz7Y_HoaQ57C36_u011zzUxkRfbxfw7ISlyzwG3Llij7oR6LeZZT4OLixEbuEcQ13pWsIroISOR3ucAHT6_yzHWwN36pNzPfOSW8YIhDGqWc2dX_uwXNnZH2rM-uWyu7kWCNoP0XY2taoL5UUmVJCk9Vcgio7pM6FdIk8Gy-m8uGl1g0jAm3F-YOfmideAKDqgwsYYWdNCWZ_RKPNJ8ETTLd6_Eue92bwfPqLvqcZ3bc6-SivuQjvo133u8P1A",
    imageAlt: "Classic Poplin Shirt",
    colors: ["bg-white"],
    detailedColors: [{ name: "WHITE", class: "bg-white" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Crisp white poplin shirt with architectural details, perfect for professional styling.",
    fabricCare: "95% Cotton, 5% Elastane. Machine wash cold.",
    shippingReturns: "Complimentary shipping on orders over $300. 14-day returns.",
    galleryImages: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDlqx12hmbL2Eb7Mk8C4VY2cXxJgk-8ROqb4RCA-H6SKF5sSROG4C0PaZtKBYpVp8MlznO8Ql29yUK76IaOSs-i-xjAi2-I0CbGxv9TZ7T5pbtdi44RxhA6OSE-KkPHMUHPzYuxURgzma3WLcvqSv06rvKWUo83DHWAXKDCY5BRfC6xLA5dpA8t_439QB9qc_OIHlhtVUiK0UnxfOXOqz7wMhSIYQ7bBVHpwLH8fOZbo1qONhGZ2ymesiEgzLzbwY8ROSOHMiXdCA",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBGBTKQinrUZy0Vnz7Y_HoaQ57C36_u011zzUxkRfbxfw7ISlyzwG3Llij7oR6LeZZT4OLixEbuEcQ13pWsIroISOR3ucAHT6_yzHWwN36pNzPfOSW8YIhDGqWc2dX_uwXNnZH2rM-uWyu7kWCNoP0XY2taoL5UUmVJCk9Vcgio7pM6FdIk8Gy-m8uGl1g0jAm3F-YOfmideAKDqgwsYYWdNCWZ_RKPNJ8ETTLd6_Eue92bwfPqLvqcZ3bc6-SivuQjvo133u8P1A",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDcwcNCJ6ErzKHnABETC8auOXlqTNVwHGQWw1xBgYDnTMolGT0VghRVMbsRvrnT-ZnKTitFLfb6ZtPzTD3WnF_jnA6lh_YGATMGO_t4sAuoDHLXcIAE-UvHTDtftD-F2DkmC9NTgeqESf1HzV6DpOUZoHJmA7ZyFww75_dhErffg5zvry6Xmq9JQZbhMKrPArVvVIduo7DnTifPoJQq_i7VjFZDTw2yZCGjrCy-93j4cbuBQHoAPPBYpEEc6M47FXKs9ZEEcJylAA",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDlqx12hmbL2Eb7Mk8C4VY2cXxJgk-8ROqb4RCA-H6SKF5sSROG4C0PaZtKBYpVp8MlznO8Ql29yUK76IaOSs-i-xjAi2-I0CbGxv9TZ7T5pbtdi44RxhA6OSE-KkPHMUHPzYuxURgzma3WLcvqSv06rvKWUo83DHWAXKDCY5BRfC6xLA5dpA8t_439QB9qc_OIHlhtVUiK0UnxfOXOqz7wMhSIYQ7bBVHpwLH8fOZbo1qONhGZ2ymesiEgzLzbwY8ROSOHMiXdCA"
    ]
  },
  {
    id: "fine-knit-linen-tee",
    name: "Fine Knit Linen Tee",
    price: "$65.00",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAoNp2SGWH0iWUzTZzjzaUgBSnSMDhBZOjS-t66W7hDLYCNGQkzT8ahTKTXkJn7DrFM3u06KphOFpfxaDup_SL8eVepfvYpajnV1dYWs_FYJlodhu_zd9LrBMfyBHv-U4tkbaxS_ampNRYscP6YgN5NYJ_kO7N6qYG1r8xwemTXAbq1XpMvJ82QStnoue8me17AuXTN_DUMvjQMKuEgijAGy1zyjw0hDgldWU9q0UNcWUCWC9VNtUn1ayUhA32u8dq9p9SUCtK5Q",
    hoverImageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4nsXD-VV3xeCHrAhaQdW9H_lcBIWfxcR9DDjG9Zhb3rdHLD1VLmjYpWqH87fkGEci-nrn4bYIVr2VZ91_vbkdLP2uzNeaAQvRj5Yq8VtukprI8BwCYr7Q58u7N2ZaRJhnEcVyjnIoCgUPdZ5BbTtHlJJb_dpiUvwx_yXuP9nqpXhhFhzi37hlpO4bhLxQwXIQULPAnJdVkKoHKU1ctsmpRsi9vUvZnO8N_0ZdsR6zVdRkkFDfeTF5ttUW01ga7ck7VcB68Bi8QQ",
    imageAlt: "Fine Knit Linen Tee",
    colors: ["bg-[#E5E4E2]"],
    detailedColors: [{ name: "OATMEAL", class: "bg-[#E5E4E2]" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Premium light-knit linen tee designed for relaxed everyday comfort.",
    fabricCare: "100% Linen. Hand wash cold separately. Dry flat.",
    shippingReturns: "Complimentary shipping on orders over $300. 14-day returns.",
    galleryImages: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBAoNp2SGWH0iWUzTZzjzaUgBSnSMDhBZOjS-t66W7hDLYCNGQkzT8ahTKTXkJn7DrFM3u06KphOFpfxaDup_SL8eVepfvYpajnV1dYWs_FYJlodhu_zd9LrBMfyBHv-U4tkbaxS_ampNRYscP6YgN5NYJ_kO7N6qYG1r8xwemTXAbq1XpMvJ82QStnoue8me17AuXTN_DUMvjQMKuEgijAGy1zyjw0hDgldWU9q0UNcWUCWC9VNtUn1ayUhA32u8dq9p9SUCtK5Q",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB4nsXD-VV3xeCHrAhaQdW9H_lcBIWfxcR9DDjG9Zhb3rdHLD1VLmjYpWqH87fkGEci-nrn4bYIVr2VZ91_vbkdLP2uzNeaAQvRj5Yq8VtukprI8BwCYr7Q58u7N2ZaRJhnEcVyjnIoCgUPdZ5BbTtHlJJb_dpiUvwx_yXuP9nqpXhhFhzi37hlpO4bhLxQwXIQULPAnJdVkKoHKU1ctsmpRsi9vUvZnO8N_0ZdsR6zVdRkkFDfeTF5ttUW01ga7ck7VcB68Bi8QQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB-2MA5uCOJMoQa-BTlFghGhKwPmRYqtppiblortzOjj5RHGSQUSo4NVaFJx_Y6CLsC1XQQIdE4svKZn-6vGMGqyZkoTk4A8lENcruP4f37KM9Bi36lym_KPyz1tYgwKBNJKs3BVxsvmt7Deoypo1n3FugNViGeR3YwNA9wXJoROt8URTWsolax3xPDSJjVKPC47qpLdzRJumv9zeA0JUGY8t_qCdDTuKE5o2I-cm4jbjAn9rMYbvmL4AIeGd3y6ebfxW-gVIHJ0Q",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBAoNp2SGWH0iWUzTZzjzaUgBSnSMDhBZOjS-t66W7hDLYCNGQkzT8ahTKTXkJn7DrFM3u06KphOFpfxaDup_SL8eVepfvYpajnV1dYWs_FYJlodhu_zd9LrBMfyBHv-U4tkbaxS_ampNRYscP6YgN5NYJ_kO7N6qYG1r8xwemTXAbq1XpMvJ82QStnoue8me17AuXTN_DUMvjQMKuEgijAGy1zyjw0hDgldWU9q0UNcWUCWC9VNtUn1ayUhA32u8dq9p9SUCtK5Q"
    ]
  },
  {
    id: "vintage-straight-denim",
    name: "Vintage Wash Straight Denim",
    price: "$110.00",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGBTKQinrUZy0Vnz7Y_HoaQ57C36_u011zzUxkRfbxfw7ISlyzwG3Llij7oR6LeZZT4OLixEbuEcQ13pWsIroISOR3ucAHT6_yzHWwN36pNzPfOSW8YIhDGqWc2dX_uwXNnZH2rM-uWyu7kWCNoP0XY2taoL5UUmVJCk9Vcgio7pM6FdIk8Gy-m8uGl1g0jAm3F-YOfmideAKDqgwsYYWdNCWZ_RKPNJ8ETTLd6_Eue92bwfPqLvqcZ3bc6-SivuQjvo133u8P1A",
    hoverImageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlqx12hmbL2Eb7Mk8C4VY2cXxJgk-8ROqb4RCA-H6SKF5sSROG4C0PaZtKBYpVp8MlznO8Ql29yUK76IaOSs-i-xjAi2-I0CbGxv9TZ7T5pbtdi44RxhA6OSE-KkPHMUHPzYuxURgzma3WLcvqSv06rvKWUo83DHWAXKDCY5BRfC6xLA5dpA8t_439QB9qc_OIHlhtVUiK0UnxfOXOqz7wMhSIYQ7bBVHpwLH8fOZbo1qONhGZ2ymesiEgzLzbwY8ROSOHMiXdCA",
    imageAlt: "Vintage Wash Straight Denim",
    colors: ["bg-[#4682B4]"],
    detailedColors: [{ name: "MID-BLUE", class: "bg-[#4682B4]" }],
    sizes: ["24", "25", "26", "27", "28", "29", "30"],
    description: "Classic straight-leg cut denim in a gorgeous vintage-inspired mid-blue wash.",
    fabricCare: "99% Cotton, 1% Elastane. Machine wash warm with like colors.",
    shippingReturns: "Complimentary shipping on orders over $300. 14-day returns.",
    galleryImages: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBGBTKQinrUZy0Vnz7Y_HoaQ57C36_u011zzUxkRfbxfw7ISlyzwG3Llij7oR6LeZZT4OLixEbuEcQ13pWsIroISOR3ucAHT6_yzHWwN36pNzPfOSW8YIhDGqWc2dX_uwXNnZH2rM-uWyu7kWCNoP0XY2taoL5UUmVJCk9Vcgio7pM6FdIk8Gy-m8uGl1g0jAm3F-YOfmideAKDqgwsYYWdNCWZ_RKPNJ8ETTLd6_Eue92bwfPqLvqcZ3bc6-SivuQjvo133u8P1A",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDlqx12hmbL2Eb7Mk8C4VY2cXxJgk-8ROqb4RCA-H6SKF5sSROG4C0PaZtKBYpVp8MlznO8Ql29yUK76IaOSs-i-xjAi2-I0CbGxv9TZ7T5pbtdi44RxhA6OSE-KkPHMUHPzYuxURgzma3WLcvqSv06rvKWUo83DHWAXKDCY5BRfC6xLA5dpA8t_439QB9qc_OIHlhtVUiK0UnxfOXOqz7wMhSIYQ7bBVHpwLH8fOZbo1qONhGZ2ymesiEgzLzbwY8ROSOHMiXdCA",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBqJmtNMmrmRdRuGZCag9nhLr1XW7R7nP8nUTFANUVlmEnX4jGpmKPFub4uS2DplitwIdXnuYP5n7BTyLxELTHSQm_inTE2DakOSjSiuvuFKiv3GDkDzZuDU19IxwTOEl6L5-niftZeWa5N3cNbaNwZl8ksTnKyqv2GSQNnt2y9kh7sbEvic1XYA-fapST297RLW94exM0hVv-vtH9oZAPmmVkSqAT2nDXLxswSnzjvBHiggeNxWOUdyHe9tMySB8w0PAvM9eBkSQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBGBTKQinrUZy0Vnz7Y_HoaQ57C36_u011zzUxkRfbxfw7ISlyzwG3Llij7oR6LeZZT4OLixEbuEcQ13pWsIroISOR3ucAHT6_yzHWwN36pNzPfOSW8YIhDGqWc2dX_uwXNnZH2rM-uWyu7kWCNoP0XY2taoL5UUmVJCk9Vcgio7pM6FdIk8Gy-m8uGl1g0jAm3F-YOfmideAKDqgwsYYWdNCWZ_RKPNJ8ETTLd6_Eue92bwfPqLvqcZ3bc6-SivuQjvo133u8P1A"
    ]
  },
  {
    id: "architectural-silk-blouse",
    name: "Architectural Silk Blouse",
    price: "$345.00",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCO8Mb197hOQXHE0vT2zdMgkKohLfyREu4D1oDBj_aDghFEHjl3IfHlF1VIFPj7BpOp4BeHUiQFanVuGTCcrN4RYqRQ4jcYX-zEwRRRYp0f7ZhC63V6h8oMwCE8q5WtLQM8tgByxjPHKdIoyh-v0EjJe-649d6b6Zx4t_hLNikrV2kbftSwXuKm1I5BcKZUk57NWXHz2x2qARLoDrw_oIelq_NlS6Sl-EhWVAyfDZTNNEp18TUIMDLzDc_NRK0iDPcWKm8BPIldA",
    hoverImageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsaRw0f02Iq9lpELWsvP_wyZCEF5tNcZ4R5rvF-yP2LUcO30yKPV8kdULpqtCVapMlHCm1nstGnVEolXj8YaObHg4kzpU_xFnSu-wmI-AyZHz_NQ3fw0b5xKW5DePy_N4KzLHEfn3Fszl8I2fbcyC4JZNfwm74fTFTvFB754LbsUGMiYyEn4JZNm6Z2iBGa2lRamko2jIM-Yx54uUyO9kqF1P1ydp6qICZCu2CL1J2dfVVfSy-5Syw2bYvdUz21z9Nac9kHXZ32g",
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
    shippingReturns: "Complimentary shipping on orders over $300. 14-day returns.",
    galleryImages: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBCO8Mb197hOQXHE0vT2zdMgkKohLfyREu4D1oDBj_aDghFEHjl3IfHlF1VIFPj7BpOp4BeHUiQFanVuGTCcrN4RYqRQ4jcYX-zEwRRRYp0f7ZhC63V6h8oMwCE8q5WtLQM8tgByxjPHKdIoyh-v0EjJe-649d6b6Zx4t_hLNikrV2kbftSwXuKm1I5BcKZUk57NWXHz2x2qARLoDrw_oIelq_NlS6Sl-EhWVAyfDZTNNEp18TUIMDLzDc_NRK0iDPcWKm8BPIldA",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDsaRw0f02Iq9lpELWsvP_wyZCEF5tNcZ4R5rvF-yP2LUcO30yKPV8kdULpqtCVapMlHCm1nstGnVEolXj8YaObHg4kzpU_xFnSu-wmI-AyZHz_NQ3fw0b5xKW5DePy_N4KzLHEfn3Fszl8I2fbcyC4JZNfwm74fTFTvFB754LbsUGMiYyEn4JZNm6Z2iBGa2lRamko2jIM-Yx54uUyO9kqF1P1ydp6qICZCu2CL1J2dfVVfSy-5Syw2bYvdUz21z9Nac9kHXZ32g",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDlqx12hmbL2Eb7Mk8C4VY2cXxJgk-8ROqb4RCA-H6SKF5sSROG4C0PaZtKBYpVp8MlznO8Ql29yUK76IaOSs-i-xjAi2-I0CbGxv9TZ7T5pbtdi44RxhA6OSE-KkPHMUHPzYuxURgzma3WLcvqSv06rvKWUo83DHWAXKDCY5BRfC6xLA5dpA8t_439QB9qc_OIHlhtVUiK0UnxfOXOqz7wMhSIYQ7bBVHpwLH8fOZbo1qONhGZ2ymesiEgzLzbwY8ROSOHMiXdCA",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBCO8Mb197hOQXHE0vT2zdMgkKohLfyREu4D1oDBj_aDghFEHjl3IfHlF1VIFPj7BpOp4BeHUiQFanVuGTCcrN4RYqRQ4jcYX-zEwRRRYp0f7ZhC63V6h8oMwCE8q5WtLQM8tgByxjPHKdIoyh-v0EjJe-649d6b6Zx4t_hLNikrV2kbftSwXuKm1I5BcKZUk57NWXHz2x2qARLoDrw_oIelq_NlS6Sl-EhWVAyfDZTNNEp18TUIMDLzDc_NRK0iDPcWKm8BPIldA"
    ]
  },
  {
    id: "ruched-sheer-print-top",
    name: "Ruched Sheer Print Top",
    price: "$285.00",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhNblnfCJBLdrs2g_ZYDtErc-V5SaTJpn-iIPp4ehud6u7c4Z8yqEEjMGLYeVqzvOsnxh5dKdCKrz1j8H1lUlWuHWy-XtgFX4MyrDfNh1gBFyNdlAqFspfYWnv-s092IXFlTjths5UAJ5iOFBoEyxVh05_1CNzDQihYONTwUSVDmTqDzxABKxl65AOokr6fijnLIySIhu-LZJgnA0iDvv17BLsILBLE8gGew9UNt62vzhiuTTsyAlpsKShsuuJcodLe-UXukSPKw",
    hoverImageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcyZIhdnnntTHgHitzmnMe-enVRfS0t8_HTwVvXbi5kvFaeGeg2H0mIVjizisleE2HIOBcy3mkDyaxoO7xsksHInCofVvPzVqP8VJyhrJAc5VnxNORUzL2ioX_9CNqAG8LnRFxzSG7IVKnsADkHR0jir3k9JnO3rFBJ3i-Ajg8ezP6uct9a6o2-q2mOASY9vpn-ctFCGNbV2MZuSPWWQOj6woK4tgmnmWnZrZY6koaYIGullRD7fYHmJQjQnRGlr_cTNqHkVJmLg",
    colors: ["bg-[#8B5A2B]"],
    detailedColors: [{ name: "BROWN PRINT", class: "bg-[#8B5A2B]" }],
    sizes: ["XS", "S", "M", "L"],
    description: "Ruched sheer print top featuring high quality materials and an exquisite form-fitting layout.",
    fabricCare: "90% Nylon, 10% Spandex. Hand wash cold.",
    shippingReturns: "Complimentary shipping on orders over $300. 14-day returns.",
    galleryImages: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBhNblnfCJBLdrs2g_ZYDtErc-V5SaTJpn-iIPp4ehud6u7c4Z8yqEEjMGLYeVqzvOsnxh5dKdCKrz1j8H1lUlWuHWy-XtgFX4MyrDfNh1gBFyNdlAqFspfYWnv-s092IXFlTjths5UAJ5iOFBoEyxVh05_1CNzDQihYONTwUSVDmTqDzxABKxl65AOokr6fijnLIySIhu-LZJgnA0iDvv17BLsILBLE8gGew9UNt62vzhiuTTsyAlpsKShsuuJcodLe-UXukSPKw",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDcyZIhdnnntTHgHitzmnMe-enVRfS0t8_HTwVvXbi5kvFaeGeg2H0mIVjizisleE2HIOBcy3mkDyaxoO7xsksHInCofVvPzVqP8VJyhrJAc5VnxNORUzL2ioX_9CNqAG8LnRFxzSG7IVKnsADkHR0jir3k9JnO3rFBJ3i-Ajg8ezP6uct9a6o2-q2mOASY9vpn-ctFCGNbV2MZuSPWWQOj6woK4tgmnmWnZrZY6koaYIGullRD7fYHmJQjQnRGlr_cTNqHkVJmLg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBhNblnfCJBLdrs2g_ZYDtErc-V5SaTJpn-iIPp4ehud6u7c4Z8yqEEjMGLYeVqzvOsnxh5dKdCKrz1j8H1lUlWuHWy-XtgFX4MyrDfNh1gBFyNdlAqFspfYWnv-s092IXFlTjths5UAJ5iOFBoEyxVh05_1CNzDQihYONTwUSVDmTqDzxABKxl65AOokr6fijnLIySIhu-LZJgnA0iDvv17BLsILBLE8gGew9UNt62vzhiuTTsyAlpsKShsuuJcodLe-UXukSPKw",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDcyZIhdnnntTHgHitzmnMe-enVRfS0t8_HTwVvXbi5kvFaeGeg2H0mIVjizisleE2HIOBcy3mkDyaxoO7xsksHInCofVvPzVqP8VJyhrJAc5VnxNORUzL2ioX_9CNqAG8LnRFxzSG7IVKnsADkHR0jir3k9JnO3rFBJ3i-Ajg8ezP6uct9a6o2-q2mOASY9vpn-ctFCGNbV2MZuSPWWQOj6woK4tgmnmWnZrZY6koaYIGullRD7fYHmJQjQnRGlr_cTNqHkVJmLg"
    ]
  },
  {
    id: "essential-strappy-crop",
    name: "Essential Strappy Crop",
    price: "$145.00",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxDPECrTpuD3l-RoQh7OtmG28zJGpu_fCGkREbxQ6Bgk5K-rrZ7k7Rj9Kb9nMoaMgu8Fyoo8fr9FAh3kpIu9cEd57P8OpSp0LT7WpGB-YgtN98--xdpEwmPLZonTy58378K_JewmpBmJ3JQHN8Er063uQPkf8PdIOH-468f7EoTkstqJN4OejW9lVdnLbLSM14OGVOpPDLxGEcb4KD5W_CDIyKo-rj6Uucn2CEvLnLTd5yzFEr26MbqKEk3JU8x5PHT9-BOrb8xQ",
    hoverImageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdnFD8OB8k4gQgVfWnNxIDf4bd3n9x5Rd-NGJpEJjpwZxeW6VUNgebYchAebxqC5gxQXIoaPB1Dx_r2-m6aqfmDUPZa3CFHNMXU98f1YQbsaFuc1Egx8dxsYb-spM3D678AxH7-iLTX5u7I_PAYWThQWoU3p5Knj4GVlqXchVSXBxWM8SkpdHNNQF60oiWIA-u-cIO3KrZjy0QwlFDPVH4RQUPraDyJkPnSSQUVGnSt2m3CDTOe-6peNPoog4RBc_RMFgXCLywQQ",
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
    shippingReturns: "Complimentary shipping on orders over $300. 14-day returns.",
    galleryImages: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCxDPECrTpuD3l-RoQh7OtmG28zJGpu_fCGkREbxQ6Bgk5K-rrZ7k7Rj9Kb9nMoaMgu8Fyoo8fr9FAh3kpIu9cEd57P8OpSp0LT7WpGB-YgtN98--xdpEwmPLZonTy58378K_JewmpBmJ3JQHN8Er063uQPkf8PdIOH-468f7EoTkstqJN4OejW9lVdnLbLSM14OGVOpPDLxGEcb4KD5W_CDIyKo-rj6Uucn2CEvLnLTd5yzFEr26MbqKEk3JU8x5PHT9-BOrb8xQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBdnFD8OB8k4gQgVfWnNxIDf4bd3n9x5Rd-NGJpEJjpwZxeW6VUNgebYchAebxqC5gxQXIoaPB1Dx_r2-m6aqfmDUPZa3CFHNMXU98f1YQbsaFuc1Egx8dxsYb-spM3D678AxH7-iLTX5u7I_PAYWThQWoU3p5Knj4GVlqXchVSXBxWM8SkpdHNNQF60oiWIA-u-cIO3KrZjy0QwlFDPVH4RQUPraDyJkPnSSQUVGnSt2m3CDTOe-6peNPoog4RBc_RMFgXCLywQQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuALpNq8IOkZqXNhTZ0WFVlHCjZjVi29o6wYONdI1cbUXsDa92sWy22Tt6yBBbEajzJYrOHaGvMBUaG3u3C7khCwFS7TTKFm4tzAu62npYA3P5TlD_V4n923KxOh4JUa5M8lcWel1sI7H0vtjxapAMm9clcZPUbs3PQj-LbwS48V19P-7ZQEaWu39cKq11TAlMH80rbUSbSLmzbO5E3zqVr_kIPgwRDHt5RJTya9UBddlL-vRX31ivlLnt6nX7TI10BENjkEuL7ZUg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCxDPECrTpuD3l-RoQh7OtmG28zJGpu_fCGkREbxQ6Bgk5K-rrZ7k7Rj9Kb9nMoaMgu8Fyoo8fr9FAh3kpIu9cEd57P8OpSp0LT7WpGB-YgtN98--xdpEwmPLZonTy58378K_JewmpBmJ3JQHN8Er063uQPkf8PdIOH-468f7EoTkstqJN4OejW9lVdnLbLSM14OGVOpPDLxGEcb4KD5W_CDIyKo-rj6Uucn2CEvLnLTd5yzFEr26MbqKEk3JU8x5PHT9-BOrb8xQ"
    ]
  },
  {
    id: "eyelet-ribbed-vest",
    name: "Eyelet Ribbed Vest",
    price: "$185.00",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_13SVzA0Btgp6wy_k2t4K1J_IPcLbRWpNxiWt54dpdo5ZdgB5D4cXZFj4DhCgWLA-nOFwANSOoO7Nj0EiF_IEbb-0q-AWY6oK-Utf0h2Pgt1pUEOE704FspDrtMvvzUnq-k0Z_uFGIwclnU_iNHxE_H8kfqbusWNk6SMIfXZMwoEsbRihHLd6vXfGvlK_iVLvy8ZwdVoSMLIVE4joHYFOWthLYk1zuMys1CqL0eTymWgnvcsIw1qu_R6sKSxpSpI6xTc6nrnlBQ",
    hoverImageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuALpNq8IOkZqXNhTZ0WFVlHCjZjVi29o6wYONdI1cbUXsDa92sWy22Tt6yBBbEajzJYrOHaGvMBUaG3u3C7khCwFS7TTKFm4tzAu62npYA3P5TlD_V4n923KxOh4JUa5M8lcWel1sI7H0vtjxapAMm9clcZPUbs3PQj-LbwS48V19P-7ZQEaWu39cKq11TAlMH80rbUSbSLmzbO5E3zqVr_kIPgwRDHt5RJTya9UBddlL-vRX31ivlLnt6nX7TI10BENjkEuL7ZUg",
    colors: ["bg-black"],
    detailedColors: [{ name: "BLACK", class: "bg-primary" }],
    sizes: ["XS", "S", "M", "L"],
    description: "Premium eyelet ribbed vest featuring high quality textures and comfortable wear.",
    fabricCare: "90% Cotton, 10% Polyester. Machine wash cold.",
    shippingReturns: "Complimentary shipping on orders over $300. 14-day returns.",
    galleryImages: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD_13SVzA0Btgp6wy_k2t4K1J_IPcLbRWpNxiWt54dpdo5ZdgB5D4cXZFj4DhCgWLA-nOFwANSOoO7Nj0EiF_IEbb-0q-AWY6oK-Utf0h2Pgt1pUEOE704FspDrtMvvzUnq-k0Z_uFGIwclnU_iNHxE_H8kfqbusWNk6SMIfXZMwoEsbRihHLd6vXfGvlK_iVLvy8ZwdVoSMLIVE4joHYFOWthLYk1zuMys1CqL0eTymWgnvcsIw1qu_R6sKSxpSpI6xTc6nrnlBQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuALpNq8IOkZqXNhTZ0WFVlHCjZjVi29o6wYONdI1cbUXsDa92sWy22Tt6yBBbEajzJYrOHaGvMBUaG3u3C7khCwFS7TTKFm4tzAu62npYA3P5TlD_V4n923KxOh4JUa5M8lcWel1sI7H0vtjxapAMm9clcZPUbs3PQj-LbwS48V19P-7ZQEaWu39cKq11TAlMH80rbUSbSLmzbO5E3zqVr_kIPgwRDHt5RJTya9UBddlL-vRX31ivlLnt6nX7TI10BENjkEuL7ZUg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBdnFD8OB8k4gQgVfWnNxIDf4bd3n9x5Rd-NGJpEJjpwZxeW6VUNgebYchAebxqC5gxQXIoaPB1Dx_r2-m6aqfmDUPZa3CFHNMXU98f1YQbsaFuc1Egx8dxsYb-spM3D678AxH7-iLTX5u7I_PAYWThQWoU3p5Knj4GVlqXchVSXBxWM8SkpdHNNQF60oiWIA-u-cIO3KrZjy0QwlFDPVH4RQUPraDyJkPnSSQUVGnSt2m3CDTOe-6peNPoog4RBc_RMFgXCLywQQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD_13SVzA0Btgp6wy_k2t4K1J_IPcLbRWpNxiWt54dpdo5ZdgB5D4cXZFj4DhCgWLA-nOFwANSOoO7Nj0EiF_IEbb-0q-AWY6oK-Utf0h2Pgt1pUEOE704FspDrtMvvzUnq-k0Z_uFGIwclnU_iNHxE_H8kfqbusWNk6SMIfXZMwoEsbRihHLd6vXfGvlK_iVLvy8ZwdVoSMLIVE4joHYFOWthLYk1zuMys1CqL0eTymWgnvcsIw1qu_R6sKSxpSpI6xTc6nrnlBQ"
    ]
  },
  {
    id: "asymmetric-fine-knit",
    name: "Asymmetric Fine Knit",
    price: "$295.00",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDa3zfR6WR7tuWzTTqurbl_eMBX5aSLxWcnXtcW_UTHmeEdjp7YmJwrOnovVueL4wVa84fvhAXxWdvSohO4XOTl1thK3pDCtdE0l0yJMjUXLksgubfm3ajx_3lITJ3L7aTPCEJgbm2j34qNfLH-OV7bRCD5EXAmjMuIfzE0EfrmGnHYaRhtjpccR4DugBF3kuUvXD3f-gHsiWxTtU03e-Rk0qKyRdKmD-pdDeHm27ViXftf71GvLoq4ZYkBOl4cSMnRVGeeDkd5g",
    hoverImageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAoNp2SGWH0iWUzTZzjzaUgBSnSMDhBZOjS-t66W7hDLYCNGQkzT8ahTKTXkJn7DrFM3u06KphOFpfxaDup_SL8eVepfvYpajnV1dYWs_FYJlodhu_zd9LrBMfyBHv-U4tkbaxS_ampNRYscP6YgN5NYJ_kO7N6qYG1r8xwemTXAbq1XpMvJ82QStnoue8me17AuXTN_DUMvjQMKuEgijAGy1zyjw0hDgldWU9q0UNcWUCWC9VNtUn1ayUhA32u8dq9p9SUCtK5Q",
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
    shippingReturns: "Complimentary shipping on orders over $300. 14-day returns.",
    galleryImages: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCDa3zfR6WR7tuWzTTqurbl_eMBX5aSLxWcnXtcW_UTHmeEdjp7YmJwrOnovVueL4wVa84fvhAXxWdvSohO4XOTl1thK3pDCtdE0l0yJMjUXLksgubfm3ajx_3lITJ3L7aTPCEJgbm2j34qNfLH-OV7bRCD5EXAmjMuIfzE0EfrmGnHYaRhtjpccR4DugBF3kuUvXD3f-gHsiWxTtU03e-Rk0qKyRdKmD-pdDeHm27ViXftf71GvLoq4ZYkBOl4cSMnRVGeeDkd5g",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBAoNp2SGWH0iWUzTZzjzaUgBSnSMDhBZOjS-t66W7hDLYCNGQkzT8ahTKTXkJn7DrFM3u06KphOFpfxaDup_SL8eVepfvYpajnV1dYWs_FYJlodhu_zd9LrBMfyBHv-U4tkbaxS_ampNRYscP6YgN5NYJ_kO7N6qYG1r8xwemTXAbq1XpMvJ82QStnoue8me17AuXTN_DUMvjQMKuEgijAGy1zyjw0hDgldWU9q0UNcWUCWC9VNtUn1ayUhA32u8dq9p9SUCtK5Q",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB4nsXD-VV3xeCHrAhaQdW9H_lcBIWfxcR9DDjG9Zhb3rdHLD1VLmjYpWqH87fkGEci-nrn4bYIVr2VZ91_vbkdLP2uzNeaAQvRj5Yq8VtukprI8BwCYr7Q58u7N2ZaRJhnEcVyjnIoCgUPdZ5BbTtHlJJb_dpiUvwx_yXuP9nqpXhhFhzi37hlpO4bhLxQwXIQULPAnJdVkKoHKU1ctsmpRsi9vUvZnO8N_0ZdsR6zVdRkkFDfeTF5ttUW01ga7ck7VcB68Bi8QQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCDa3zfR6WR7tuWzTTqurbl_eMBX5aSLxWcnXtcW_UTHmeEdjp7YmJwrOnovVueL4wVa84fvhAXxWdvSohO4XOTl1thK3pDCtdE0l0yJMjUXLksgubfm3ajx_3lITJ3L7aTPCEJgbm2j34qNfLH-OV7bRCD5EXAmjMuIfzE0EfrmGnHYaRhtjpccR4DugBF3kuUvXD3f-gHsiWxTtU03e-Rk0qKyRdKmD-pdDeHm27ViXftf71GvLoq4ZYkBOl4cSMnRVGeeDkd5g"
    ]
  },
  
  /* Accessory and Carousel items to enable 100% complete routing */
  {
    id: "high-waisted-tailored-trousers",
    name: "High-Waisted Tailored Trousers",
    price: "$195.00",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAaoWMPs5LJfIV1wODQGwNgcfI8rAD7stjMJ0e062Jbua70BVOgDFOdKhgTIkrYWPT8mvhcw3oFW6G_5Bjyp19tj71zQSBJJMetcns1z1P83HhWePj94XqlEJY7TgxOPtsVTZxwvGvg2ENeo-9YR_Br39lXb7onSqCFeIX6NI9Pn4Kpyj962FjZZZgtz_AWaL6FWeHJKkRTPLEYa4nmmtz9qlbTt4A_8PvENecU3Yy-EKZvOM0c3J0vfNKKB6c88jqqwmv1bNlafQ",
    hoverImageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdnFD8OB8k4gQgVfWnNxIDf4bd3n9x5Rd-NGJpEJjpwZxeW6VUNgebYchAebxqC5gxQXIoaPB1Dx_r2-m6aqfmDUPZa3CFHNMXU98f1YQbsaFuc1Egx8dxsYb-spM3D678AxH7-iLTX5u7I_PAYWThQWoU3p5Knj4GVlqXchVSXBxWM8SkpdHNNQF60oiWIA-u-cIO3KrZjy0QwlFDPVH4RQUPraDyJkPnSSQUVGnSt2m3CDTOe-6peNPoog4RBc_RMFgXCLywQQ",
    colors: ["bg-black"],
    detailedColors: [{ name: "BLACK", class: "bg-primary" }],
    sizes: ["XS", "S", "M", "L"],
    description: "High-waisted tailored trousers designed with a perfect structural drape to match refined evening tops.",
    fabricCare: "95% Wool, 5% Elastane. Dry clean only.",
    shippingReturns: "Complimentary shipping on orders over $300. 14-day returns.",
    galleryImages: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAaoWMPs5LJfIV1wODQGwNgcfI8rAD7stjMJ0e062Jbua70BVOgDFOdKhgTIkrYWPT8mvhcw3oFW6G_5Bjyp19tj71zQSBJJMetcns1z1P83HhWePj94XqlEJY7TgxOPtsVTZxwvGvg2ENeo-9YR_Br39lXb7onSqCFeIX6NI9Pn4Kpyj962FjZZZgtz_AWaL6FWeHJKkRTPLEYa4nmmtz9qlbTt4A_8PvENecU3Yy-EKZvOM0c3J0vfNKKB6c88jqqwmv1bNlafQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBdnFD8OB8k4gQgVfWnNxIDf4bd3n9x5Rd-NGJpEJjpwZxeW6VUNgebYchAebxqC5gxQXIoaPB1Dx_r2-m6aqfmDUPZa3CFHNMXU98f1YQbsaFuc1Egx8dxsYb-spM3D678AxH7-iLTX5u7I_PAYWThQWoU3p5Knj4GVlqXchVSXBxWM8SkpdHNNQF60oiWIA-u-cIO3KrZjy0QwlFDPVH4RQUPraDyJkPnSSQUVGnSt2m3CDTOe-6peNPoog4RBc_RMFgXCLywQQ"
    ]
  },
  {
    id: "structured-mini-leather-tote",
    name: "Structured Mini Leather Tote",
    price: "$320.00",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4nsXD-VV3xeCHrAhaQdW9H_lcBIWfxcR9DDjG9Zhb3rdHLD1VLmjYpWqH87fkGEci-nrn4bYIVr2VZ91_vbkdLP2uzNeaAQvRj5Yq8VtukprI8BwCYr7Q58u7N2ZaRJhnEcVyjnIoCgUPdZ5BbTtHlJJb_dpiUvwx_yXuP9nqpXhhFhzi37hlpO4bhLxQwXIQULPAnJdVkKoHKU1ctsmpRsi9vUvZnO8N_0ZdsR6zVdRkkFDfeTF5ttUW01ga7ck7VcB68Bi8QQ",
    hoverImageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAoNp2SGWH0iWUzTZzjzaUgBSnSMDhBZOjS-t66W7hDLYCNGQkzT8ahTKTXkJn7DrFM3u06KphOFpfxaDup_SL8eVepfvYpajnV1dYWs_FYJlodhu_zd9LrBMfyBHv-U4tkbaxS_ampNRYscP6YgN5NYJ_kO7N6qYG1r8xwemTXAbq1XpMvJ82QStnoue8me17AuXTN_DUMvjQMKuEgijAGy1zyjw0hDgldWU9q0UNcWUCWC9VNtUn1ayUhA32u8dq9p9SUCtK5Q",
    colors: ["bg-black"],
    detailedColors: [{ name: "BLACK", class: "bg-primary" }],
    sizes: ["O/S"],
    description: "A gorgeous structured mini tote made from 100% fine Italian calfskin leather.",
    fabricCare: "Treat with specialized leather conditioner.",
    shippingReturns: "Complimentary shipping on orders over $300. 14-day returns.",
    galleryImages: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB4nsXD-VV3xeCHrAhaQdW9H_lcBIWfxcR9DDjG9Zhb3rdHLD1VLmjYpWqH87fkGEci-nrn4bYIVr2VZ91_vbkdLP2uzNeaAQvRj5Yq8VtukprI8BwCYr7Q58u7N2ZaRJhnEcVyjnIoCgUPdZ5BbTtHlJJb_dpiUvwx_yXuP9nqpXhhFhzi37hlpO4bhLxQwXIQULPAnJdVkKoHKU1ctsmpRsi9vUvZnO8N_0ZdsR6zVdRkkFDfeTF5ttUW01ga7ck7VcB68Bi8QQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBAoNp2SGWH0iWUzTZzjzaUgBSnSMDhBZOjS-t66W7hDLYCNGQkzT8ahTKTXkJn7DrFM3u06KphOFpfxaDup_SL8eVepfvYpajnV1dYWs_FYJlodhu_zd9LrBMfyBHv-U4tkbaxS_ampNRYscP6YgN5NYJ_kO7N6qYG1r8xwemTXAbq1XpMvJ82QStnoue8me17AuXTN_DUMvjQMKuEgijAGy1zyjw0hDgldWU9q0UNcWUCWC9VNtUn1ayUhA32u8dq9p9SUCtK5Q"
    ]
  },
  {
    id: "oversized-wool-blend-blazer",
    name: "Oversized Wool Blend Blazer",
    price: "$295.00",
    originalPrice: "$370.00",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVxa1CB7-fFDZZKztKoJ53_TyxcQ4JtQWc2eGWVJAZHDHgXFi6K1ORF1Ro55N_35eNvfPdPDIlgYKxj4PQYptmGIsuziLn6oF5fMQNe4ZvZD2cnzTbvucRPh_45D5WnuFHBnunY0ehwlSGgLzpEhaMQRf6VzIbrG_Dg9W2o_2E1A3NY4n4D4BVZin_Z26F5X2asfxlfcgf4G00OVFzBUg00DSkwaLp_0OCNLS39J6SXHVo98o-Y6hOJEIEdWMY-UC5njf31a2w6w",
    hoverImageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCO8Mb197hOQXHE0vT2zdMgkKohLfyREu4D1oDBj_aDghFEHjl3IfHlF1VIFPj7BpOp4BeHUiQFanVuGTCcrN4RYqRQ4jcYX-zEwRRRYp0f7ZhC63V6h8oMwCE8q5WtLQM8tgByxjPHKdIoyh-v0EjJe-649d6b6Zx4t_hLNikrV2kbftSwXuKm1I5BcKZUk57NWXHz2x2qARLoDrw_oIelq_NlS6Sl-EhWVAyfDZTNNEp18TUIMDLzDc_NRK0iDPcWKm8BPIldA",
    colors: ["bg-gray-800"],
    detailedColors: [{ name: "CHARCOAL", class: "bg-gray-800" }],
    sizes: ["XS", "S", "M", "L"],
    description: "An oversized double-breasted charcoal wool blend blazer with precise shoulder framing.",
    fabricCare: "Dry clean only.",
    shippingReturns: "Complimentary shipping on orders over $300. 14-day returns.",
    galleryImages: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBVxa1CB7-fFDZZKztKoJ53_TyxcQ4JtQWc2eGWVJAZHDHgXFi6K1ORF1Ro55N_35eNvfPdPDIlgYKxj4PQYptmGIsuziLn6oF5fMQNe4ZvZD2cnzTbvucRPh_45D5WnuFHBnunY0ehwlSGgLzpEhaMQRf6VzIbrG_Dg9W2o_2E1A3NY4n4D4BVZin_Z26F5X2asfxlfcgf4G00OVFzBUg00DSkwaLp_0OCNLS39J6SXHVo98o-Y6hOJEIEdWMY-UC5njf31a2w6w",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBCO8Mb197hOQXHE0vT2zdMgkKohLfyREu4D1oDBj_aDghFEHjl3IfHlF1VIFPj7BpOp4BeHUiQFanVuGTCcrN4RYqRQ4jcYX-zEwRRRYp0f7ZhC63V6h8oMwCE8q5WtLQM8tgByxjPHKdIoyh-v0EjJe-649d6b6Zx4t_hLNikrV2kbftSwXuKm1I5BcKZUk57NWXHz2x2qARLoDrw_oIelq_NlS6Sl-EhWVAyfDZTNNEp18TUIMDLzDc_NRK0iDPcWKm8BPIldA"
    ]
  },
  {
    id: "minimalist-strappy-sandal",
    name: "Minimalist Strappy Sandal",
    price: "$185.00",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgCzURvpb1OEbr-xJAVFTLjchnU4TzX5WUNYPPu_6QzK1skj4kx--YfAEz-TcqkIxIQM2ARNxzrSz2q6TKSEwrrub_MyQjxDu3pp0U7IUdGl6qOEww2rhIeE6gP3YQqvkNZvJV3cRKdR0ELht61JHZNzvTwDoQX65s1R9JeXamrXJn5x3UrMMV7f5XD_6lI9fTpUKmEHDVCQKyBKkTPsfHe2NWATAXvocBH2PZMHJgmKlgzYOm9VlX1pJHILM2cPnp3R2yW6lcgg",
    hoverImageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlqx12hmbL2Eb7Mk8C4VY2cXxJgk-8ROqb4RCA-H6SKF5sSROG4C0PaZtKBYpVp8MlznO8Ql29yUK76IaOSs-i-xjAi2-I0CbGxv9TZ7T5pbtdi44RxhA6OSE-KkPHMUHPzYuxURgzma3WLcvqSv06rvKWUo83DHWAXKDCY5BRfC6xLA5dpA8t_439QB9qc_OIHlhtVUiK0UnxfOXOqz7wMhSIYQ7bBVHpwLH8fOZbo1qONhGZ2ymesiEgzLzbwY8ROSOHMiXdCA",
    colors: ["bg-black"],
    detailedColors: [{ name: "BLACK", class: "bg-primary" }],
    sizes: ["36", "37", "38", "39", "40"],
    description: "Sleek, minimalist black leather strappy sandals with a comfortable fine heel.",
    fabricCare: "Wipe clean with soft leather cloth.",
    shippingReturns: "Complimentary shipping on orders over $300. 14-day returns.",
    galleryImages: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAgCzURvpb1OEbr-xJAVFTLjchnU4TzX5WUNYPPu_6QzK1skj4kx--YfAEz-TcqkIxIQM2ARNxzrSz2q6TKSEwrrub_MyQjxDu3pp0U7IUdGl6qOEww2rhIeE6gP3YQqvkNZvJV3cRKdR0ELht61JHZNzvTwDoQX65s1R9JeXamrXJn5x3UrMMV7f5XD_6lI9fTpUKmEHDVCQKyBKkTPsfHe2NWATAXvocBH2PZMHJgmKlgzYOm9VlX1pJHILM2cPnp3R2yW6lcgg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDlqx12hmbL2Eb7Mk8C4VY2cXxJgk-8ROqb4RCA-H6SKF5sSROG4C0PaZtKBYpVp8MlznO8Ql29yUK76IaOSs-i-xjAi2-I0CbGxv9TZ7T5pbtdi44RxhA6OSE-KkPHMUHPzYuxURgzma3WLcvqSv06rvKWUo83DHWAXKDCY5BRfC6xLA5dpA8t_439QB9qc_OIHlhtVUiK0UnxfOXOqz7wMhSIYQ7bBVHpwLH8fOZbo1qONhGZ2ymesiEgzLzbwY8ROSOHMiXdCA"
    ]
  },
  {
    id: "sheer-panelled-bodysuit",
    name: "Sheer Panelled Bodysuit",
    price: "$120.00",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCveJaKD8zWe-qX3mPKMWEAjbzExYZlOrLogUi_3gqWRw5hLbvgscxryWaxOD36h2AbY4Vg1P1uBVt14qACioLdCuJ3s1gNXRg88Pwp5BPsD9AL3k_xwI0HnG34SiIj5s0VgAt5sTrVTDTpD4mbSpoMbVuX1Ox7gYVSnIHw32-XTwS5PM29rCg8_zOBMPcIp6S_et4GVpz870w7d7DXStSdySC2Gb00wlTZwxMeBNwLSRxIfxuZ8S_Hd_BZlPf7aG7yKswXW0xv6Q",
    hoverImageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcyZIhdnnntTHgHitzmnMe-enVRfS0t8_HTwVvXbi5kvFaeGeg2H0mIVjizisleE2HIOBcy3mkDyaxoO7xsksHInCofVvPzVqP8VJyhrJAc5VnxNORUzL2ioX_9CNqAG8LnRFxzSG7IVKnsADkHR0jir3k9JnO3rFBJ3i-Ajg8ezP6uct9a6o2-q2mOASY9vpn-ctFCGNbV2MZuSPWWQOj6woK4tgmnmWnZrZY6koaYIGullRD7fYHmJQjQnRGlr_cTNqHkVJmLg",
    colors: ["bg-black"],
    detailedColors: [{ name: "BLACK", class: "bg-primary" }],
    sizes: ["XS", "S", "M", "L"],
    description: "High-contrast sheer black panelled bodysuit styling, incredibly sleek and comfortable.",
    fabricCare: "Hand wash cold. Lay flat to dry.",
    shippingReturns: "Complimentary shipping on orders over $300. 14-day returns.",
    galleryImages: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCveJaKD8zWe-qX3mPKMWEAjbzExYZlOrLogUi_3gqWRw5hLbvgscxryWaxOD36h2AbY4Vg1P1uBVt14qACioLdCuJ3s1gNXRg88Pwp5BPsD9AL3k_xwI0HnG34SiIj5s0VgAt5sTrVTDTpD4mbSpoMbVuX1Ox7gYVSnIHw32-XTwS5PM29rCg8_zOBMPcIp6S_et4GVpz870w7d7DXStSdySC2Gb00wlTZwxMeBNwLSRxIfxuZ8S_Hd_BZlPf7aG7yKswXW0xv6Q",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDcyZIhdnnntTHgHitzmnMe-enVRfS0t8_HTwVvXbi5kvFaeGeg2H0mIVjizisleE2HIOBcy3mkDyaxoO7xsksHInCofVvPzVqP8VJyhrJAc5VnxNORUzL2ioX_9CNqAG8LnRFxzSG7IVKnsADkHR0jir3k9JnO3rFBJ3i-Ajg8ezP6uct9a6o2-q2mOASY9vpn-ctFCGNbV2MZuSPWWQOj6woK4tgmnmWnZrZY6koaYIGullRD7fYHmJQjQnRGlr_cTNqHkVJmLg"
    ]
  },
  {
    id: "asymmetric-polka-dot-slip-dress",
    name: "Asymmetric Polka Dot Slip Dress",
    price: "$210.00",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVNcUGLhnGinjfzQFdsvMVCC22X1zTx9Tvpwt2RDHz8RiUUR5vYdAOrdVjILLgEa79De-480IK5eGwSGLANZWtk1WOW6eTsyhzO7ICRRTaGLlZJHP5CH-EtdB81Bi7JUFBbRVt3lZaR1YIpG7OCS2UwtteLrZZ5MjHI95y5Yy8re7tybRlsKadTxNKVFttXx9nts8Ab3DxbV65BZMO6bqoUlBPyo1ygU557LxIIePHGOyLYGP7tVnI9LHL5UBd_KNcg4RE639VaA",
    hoverImageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhNblnfCJBLdrs2g_ZYDtErc-V5SaTJpn-iIPp4ehud6u7c4Z8yqEEjMGLYeVqzvOsnxh5dKdCKrz1j8H1lUlWuHWy-XtgFX4MyrDfNh1gBFyNdlAqFspfYWnv-s092IXFlTjths5UAJ5iOFBoEyxVh05_1CNzDQihYONTwUSVDmTqDzxABKxl65AOokr6fijnLIySIhu-LZJgnA0iDvv17BLsILBLE8gGew9UNt62vzhiuTTsyAlpsKShsuuJcodLe-UXukSPKw",
    colors: ["bg-[#8B5A2B]"],
    detailedColors: [{ name: "POLKA DOT", class: "bg-[#8B5A2B]" }],
    sizes: ["XS", "S", "M", "L"],
    description: "An elegant asymmetrical slip dress displaying a dark brown and cream polka dot motif.",
    fabricCare: "Dry clean recommended.",
    shippingReturns: "Complimentary shipping on orders over $300. 14-day returns.",
    galleryImages: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDVNcUGLhnGinjfzQFdsvMVCC22X1zTx9Tvpwt2RDHz8RiUUR5vYdAOrdVjILLgEa79De-480IK5eGwSGLANZWtk1WOW6eTsyhzO7ICRRTaGLlZJHP5CH-EtdB81Bi7JUFBbRVt3lZaR1YIpG7OCS2UwtteLrZZ5MjHI95y5Yy8re7tybRlsKadTxNKVFttXx9nts8Ab3DxbV65BZMO6bqoUlBPyo1ygU557LxIIePHGOyLYGP7tVnI9LHL5UBd_KNcg4RE639VaA",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBhNblnfCJBLdrs2g_ZYDtErc-V5SaTJpn-iIPp4ehud6u7c4Z8yqEEjMGLYeVqzvOsnxh5dKdCKrz1j8H1lUlWuHWy-XtgFX4MyrDfNh1gBFyNdlAqFspfYWnv-s092IXFlTjths5UAJ5iOFBoEyxVh05_1CNzDQihYONTwUSVDmTqDzxABKxl65AOokr6fijnLIySIhu-LZJgnA0iDvv17BLsILBLE8gGew9UNt62vzhiuTTsyAlpsKShsuuJcodLe-UXukSPKw"
    ]
  },
  {
    id: "cut-out-ribbed-knit-top",
    name: "Cut-Out Ribbed Knit Top",
    price: "$135.00",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNDFZ1V8oKwOP-sMbWT-223BkN-XHUqARaBG08BLKvfcYO7TIYliOE9n8eqPKdjuSjfsjXtsoVHLe5QnPZPMtmiztlIEIxZm7e8QEb-A4c5iowWGKpwoVztZ31EMN-2LsQz50JvxeheFKFbNNbv4CSMqDsQS5rsnsnAVEUxweONTIr6cBP_5UVCloGdBPEIZAFA0hhqM99tiPuLqcqZe1GEWb3J54O1uTG58Yi3OueDuxVj9FTHvs00hEOsjEpmT-vei8zgsEf4Q",
    hoverImageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_13SVzA0Btgp6wy_k2t4K1J_IPcLbRWpNxiWt54dpdo5ZdgB5D4cXZFj4DhCgWLA-nOFwANSOoO7Nj0EiF_IEbb-0q-AWY6oK-Utf0h2Pgt1pUEOE704FspDrtMvvzUnq-k0Z_uFGIwclnU_iNHxE_H8kfqbusWNk6SMIfXZMwoEsbRihHLd6vXfGvlK_iVLvy8ZwdVoSMLIVE4joHYFOWthLYk1zuMys1CqL0eTymWgnvcsIw1qu_R6sKSxpSpI6xTc6nrnlBQ",
    colors: ["bg-black"],
    detailedColors: [{ name: "BLACK", class: "bg-primary" }],
    sizes: ["XS", "S", "M", "L"],
    description: "Striking black ribbed knit top featuring bold architectural cut-outs.",
    fabricCare: "Hand wash cold. Lay flat to dry.",
    shippingReturns: "Complimentary shipping on orders over $300. 14-day returns.",
    galleryImages: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDNDFZ1V8oKwOP-sMbWT-223BkN-XHUqARaBG08BLKvfcYO7TIYliOE9n8eqPKdjuSjfsjXtsoVHLe5QnPZPMtmiztlIEIxZm7e8QEb-A4c5iowWGKpwoVztZ31EMN-2LsQz50JvxeheFKFbNNbv4CSMqDsQS5rsnsnAVEUxweONTIr6cBP_5UVCloGdBPEIZAFA0hhqM99tiPuLqcqZe1GEWb3J54O1uTG58Yi3OueDuxVj9FTHvs00hEOsjEpmT-vei8zgsEf4Q",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD_13SVzA0Btgp6wy_k2t4K1J_IPcLbRWpNxiWt54dpdo5ZdgB5D4cXZFj4DhCgWLA-nOFwANSOoO7Nj0EiF_IEbb-0q-AWY6oK-Utf0h2Pgt1pUEOE704FspDrtMvvzUnq-k0Z_uFGIwclnU_iNHxE_H8kfqbusWNk6SMIfXZMwoEsbRihHLd6vXfGvlK_iVLvy8ZwdVoSMLIVE4joHYFOWthLYk1zuMys1CqL0eTymWgnvcsIw1qu_R6sKSxpSpI6xTc6nrnlBQ"
    ]
  },
  {
    id: "draped-chiffon-mini-dress",
    name: "Draped Chiffon Mini Dress",
    price: "$245.00",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJ7MJVnux3mLW67jLsYqgOwFh93Aq-R5vIYfKckWrFnxmxNjmhqO4heyRtXonX39mNH1k4jZHz4PJXQ0WfqdYqIc8pOIxxJBrJJN7OmeTk186nov8KmMea_CstlkCs59oLZSNY7rAKB6MoZlbvR_TThyR4truLXvzmzZBhMYTx4iSbQoYYWC6x9kV-KayRDz4YWk5-uMEG4GWw2hxqU_PCZGDHD-IS0BRL9TlWdvnFlr7dzqV35hElVxaGo39W3gLsivQhcipcYg",
    hoverImageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDa3zfR6WR7tuWzTTqurbl_eMBX5aSLxWcnXtcW_UTHmeEdjp7YmJwrOnovVueL4wVa84fvhAXxWdvSohO4XOTl1thK3pDCtdE0l0yJMjUXLksgubfm3ajx_3lITJ3L7aTPCEJgbm2j34qNfLH-OV7bRCD5EXAmjMuIfzE0EfrmGnHYaRhtjpccR4DugBF3kuUvXD3f-gHsiWxTtU03e-Rk0qKyRdKmD-pdDeHm27ViXftf71GvLoq4ZYkBOl4cSMnRVGeeDkd5g",
    colors: ["bg-[#add8e6]"],
    detailedColors: [{ name: "LIGHT BLUE", class: "bg-[#add8e6]" }],
    sizes: ["XS", "S", "M", "L"],
    description: "Feminine, ethereal draped chiffon mini dress with delicate dot patterning.",
    fabricCare: "Dry clean only.",
    shippingReturns: "Complimentary shipping on orders over $300. 14-day returns.",
    galleryImages: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBJ7MJVnux3mLW67jLsYqgOwFh93Aq-R5vIYfKckWrFnxmxNjmhqO4heyRtXonX39mNH1k4jZHz4PJXQ0WfqdYqIc8pOIxxJBrJJN7OmeTk186nov8KmMea_CstlkCs59oLZSNY7rAKB6MoZlbvR_TThyR4truLXvzmzZBhMYTx4iSbQoYYWC6x9kV-KayRDz4YWk5-uMEG4GWw2hxqU_PCZGDHD-IS0BRL9TlWdvnFlr7dzqV35hElVxaGo39W3gLsivQhcipcYg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCDa3zfR6WR7tuWzTTqurbl_eMBX5aSLxWcnXtcW_UTHmeEdjp7YmJwrOnovVueL4wVa84fvhAXxWdvSohO4XOTl1thK3pDCtdE0l0yJMjUXLksgubfm3ajx_3lITJ3L7aTPCEJgbm2j34qNfLH-OV7bRCD5EXAmjMuIfzE0EfrmGnHYaRhtjpccR4DugBF3kuUvXD3f-gHsiWxTtU03e-Rk0qKyRdKmD-pdDeHm27ViXftf71GvLoq4ZYkBOl4cSMnRVGeeDkd5g"
    ]
  }
];

export function getProductById(id: string | number | undefined): Product | undefined {
  if (!id) return undefined;
  const cleanId = String(id).split("-col-")[0];
  return productsData.find((p) => p.id === cleanId);
}
