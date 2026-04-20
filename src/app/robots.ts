import type { MetadataRoute } from "next";

/**
 * robots.txt dinamico.
 *
 * In non-produzione (es. sessualmente.vercel.app o preview) blocchiamo
 * tutti i crawler: evita indicizzazione del dominio temporaneo prima
 * che ci sia un dominio custom definitivo.
 *
 * Quando `NEXT_PUBLIC_SITE_ENV=production` è impostata su Vercel, si
 * passa automaticamente a 'allow all' + riferimento alla sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";

  if (!isProduction) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    ...(siteUrl ? { sitemap: `${siteUrl.replace(/\/$/, "")}/sitemap.xml` } : {}),
  };
}
