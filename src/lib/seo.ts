import { Product } from "@/types";
import { categories } from "@/data/categories";

export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://www.signaturedrapes.in").replace(/\/+$/, "");
export const SITE_NAME = "Signature Drapes";
export const DEFAULT_TITLE = "Signature Drapes - Premium Interior Solutions | Curtains, Blinds & Wallpapers";
export const DEFAULT_DESCRIPTION = "Transform your space with Signature Drapes premium collection of curtains, blinds, wallpapers, and interior furnishing. Expert installation and design consultation available.";
export const DEFAULT_KEYWORDS = "curtains, blinds, wallpapers, interior design, home decor, window treatments, premium curtains, zebra blinds, roman blinds";
export const BRAND_IMAGE = `${SITE_URL}/placeholder.svg`;

export type RobotsDirective = "index, follow" | "noindex, follow" | "noindex, nofollow";

export interface SeoConfig {
  title?: string;
  description?: string;
  keywords?: string | string[];
  canonicalPath?: string;
  canonicalUrl?: string;
  robots?: RobotsDirective;
  image?: string;
  type?: "website" | "product";
  structuredData?: Record<string, unknown> | Record<string, unknown>[] | null;
}

export const slugify = (value = "") =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);

export const absoluteUrl = (path = "/") => {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

export const compactText = (value = "", maxLength = 160) => {
  const text = value.replace(/\s+/g, " ").trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 1).trim()}...` : text;
};

export const getProductSlug = (product: Partial<Product>) =>
  product.slug || slugify(product.name || product.productCode || product._id || "");

export const productPath = (product: Partial<Product>) => {
  const identifier = product.productCode || product.slug || product._id || "";
  return `/product/${encodeURIComponent(identifier)}`;
};

export const categoryPath = (categoryId?: string, subcategoryId?: string) => {
  const base = categoryId ? `/category/${categoryId}` : "/products";
  return subcategoryId ? `${base}?subcategory=${encodeURIComponent(subcategoryId)}` : base;
};

export const categoryName = (categoryId?: string) =>
  categories.find(category => category.id === categoryId)?.name || categoryId?.replace(/-/g, " ") || "";

export const subcategoryName = (categoryId?: string, subcategoryId?: string) =>
  categories
    .find(category => category.id === categoryId)
    ?.subcategories?.find(subcategory => subcategory.id === subcategoryId)
    ?.name || subcategoryId?.replace(/-/g, " ") || "";

export const buildProductSeo = (product: Product): SeoConfig => {
  const categoryLabel = categoryName(product.category);
  const keywords = [
    ...(product.seo?.keywords || []),
    ...(product.searchKeywords || []),
    ...(product.tags || []),
    product.name,
    product.brand,
    categoryLabel,
    SITE_NAME
  ].filter(Boolean);

  return {
    title: product.seo?.title || `${product.name} Online | ${SITE_NAME}`,
    description: product.seo?.description || compactText(`${product.description} Shop ${product.name}${categoryLabel ? ` in ${categoryLabel}` : ""} from ${SITE_NAME}.`, 160),
    keywords,
    canonicalUrl: product.seo?.canonicalUrl || absoluteUrl(productPath(product)),
    robots: product.seo?.noIndex ? "noindex, follow" : "index, follow",
    image: product.images?.[0]?.url,
    type: "product",
  };
};

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: absoluteUrl("/placeholder.svg"),
  sameAs: []
});

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
});

export const breadcrumbSchema = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path)
  }))
});

export const productSchema = (product: Product) => {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: compactText(product.description, 500),
    sku: product.productCode,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : { "@type": "Brand", name: SITE_NAME },
    category: categoryName(product.category),
    image: product.images?.map(image => image.url).filter(Boolean),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(productPath(product)),
      priceCurrency: "INR",
      price: product.price,
      availability: product.inStock && product.stockQuantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition"
    }
  };

  if (product.rating > 0 && product.reviewCount > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount
    };
  }

  return schema;
};

export const collectionSchema = (name: string, description: string, path: string) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name,
  description,
  url: absoluteUrl(path)
});

export const faqSchema = (items: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map(item => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer
    }
  }))
});
