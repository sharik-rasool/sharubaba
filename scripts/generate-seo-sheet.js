import ExcelJS from "exceljs";
import path from "path";

const BASE_URL = "https://www.sharikrasool.com";

// Data structures
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

const blogPages = [
    {
        name: "WordPress SEO Freelancer",
        path: "/blog/wordpress-seo-freelancer",
        title: "WordPress SEO Freelancer | SaaS Search Rankings growth",
        description: "Hire a professional WordPress SEO freelancer to optimize content hierarchy, crawl efficiency, meta tags, and build clean internal backlinks.",
        robots: "index, follow",
        canonical: `${BASE_URL}/blog/wordpress-seo-freelancer`,
        status: "Indexed",
        notes: "CMS published post. Repetitive brand suffix cleaned."
    },
    {
        name: "How to Start Freelancing for Beginners",
        path: "/blog/how-to-start-freelancing-for-beginners",
        title: "How to Start Freelancing for Beginners | Step-by-Step Guide",
        description: "A complete starter guide to choosing a niche, setting up your freelance services, and landing your first client with zero experience.",
        robots: "index, follow",
        canonical: `${BASE_URL}/blog/how-to-start-freelancing-for-beginners`,
        status: "Indexed",
        notes: "CMS published post. Repetitive brand suffix cleaned."
    },
    {
        name: "9 Freelancing Tips That Actually Work",
        path: "/blog/freelancing-tips-that-actually-works",
        title: "9 Freelancing Tips That Actually Work | Scale Your Business",
        description: "Actionable freelancing tips and productivity strategies for growing client contracts, structuring fees, and managing work-life balance.",
        robots: "index, follow",
        canonical: `${BASE_URL}/blog/freelancing-tips-that-actually-works`,
        status: "Indexed",
        notes: "CMS published post. Repetitive brand suffix cleaned."
    },
    {
        name: "The Pros and Cons of Freelancing",
        path: "/blog/the-pros-and-cons-of-freelancing",
        title: "The Pros and Cons of Freelancing | Career Choice Breakdown",
        description: "We weigh the advantages of flexible work schedules and freedom against the disadvantages of client acquisition and unstable income.",
        robots: "index, follow",
        canonical: `${BASE_URL}/blog/the-pros-and-cons-of-freelancing`,
        status: "Indexed",
        notes: "CMS published post. Repetitive brand suffix cleaned."
    },
    {
        name: "15 Best Freelancing Ideas to Build Career",
        path: "/blog/best-freelancing-ideas-to-build-career",
        title: "15 Best Freelancing Ideas to Build a Profitable Career",
        description: "Explore high-demand freelance career fields, including coding, SEO, copywriting, and design, to kickstart your freelancing journey.",
        robots: "index, follow",
        canonical: `${BASE_URL}/blog/best-freelancing-ideas-to-build-career`,
        status: "Indexed",
        notes: "CMS published post. Repetitive brand suffix cleaned."
    },
    {
        name: "How to Write a Freelance Resume",
        path: "/blog/how-to-write-a-freelancing-resume",
        title: "How to Write a Freelance Resume | Portfolios and Formats",
        description: "Learn how to structure a professional freelance resume to showcase contract projects, portfolios, and key skills to land corporate gigs.",
        robots: "index, follow",
        canonical: `${BASE_URL}/blog/how-to-write-a-freelancing-resume`,
        status: "Indexed",
        notes: "CMS published post. Repetitive brand suffix cleaned."
    },
    {
        name: "Freelance Social Media Manager Tips",
        path: "/blog/freelance-social-media-manager-tips",
        title: "Freelance Social Media Manager Tips | Client Acquisition",
        description: "Expert tips for freelance social media managers on onboarding clients, scaling content plans, and tracking engagement metrics.",
        robots: "index, follow",
        canonical: `${BASE_URL}/blog/freelance-social-media-manager-tips`,
        status: "Indexed",
        notes: "CMS published post. Repetitive brand suffix cleaned."
    },
    {
        name: "Freelancing vs Entrepreneurship Career Guide",
        path: "/blog/freelancing-vs-entrepreneurship-career-guide",
        title: "Freelancing vs Entrepreneurship | Which Career is Best?",
        description: "An in-depth comparison of freelance service contracts versus building a scalable startup business to find your perfect career path.",
        robots: "index, follow",
        canonical: `${BASE_URL}/blog/freelancing-vs-entrepreneurship-career-guide`,
        status: "Indexed",
        notes: "CMS published post. Repetitive brand suffix cleaned."
    },
    {
        name: "How to Start Freelancing as a Student",
        path: "/blog/how-to-start-freelancing-as-a-student",
        title: "How to Start Freelancing as a Student | Earn While Studying",
        description: "Learn how to balance university classes while earning a freelance income online with easy high-income digital service niches.",
        robots: "index, follow",
        canonical: `${BASE_URL}/blog/how-to-start-freelancing-as-a-student`,
        status: "Indexed",
        notes: "CMS published post. Repetitive brand suffix cleaned."
    }
];

