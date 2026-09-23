import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import browserslist from 'browserslist'
import { browserslistToTargets } from 'lightningcss'

function seoDevPlugin(): Plugin {
  return {
    name: 'seo-dev-plugin',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const url = ctx.originalUrl || ctx.path || '/';
        const cleanPath = url.split('?')[0].replace(/^\/+|\/+$/g, '');

        const routesMeta: Record<string, { title: string; description: string; canonical?: string }> = {
          'about-tobeque': {
            title: 'About Tobeque | Teen Fashion Brand for Girls in India',
            description: 'Learn about Tobeque, an Indian fashion brand creating stylish, comfortable clothing for teen girls with in-house design and manufacturing in Haryana, India.'
          },
          'about-us': {
            title: 'About Tobeque | Teen Fashion Brand for Girls in India',
            description: 'Learn about Tobeque, an Indian fashion brand creating stylish, comfortable clothing for teen girls with in-house design and manufacturing in Haryana, India.',
            canonical: 'https://tobeque.com/about-tobeque'
          },
          'about': {
            title: 'About Tobeque | Teen Fashion Brand for Girls in India',
            description: 'Learn about Tobeque, an Indian fashion brand creating stylish, comfortable clothing for teen girls with in-house design and manufacturing in Haryana, India.',
            canonical: 'https://tobeque.com/about-tobeque'
          },
          'contact': {
            title: 'Contact Tobeque | Teen Girls Fashion Support India',
            description: 'Contact Tobeque for help with orders, products, returns, sizing or general questions. Reach our teen girls fashion support team in Haryana, India today.'
          },
          'privacy-policy': {
            title: 'Privacy Policy | Tobeque Teen Fashion',
            description: "Read Tobeque's Privacy Policy to learn how we protect your personal information, data security, and privacy rights when shopping for teen fashion."
          },
          'terms-and-conditions': {
            title: 'Terms & Conditions | Tobeque Teen Fashion',
            description: 'Review the Terms & Conditions for shopping at Tobeque online store, including ordering, payment, shipping, and usage terms.'
          },
          'cookie-policy': {
            title: 'Cookie Policy | Tobeque Teen Fashion',
            description: 'Learn about how Tobeque uses cookies and similar technologies to enhance your shopping experience and website security.'
          },
          'cookie-settings': {
            title: 'Cookie Settings | Tobeque Teen Fashion',
            description: 'Manage your cookie settings and privacy preferences at Tobeque.'
          },
          'career': {
            title: 'Careers at Tobeque | Join Our Fashion Team',
            description: 'Explore job opportunities and careers at Tobeque. Join our passionate team of designers, marketers, and fashion enthusiasts.'
          },
          'faq': {
            title: 'Frequently Asked Questions (FAQ) | Tobeque',
            description: 'Find quick answers to common questions about orders, shipping, returns, sizing, payment methods, and account settings at Tobeque.'
          },
          'refund-request': {
            title: 'Submit Refund Request | Tobeque',
            description: 'Submit a return or refund request for your Tobeque order. Fast, hassle-free 7-day return policy.'
          },
          'blogs': {
            title: 'Tobeque Style Journal | Teen Fashion Tips & Trends',
            description: 'Discover the latest teen fashion tips, outfit ideas, styling guides, and trend updates on the Tobeque Style Journal.'
          },
          'style-journal': {
            title: 'Tobeque Style Journal | Teen Fashion Tips & Trends',
            description: 'Discover the latest teen fashion tips, outfit ideas, styling guides, and trend updates on the Tobeque Style Journal.',
            canonical: 'https://tobeque.com/blogs'
          },
          'steal-the-style': {
            title: 'Steal The Style | Curated Teen Outfits | Tobeque',
            description: 'Get inspired by curated outfits and complete looks designed for teenagers at Tobeque.'
          },
          'delete-account': {
            title: 'Delete Your Tobeque Account | Account Deletion Request',
            description: 'Request permanent deletion of your Tobeque account and associated personal data. Submit your registered email or phone number to initiate the process.'
          }
        };

        // Category routes: /product-category/:slug
        const catMatch = cleanPath.match(/^product-category\/([^/]+)$/i);
        if (catMatch) {
          const slug = catMatch[1];
          const words = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          const title = `${words} Online | Stylish ${words} for Girls | Tobeque`;
          const desc = `Shop ${words.toLowerCase()} at Tobeque, featuring stylish everyday pieces and aesthetic outfits for teens.`;
          const canonicalUrl = `https://tobeque.com/product-category/${slug}`;

          return html
            .replace(/<title>.*?<\/title>/gi, `<title>${title}</title>`)
            .replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/gi, `<meta name="description" content="${desc}" />`)
            .replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/gi, `<meta property="og:title" content="${title}" />`)
            .replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/gi, `<meta property="og:description" content="${desc}" />`)
            .replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/gi, `<link rel="canonical" href="${canonicalUrl}" />`);
        }

        // Static routes
        const meta = routesMeta[cleanPath];
        if (meta) {
          const canonicalUrl = meta.canonical || `https://tobeque.com/${cleanPath}`;
          return html
            .replace(/<title>.*?<\/title>/gi, `<title>${meta.title}</title>`)
            .replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/gi, `<meta name="description" content="${meta.description}" />`)
            .replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/gi, `<meta property="og:title" content="${meta.title}" />`)
            .replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/gi, `<meta property="og:description" content="${meta.description}" />`)
            .replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/gi, `<link rel="canonical" href="${canonicalUrl}" />`);
        }

        return html;
      }
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), seoDevPlugin()],
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: browserslistToTargets(browserslist('>= 0.25%, not dead'))
    }
  },
  build: {
    cssMinify: 'lightningcss'
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false
      },
      '/uploads': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})


