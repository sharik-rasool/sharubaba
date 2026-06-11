import ExcelJS from "exceljs";
import path from "path";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const BASE_URL = "https://www.sharikrasool.com";

// 1. Static Core Pages (Always the same core paths)
const staticPages = [
    {
        name: "Homepage",
        path: "/",
        title: "Sharik Rasool | SEO Strategist & Link Builder for SaaS Brands",
        description: "Expert SEO strategist and link builder with 7+ years of experience helping SaaS and tech companies grow organically. 500+ high-quality backlinks built.",
        robots: "index, follow",
        canonical: BASE_URL,
        status: "Indexed",
        notes: "Primary landing route. Fully optimized."
    },
    {
        name: "About Page",
        path: "/about",
        title: "About Sharik Rasool | Expert SEO Strategist & SaaS Link Builder",
        description: "Learn about Sharik Rasool's 7+ years of experience in SEO strategy and link building. MBA in Digital Marketing with proven results for SaaS and tech companies.",
        robots: "index, follow",
        canonical: `${BASE_URL}/about`,
        status: "Indexed",
        notes: "Detailed bio and career timeline. Visual overlap timeline bugs resolved."
    },
    {
        name: "Blog Index",
        path: "/blog",
        title: "SEO Blog | Actionable Link Building & SEO Strategies by Sharik",
        description: "Explore actionable SEO and link building strategies. Get expert tips on growing organic traffic, boosting domain authority, and scaling SaaS search rankings.",
        robots: "index, follow",
        canonical: `${BASE_URL}/blog`,
        status: "Indexed",
        notes: "Directory listing of all blogs."
    },
    {
        name: "Projects & Case Studies",
        path: "/projects",
        title: "SEO Projects & Case Studies | SaaS & Tech Growth Results by Sharik",
        description: "Explore successful SEO and link building case studies. See how strategic campaign optimization drives domain authority, traffic growth, and search rankings.",
        robots: "index, follow",
        canonical: `${BASE_URL}/projects`,
        status: "Indexed",
        notes: "Case study showcase with styled premium grid."
    },
    {
        name: "Contact Page",
        path: "/contact",
        title: "Contact Sharik Rasool | Free SEO & Link Building Consultation",
        description: "Get in touch with Sharik Rasool for SEO strategy and link building services. Free initial consultation. Based in Srinagar, J&K, serving clients worldwide.",
        robots: "index, follow",
        canonical: `${BASE_URL}/contact`,
        status: "Indexed",
        notes: "Lead capture form with verified EmailJS and Google Sheets webhook integration."
    },
    {
        name: "Tools Directory",
        path: "/tools",
        title: "Free Online Tools & Generators for Developers, Writers & Creators",
        description: "Explore a curated collection of free online tools and web calculators. Fast generators, text formatters, and utilities for developers, writers, and creators.",
        robots: "index, follow",
        canonical: `${BASE_URL}/tools`,
        status: "Indexed",
        notes: "Tools main routing index. Added missing canonical and OG meta tags."
    },
    {
        name: "Privacy Policy",
        path: "/privacy-policy",
        title: "Privacy Policy | Data Protection & Privacy Rights | Sharik Rasool",
        description: "Read the official privacy policy for Sharik Rasool's website and SEO services. Learn how we collect, protect, and use your personal information and cookies.",
        robots: "index, follow",
        canonical: `${BASE_URL}/privacy-policy`,
        status: "Indexed",
        notes: "Legal policy page. Included in sitemap.xml."
    },
    {
        name: "Terms of Service",
        path: "/terms",
        title: "Terms and Conditions of Service | Sharik Rasool SEO Consultant",
        description: "Read the official terms and conditions for using Sharik Rasool's website and SEO services. Learn about our service agreements, liabilities, and legal rules.",
        robots: "index, follow",
        canonical: `${BASE_URL}/terms`,
        status: "Indexed",
        notes: "Legal agreement terms. Included in sitemap.xml."
    },
    {
        name: "Refund Policy",
        path: "/refund-policy",
        title: "Refund and Cancellation Policy | Sharik Rasool SEO Consultant",
        description: "Read the official refund and cancellation policy for Sharik Rasool's SEO and link building services. Learn about contract termination and refund eligibility.",
        robots: "index, follow",
        canonical: `${BASE_URL}/refund-policy`,
        status: "Indexed",
        notes: "Legal policies. Included in sitemap.xml."
    }
];