const toolPages = [
    {
        name: "AI Image Prompt Generator",
        path: "/tools/chatgpt-image-generator",
        title: "AI Image Prompt Generator | Create Midjourney & DALL-E Prompts",
        description: "Generate detailed, creative prompts for ChatGPT, Midjourney, DALL-E, and Stable Diffusion. Boost your AI art generation quality with expert prompt templates.",
        robots: "index, follow",
        canonical: `${BASE_URL}/tools/chatgpt-image-generator`,
        status: "Indexed",
        notes: "Custom WebApplication JSON-LD schema injected. Self-referencing canonical fixed."
    },
    {
        name: "Elf Name Generator",
        path: "/tools/elf-name-generator",
        title: "Elf Name Generator | Create Mystical Elvish Names for Fantasy",
        description: "Generate unique mystical elvish names for fantasy characters, stories, and games. Try our free online elf name generator to find the perfect magical name.",
        robots: "index, follow",
        canonical: `${BASE_URL}/tools/elf-name-generator`,
        status: "Indexed",
        notes: "Custom WebApplication JSON-LD schema injected. Self-referencing canonical fixed."
    },
    {
        name: "IEEE Citation Generator",
        path: "/tools/ieee-citation-generator",
        title: "IEEE Citation Generator | Free Tool for Academic Paper Citations",
        description: "Generate properly formatted IEEE citations and bibliography entries for academic papers. Free online citation maker for research articles, books, and websites.",
        robots: "index, follow",
        canonical: `${BASE_URL}/tools/ieee-citation-generator`,
        status: "Indexed",
        notes: "Custom WebApplication JSON-LD schema injected. Self-referencing canonical fixed."
    },
    {
        name: "Japanese Name Generator",
        path: "/tools/japanese-name-generator",
        title: "Japanese Name Generator | Create Authentic Names with Meanings",
        description: "Create authentic Japanese names with their kanji characters and deep linguistic meanings. Free online tool for writers, gamers, and language enthusiasts.",
        robots: "index, follow",
        canonical: `${BASE_URL}/tools/japanese-name-generator`,
        status: "Indexed",
        notes: "Custom WebApplication JSON-LD schema injected. Self-referencing canonical fixed."
    },
    {
        name: "Random Animal Generator",
        path: "/tools/random-animal-generator",
        title: "Random Animal Generator | Discover Wild Species & Fun Facts",
        description: "Discover random animals from around the world with fascinating species facts, pictures, and habitat details. Fun and educational online animal generator tool.",
        robots: "index, follow",
        canonical: `${BASE_URL}/tools/random-animal-generator`,
        status: "Indexed",
        notes: "Custom WebApplication JSON-LD schema injected. Self-referencing canonical fixed."
    },
    {
        name: "Random NFL Team Generator",
        path: "/tools/random-nfl-team-generator",
        title: "Random NFL Team Generator | Pick Teams for Fantasy & Leagues",
        description: "Generate a random NFL team instantly for fantasy football leagues, challenges, or trivia games. Free online picker tool covering all thirty-two active teams.",
        robots: "index, follow",
        canonical: `${BASE_URL}/tools/random-nfl-team-generator`,
        status: "Indexed",
        notes: "Custom WebApplication JSON-LD schema injected. Self-referencing canonical fixed."
    },
    {
        name: "Random Pokémon Generator",
        path: "/tools/random-pokemon-generator",
        title: "Random Pokémon Generator | Pick Random Pokémon with Base Stats",
        description: "Generate random Pokémon instantly with complete base stats, types, and official descriptions. Perfect tool for fantasy drafts, team building, and challenges.",
        robots: "index, follow",
        canonical: `${BASE_URL}/tools/random-pokemon-generator`,
        status: "Indexed",
        notes: "Custom WebApplication JSON-LD schema injected. Self-referencing canonical fixed."
    }
];

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

