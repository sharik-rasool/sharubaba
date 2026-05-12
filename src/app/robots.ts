
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sharikrasool.com";
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/admin/", "/cdn-cgi/"],
        },
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}
