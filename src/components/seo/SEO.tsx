import { useEffect } from "react";
import {
  BRAND_IMAGE,
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_TITLE,
  SITE_NAME,
  SeoConfig,
  absoluteUrl
} from "@/lib/seo";

const upsertMeta = (selector: string, attribute: "name" | "property", key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
};

const upsertLink = (selector: string, rel: string, href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
};

export function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonicalPath,
  canonicalUrl,
  robots = "index, follow",
  image = BRAND_IMAGE,
  type = "website",
  structuredData
}: SeoConfig) {
  useEffect(() => {
    const resolvedTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    const resolvedCanonical = canonicalUrl || absoluteUrl(canonicalPath || window.location.pathname);
    const resolvedKeywords = Array.isArray(keywords) ? keywords.filter(Boolean).join(", ") : keywords;
    const resolvedImage = absoluteUrl(image);
    const schemas = Array.isArray(structuredData)
      ? structuredData.filter(Boolean)
      : structuredData
        ? [structuredData]
        : [];

    document.title = resolvedTitle;
    upsertMeta('meta[name="description"]', "name", "description", description);
    upsertMeta('meta[name="keywords"]', "name", "keywords", resolvedKeywords || DEFAULT_KEYWORDS);
    upsertMeta('meta[name="robots"]', "name", "robots", robots);
    upsertMeta('meta[name="theme-color"]', "name", "theme-color", "#0f3d2e");
    upsertMeta('meta[property="og:site_name"]', "property", "og:site_name", SITE_NAME);
    upsertMeta('meta[property="og:title"]', "property", "og:title", resolvedTitle);
    upsertMeta('meta[property="og:description"]', "property", "og:description", description);
    upsertMeta('meta[property="og:type"]', "property", "og:type", type);
    upsertMeta('meta[property="og:url"]', "property", "og:url", resolvedCanonical);
    upsertMeta('meta[property="og:image"]', "property", "og:image", resolvedImage);
    upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", resolvedTitle);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", resolvedImage);
    upsertLink('link[rel="canonical"]', "canonical", resolvedCanonical);

    document.head.querySelectorAll('script[data-seo-jsonld="true"]').forEach(node => node.remove());
    schemas.forEach(schema => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.seoJsonld = "true";
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      document.head.querySelectorAll('script[data-seo-jsonld="true"]').forEach(node => node.remove());
    };
  }, [canonicalPath, canonicalUrl, description, image, keywords, robots, structuredData, title, type]);

  return null;
}