// Helper to create and style worksheets
function populateWorksheet(workbook, name, data, tabColor) {
    const ws = workbook.addWorksheet(name, {
        views: [{ showGridLines: true }],
        properties: { tabColor: { argb: tabColor } }
    });

    // Main Title Banner Block
    ws.mergeCells("A1:J2");
    const bannerCell = ws.getCell("A1");
    bannerCell.value = `sharikrasool.com — Website SEO Audit & Pages Catalog [${name}]`;
    bannerCell.font = { name: "Arial", size: 16, bold: true, color: { argb: "FFFFFFFF" } };
    bannerCell.alignment = { vertical: "middle", horizontal: "center" };
    bannerCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF1E3A8A" } // Dark blue theme
    };

    // Columns structure definition
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

    // Push headers to row 4 (spacing after banner)
    ws.getRow(4).values = ws.columns.map(c => c.header);
    
    // Style Table Headers Row
    const headerRow = ws.getRow(4);
    headerRow.height = 28;
    headerRow.eachCell((cell) => {
        cell.font = { name: "Arial", size: 11, bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF3B82F6" } // Light blue accent theme
        };
        cell.alignment = { vertical: "middle", horizontal: "left" };
        cell.border = {
            top: { style: "thin", color: { argb: "FFB91C1C" } },
            bottom: { style: "medium", color: { argb: "FF1D4ED8" } }
        };
    });

    // Populate data
    data.forEach((item, index) => {
        const rowNumber = index + 5; // Start from row 5
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

        // Apply cell styling (zebra striping) and borders
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
                    fgColor: { argb: "FFF9FAFB" } // Very light grey zebra stripe
                };
            }
        });

        // Add index status selection dropdown (Data Validation)
        const statusCell = ws.getCell(`H${rowNumber}`);
        statusCell.dataValidation = {
            type: 'list',
            allowBlank: true,
            formulae: ['"Indexed,Not Indexed,Excluded (Noindex Set)"'],
            showErrorMessage: true,
            errorTitle: 'Invalid Status Value',
            error: 'Please select from the dropdown choices: Indexed, Not Indexed, Excluded (Noindex Set)'
        };
        
        // Color status cells based on default values
        if (item.status === "Indexed") {
            statusCell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFD1FAE5" } // Soft Green
            };
            statusCell.font = { name: "Arial", size: 10, color: { argb: "FF065F46" }, bold: true };
        } else if (item.status === "Excluded (Noindex Set)") {
            statusCell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFEE2E2" } // Soft Red
            };
            statusCell.font = { name: "Arial", size: 10, color: { argb: "FF991B1B" }, bold: true };
        }
    });

    // Make sure column keys align properly
    ws.columns.forEach((col) => {
        col.key = col.key; 
    });
}

async function main() {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Sharik Rasool SEO Consultant";
    workbook.lastModifiedBy = "Sharik Rasool";
    workbook.created = new Date();
    workbook.modified = new Date();

    // Populate Worksheet Tabs
    populateWorksheet(workbook, "Static Core Pages", staticPages, "FF3B82F6"); // Blue
    populateWorksheet(workbook, "Blog Posts Pages", blogPages, "FF10B981"); // Green
    populateWorksheet(workbook, "Interactive Tools", toolPages, "FFF59E0B"); // Orange
    populateWorksheet(workbook, "Admin Console", adminPages, "FFEF4444"); // Red

    const filename = "website_pages_seo_audit.xlsx";
    const filepath = path.join(process.cwd(), filename);

    await workbook.xlsx.writeFile(filepath);
    console.log(`Successfully generated stylized Excel spreadsheet at: ${filepath}`);
}

main().catch(err => {
    console.error("Failed to generate sheet:", err);
    process.exit(1);
});
