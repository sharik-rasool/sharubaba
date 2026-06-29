import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        
        // Extract query parameters
        const title = searchParams.get("title") || "Featured Article";
        const category = searchParams.get("category") || "SEO & Blogging";
        
        // Fetch Space Grotesk Bold font from Google Fonts CDN for a premium, custom look
        let fontData: ArrayBuffer | null = null;
        try {
            const fontUrl = "https://fonts.gstatic.com/s/spacegrotesk/v16/V8mDoQDjQSkFsp0R35Qv2bMYSMdcTWC8OB8.ttf";
            const fontRes = await fetch(fontUrl);
            if (fontRes.ok) {
                fontData = await fontRes.arrayBuffer();
            }
        } catch (e) {
            console.error("Failed to load custom font, falling back to default.", e);
        }

        const fontOptions = fontData ? [
            {
                name: "Space Grotesk",
                data: fontData,
                style: "normal" as const,
                weight: 700 as const,
            }
        ] : undefined;

        return new ImageResponse(
            (
                <div
                    style={{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        background: "radial-gradient(circle at 10% 10%, #1e1b4b 0%, #09090b 80%)",
                        padding: "80px",
                        boxSizing: "border-box",
                        fontFamily: fontData ? "Space Grotesk" : "sans-serif",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    {/* Glowing Accent Orb */}
                    <div
                        style={{
                            position: "absolute",
                            top: "-150px",
                            right: "-150px",
                            width: "500px",
                            height: "500px",
                            borderRadius: "100%",
                            background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0) 70%)",
                            display: "flex",
                        }}
                    />

                    {/* Glowing Accent Bottom Left */}
                    <div
                        style={{
                            position: "absolute",
                            bottom: "-200px",
                            left: "-100px",
                            width: "600px",
                            height: "600px",
                            borderRadius: "100%",
                            background: "radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0) 70%)",
                            display: "flex",
                        }}
                    />

                    {/* Top Section: Brand Name and Category Tag */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                        }}
                    >
                        {/* Brand Logo and Text */}
                        <div style={{ display: "flex", alignItems: "center" }}>
                            {/* Simple dynamic SVG logo icon */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "56px",
                                    height: "56px",
                                    borderRadius: "14px",
                                    background: "linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)",
                                    color: "white",
                                    fontSize: "24px",
                                    fontWeight: "bold",
                                }}
                            >
                                SR
                            </div>
                        </div>

                        {/* Category Pill Tag */}
                        <div
                            style={{
                                display: "flex",
                                padding: "8px 20px",
                                borderRadius: "100px",
                                background: "rgba(59, 130, 246, 0.12)",
                                border: "1px solid rgba(59, 130, 246, 0.3)",
                                color: "#60a5fa",
                                fontSize: "16px",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                                letterSpacing: "1px",
                            }}
                        >
                            {category}
                        </div>
                    </div>

                    {/* Middle Section: Article Title */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            marginTop: "40px",
                            marginBottom: "40px",
                        }}
                    >
                        <h1
                            style={{
                                fontSize: "56px",
                                fontWeight: "bold",
                                color: "white",
                                lineHeight: "1.25",
                                letterSpacing: "-1.5px",
                                margin: 0,
                                display: "flex",
                                flexWrap: "wrap",
                                textShadow: "0 4px 12px rgba(0,0,0,0.5)",
                            }}
                        >
                            {title}
                        </h1>
                    </div>

                    {/* Bottom Section: Author and Website URL */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                            paddingTop: "24px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                color: "rgba(255, 255, 255, 0.6)",
                                fontSize: "18px",
                                fontWeight: "500",
                            }}
                        >
                            <span style={{ marginRight: "8px" }}>By</span>
                            <span style={{ color: "white", fontWeight: "bold" }}>Sharik Rasool</span>
                        </div>
                        
                        <span
                            style={{
                                color: "#a855f7",
                                fontSize: "18px",
                                fontWeight: "bold",
                                letterSpacing: "0.5px",
                            }}
                        >
                            sharikrasool.com
                        </span>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
                fonts: fontOptions,
            }
        );
    } catch (e) {
        console.error("OG Generator Error:", e);
        return new Response("Failed to generate image", { status: 500 });
    }
}