// 2. Interactive Tools (Imported dynamically from src/lib/tools-data)
import { toolsData } from "../src/lib/tools-data";
const toolPages = toolsData.map(tool => ({
    name: tool.title,
    path: `/tools/${tool.slug}`,
    title: tool.metaTitle,
    description: tool.metaDescription,
    robots: "index, follow",
    canonical: `${BASE_URL}/tools/${tool.slug}`,
    status: "Indexed",
    notes: "Custom WebApplication JSON-LD schema injected. Self-referencing canonical fixed."
}));

// 3. Admin Dashboard
const adminPages = [
    {
        name: "Admin Login Screen",
        path: "/admin/login",
        title: "Admin — Sharik Rasool",
        description: "N/A",
        robots: "noindex, nofollow",
        canonical: "N/A",
        status: "Excluded (Noindex Set)",
        notes: "Admin auth portal. Set to noindex. Disallowed in robots.txt."
    },
    {
        name: "Admin Dashboard Root",
        path: "/admin",
        title: "Admin — Sharik Rasool",
        description: "N/A",
        robots: "noindex, nofollow",
        canonical: "N/A",
        status: "Excluded (Noindex Set)",
        notes: "Dashboard main console. Protected by auth middleware."
    },
    {
        name: "Manage Blogs Console",
        path: "/admin/blogs",
        title: "Admin — Sharik Rasool",
        description: "N/A",
        robots: "noindex, nofollow",
        canonical: "N/A",
        status: "Excluded (Noindex Set)",
        notes: "Manage active blogs. Protected by auth middleware."
    },
    {
        name: "Create New Blog Editor",
        path: "/admin/blogs/new",
        title: "Admin — Sharik Rasool",
        description: "N/A",
        robots: "noindex, nofollow",
        canonical: "N/A",
        status: "Excluded (Noindex Set)",
        notes: "Blog publishing editor. Protected by auth middleware."
    },
    {
        name: "Edit Blog Editor",
        path: "/admin/blogs/[id]/edit",
        title: "Admin — Sharik Rasool",
        description: "N/A",
        robots: "noindex, nofollow",
        canonical: "N/A",
        status: "Excluded (Noindex Set)",
        notes: "Dynamic blog editing screen. Protected by auth middleware."
    },
    {
        name: "SEO Diagnostics Panel",
        path: "/admin/blogs/diagnostics",
        title: "Admin — Sharik Rasool",
        description: "N/A",
        robots: "noindex, nofollow",
        canonical: "N/A",
        status: "Excluded (Noindex Set)",
        notes: "SEO audit diagnostics and crawler reports. Protected by auth middleware."
    }
];

// Helper to style worksheets
function populateWorksheet(workbook: ExcelJS.Workbook, name: string, data: any[], tabColor: string) {
    const ws = workbook.addWorksheet(name, {
        views: [{ showGridLines: true }],
        properties: { tabColor: { argb: tabColor } }
    });

    // Title banner block
    ws.mergeCells("A1:J2");
    const bannerCell = ws.getCell("A1");
    bannerCell.value = `sharikrasool.com — Website SEO Audit & Pages Catalog [${name}]`;
    bannerCell.font = { name: "Arial", size: 14, bold: true, color: { argb: "FFFFFFFF" } };
    bannerCell.alignment = { vertical: "middle", horizontal: "center" };
    bannerCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF1E3A8A" }
    };

    // Columns
    ws.columns = [
        { header: "Page Name", key: "name", width: 25 },
        { header: "URL Path", key: "path", width: 35 },
        { header: "Full URL", key: "fullUrl", width: 45 },
        { header: "Meta Title", key: "title", width: 40 },
        { header: "Meta Description", key: "description", width: 50 },
        { header: "Robots Directive", key: "robots", width: 20 },
        { header: "Canonical Link", key: "canonical", width: 45 },
        { header: "Indexing Status", key: "status", width: 22 },
        { header: "Last Checked Date", key: "checked", width: 18 },
        { header: "SEO Notes / Updates", key: "notes", width: 45 }
    ];

    // Headers
    ws.getRow(4).values = ws.columns.map(c => c.header);
    const headerRow = ws.getRow(4);
    headerRow.height = 28;
    headerRow.eachCell((cell) => {
        cell.font = { name: "Arial", size: 11, bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF3B82F6" }
        };
        cell.alignment = { vertical: "middle", horizontal: "left" };
        cell.border = {
            top: { style: "thin", color: { argb: "FFB91C1C" } },
            bottom: { style: "medium", color: { argb: "FF1D4ED8" } }
        };
    });

    // Populate rows
    data.forEach((item, index) => {
        const rowNumber = index + 5;
        const row = ws.getRow(rowNumber);
        
        row.values = {
            name: item.name,
            path: item.path,
            fullUrl: item.path === "N/A" ? "N/A" : `${BASE_URL}${item.path}`,
            title: item.title,
            description: item.description,
            robots: item.robots,
            canonical: item.canonical,
            status: item.status,
            checked: new Date().toLocaleDateString(),
            notes: item.notes
        };

        row.height = 22;

        const isEven = index % 2 === 0;
        row.eachCell((cell) => {
            cell.font = { name: "Arial", size: 10 };
            cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
            cell.border = {
                bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
                left: { style: "thin", color: { argb: "FFE5E7EB" } },
                right: { style: "thin", color: { argb: "FFE5E7EB" } }
            };
            
            if (isEven) {
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFF9FAFB" }
                };
            }
        });

        // Cell dropdown validation
        const statusCell = ws.getCell(`H${rowNumber}`);
        statusCell.dataValidation = {
            type: 'list',
            allowBlank: true,
            formulae: ['"Indexed,Not Indexed,Excluded (Noindex Set)"'],
            showErrorMessage: true,
            errorTitle: 'Invalid Status Value',
            error: 'Please select from the dropdown choices: Indexed, Not Indexed, Excluded (Noindex Set)'
        };
        
        if (item.status === "Indexed") {
            statusCell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFD1FAE5" }
            };
            statusCell.font = { name: "Arial", size: 10, color: { argb: "FF065F46" }, bold: true };
        } else if (item.status === "Excluded (Noindex Set)") {
            statusCell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFEE2E2" }
            };
            statusCell.font = { name: "Arial", size: 10, color: { argb: "FF991B1B" }, bold: true };
        }
    });

    ws.columns.forEach((col) => {
        col.key = col.key; 
    });
}

async function fetchLiveBlogs() {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.warn("MONGODB_URI not found. Falling back to empty blog list.");
        return [];
    }

    const client = new MongoClient(mongoUri);
    try {
        await client.connect();
        const db = client.db();
        const posts = await db.collection("blogs")
            .find({ status: "published" })
            .sort({ createdAt: -1 })
            .toArray();

        return posts.map(blog => ({
            name: blog.title || "Untitled Post",
            path: `/blog/${blog.slug}`,
            title: blog.seoTitle || blog.title || "",
            description: blog.seoDescription || blog.excerpt || "",
            robots: blog.robotsMeta || "index, follow",
            canonical: blog.canonicalUrl || `${BASE_URL}/blog/${blog.slug}`,
            status: "Indexed",
            notes: `Live DB Blog Post. Last updated on ${blog.updatedAt ? new Date(blog.updatedAt).toLocaleDateString() : "N/A"}.`
        }));
    } catch (err: any) {
        console.error("Failed to fetch blogs from database:", err.message);
        return [];
    } finally {
        await client.close();
    }
}

async function main() {
    console.log("Fetching live blogs from database...");
    const blogPages = await fetchLiveBlogs();
    console.log(`Successfully fetched ${blogPages.length} live blog posts.`);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Sharik Rasool SEO Consultant";
    workbook.lastModifiedBy = "Sharik Rasool";
    workbook.created = new Date();
    workbook.modified = new Date();

    populateWorksheet(workbook, "Static Core Pages", staticPages, "FF3B82F6"); // Blue
    populateWorksheet(workbook, "Blog Posts Pages", blogPages, "FF10B981"); // Green
    populateWorksheet(workbook, "Interactive Tools", toolPages, "FFF59E0B"); // Orange
    populateWorksheet(workbook, "Admin Console", adminPages, "FFEF4444"); // Red

    const filename = "website_pages_seo_audit.xlsx";
    const filepath = path.join(process.cwd(), filename);

    await workbook.xlsx.writeFile(filepath);
    console.log(`Successfully generated dynamic Excel spreadsheet at: ${filepath}`);
}

main().catch(err => {
    console.error("Failed to generate sheet:", err);
    process.exit(1);
});
