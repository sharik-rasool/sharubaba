"use client";

import { useState, useRef, useEffect } from "react";
import { RefreshCw, Copy, Check, ArrowLeft, Trash2, Download, Smile, Grid, Sparkles, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

// Emoticon customization assets
const borders = [
    { name: "Standard Brackets", left: "[ ", right: " ]" },
    { name: "Thick Brackets", left: "【 ", right: " 】" },
    { name: "Double Line", left: "║ ", right: " ║" },
    { name: "Single Border", left: "│ ", right: " │" },
    { name: "Bold Corners", left: "⌈ ", right: " ⌉" },
    { name: "Rounded Corner", left: "⦗ ", right: " ⦘" },
    { name: "Japanese Corner", left: "〔 ", right: " 〕" },
];

const eyebrows = [
    { name: "None", left: "", right: "" },
    { name: "Angry", left: "｀", right: "´" },
    { name: "Worried", left: "´", right: "｀" },
    { name: "Straight", left: "¯", right: "¯" },
    { name: "Curved", left: "ノ", right: "ヾ" },
    { name: "Sad", left: "︶", right: "︶" },
];

const eyes = [
    { name: "Normal", left: "•", right: "•" },
    { name: "Happy", left: "^", right: "^" },
    { name: "Large", left: "●", right: "●" },
    { name: "Shocked", left: "◉", right: "◉" },
    { name: "Sleepy", left: "￣", right: "￣" },
    { name: "Dead/Cross", left: "x", right: "x" },
    { name: "Hearts", left: "♥", right: "♥" },
    { name: "Stars", left: "★", right: "★" },
    { name: "Pixel Blocks", left: "■", right: "■" },
    { name: "Winking", left: "•", right: "o" },
];

const cheeks = [
    { name: "None", left: "", right: "" },
    { name: "Blush Lines", left: "〃", right: "〃" },
    { name: "Cute Stars", left: "*", right: "*" },
    { name: "Blush Waves", left: "〜", right: "〜" },
    { name: "Lines / Waves", left: "//", right: "//" },
];

const mouths = [
    { name: "Neutral", char: "_" },
    { name: "Smile", char: "‿" },
    { name: "Big Smile", char: "◡" },
    { name: "Open/Gasps", char: "o" },
    { name: "Smirk", char: "⏝" },
    { name: "Angry / Grid", char: "益" },
    { name: "Kiss", char: "ε" },
    { name: "Moustached", char: "ω" },
    { name: "Doubtful", char: "﹏" },
    { name: "Happy Open", char: "▽" },
];

const actions = [
    { name: "None", left: "", right: "" },
    { name: "Shrug", left: "¯\\_", right: "_/¯" },
    { name: "Wave Hand", left: "", right: "ノ" },
    { name: "Pointing", left: "(☞ ", right: " )☞" },
    { name: "Table Flip", left: "(╯°□°）╯︵ ", right: "" },
    { name: "Hooray Hands", left: "＼", right: "／" },
];

const predefinedEmoticons = [
    { text: "【 • ‿ • 】", description: "Cute & Friendly" },
    { text: "[ ◉ _ ◉ ]", description: "Robot Face" },
    { text: "¯\\_【 ￣ _ ￣ 】_/¯", description: "Shrug Indifferent" },
    { text: "【 ♥ _ ♥ 】", description: "In Love" },
    { text: "[ ｀益´ ]", description: "Angry Blocks" },
    { text: "【 * ◡ * 】", description: "Blushing Cute" },
    { text: "║ ★ ω ★ ║", description: "Magical Sensation" },
    { text: "〔 x ﹏ x 〕", description: "Dead / Exhausted" },
    { text: "【 ︶ o ︶ 】", description: "Yawning / Tired" },
    { text: "⦗ ⁀ ⏝ ⁀ ⦘", description: "Cheerfully Happy" },
];

// Pixel Art Canvas templates (8x8)
const pixelTemplates = [
    {
        name: "Creeper",
        grid: [
            1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1,
            1, 0, 0, 1, 1, 0, 0, 1,
            1, 0, 0, 1, 1, 0, 0, 1,
            1, 1, 1, 0, 0, 1, 1, 1,
            1, 1, 0, 0, 0, 0, 1, 1,
            1, 1, 0, 0, 0, 0, 1, 1,
            1, 1, 0, 1, 1, 0, 1, 1
        ],
        colors: { 1: "#22c55e", 0: "#000000" } // green and black
    },
    {
        name: "Robot",
        grid: [
            0, 0, 1, 1, 1, 1, 0, 0,
            0, 1, 2, 2, 2, 2, 1, 0,
            1, 2, 3, 2, 2, 3, 2, 1,
            1, 2, 2, 2, 2, 2, 2, 1,
            1, 2, 2, 4, 4, 2, 2, 1,
            0, 1, 2, 2, 2, 2, 1, 0,
            0, 0, 1, 1, 1, 1, 0, 0,
            0, 0, 0, 1, 1, 0, 0, 0
        ],
        colors: { 0: "#00000000", 1: "#64748b", 2: "#94a3b8", 3: "#38bdf8", 4: "#ef4444" } // slate and blue/red eyes
    },
    {
        name: "Steve (Minecraft)",
        grid: [
            1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1,
            2, 2, 2, 2, 2, 2, 2, 2,
            2, 3, 3, 2, 2, 3, 3, 2,
            2, 2, 2, 4, 4, 2, 2, 2,
            2, 2, 5, 5, 5, 5, 2, 2,
            2, 2, 5, 5, 5, 5, 2, 2,
            2, 2, 2, 2, 2, 2, 2, 2
        ],
        colors: { 1: "#3c2d1b", 2: "#c98f65", 3: "#ffffff", 4: "#9b6043", 5: "#5c3317" } // steve color tones
    },
    {
        name: "Smile Face",
        grid: [
            0, 0, 1, 1, 1, 1, 0, 0,
            0, 1, 1, 1, 1, 1, 1, 0,
            1, 1, 2, 1, 1, 2, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1,
            1, 3, 1, 1, 1, 1, 3, 1,
            1, 1, 3, 3, 3, 3, 1, 1,
            0, 1, 1, 1, 1, 1, 1, 0,
            0, 0, 1, 1, 1, 1, 0, 0
        ],
        colors: { 0: "#00000000", 1: "#eab308", 2: "#000000", 3: "#a16207" } // yellow emoji face
    },
    {
        name: "Alien / Space Invader",
        grid: [
            0, 0, 1, 0, 0, 1, 0, 0,
            0, 0, 0, 1, 1, 0, 0, 0,
            0, 0, 1, 1, 1, 1, 0, 0,
            0, 1, 1, 0, 0, 1, 1, 0,
            1, 1, 1, 1, 1, 1, 1, 1,
            1, 0, 1, 1, 1, 1, 0, 1,
            1, 0, 1, 0, 0, 1, 0, 1,
            0, 0, 0, 1, 1, 0, 0, 0
        ],
        colors: { 0: "#00000000", 1: "#a855f7" } // purple alien
    }
];

export function SquareFaceGeneratorTool() {
    const { toast } = useToast();
    
    // Kaomoji States
    const [selectedBorder, setSelectedBorder] = useState(0);
    const [selectedEyebrow, setSelectedEyebrow] = useState(0);
    const [selectedEye, setSelectedEye] = useState(0);
    const [selectedCheek, setSelectedCheek] = useState(0);
    const [selectedMouth, setSelectedMouth] = useState(1);
    const [selectedAction, setSelectedAction] = useState(0);
    const [kaomojiOutput, setKaomojiOutput] = useState("");
    const [kaomojiCopied, setKaomojiCopied] = useState(false);

    // Pixel Art States
    const [gridSize] = useState(8);
    const [pixelGrid, setPixelGrid] = useState<string[]>(Array(64).fill("#00000000")); // Transparent canvas
    const [selectedColor, setSelectedColor] = useState("#3b82f6"); // Blue as default drawing color
    const [customColor, setCustomColor] = useState("#3b82f6");
    const [isDrawing, setIsDrawing] = useState(false);
    const [unicodeCopied, setUnicodeCopied] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Predefined colors for drawing palette
    const colorPalette = [
        "#000000", // Black
        "#64748b", // Slate Grey
        "#ef4444", // Red
        "#f97316", // Orange
        "#eab308", // Yellow
        "#22c55e", // Green
        "#3b82f6", // Blue
        "#a855f7", // Purple
        "#ec4899", // Pink
        "#ffffff", // White
        "#00000000", // Eraser / Transparent
    ];

    // Generate Kaomoji on setting changes
    useEffect(() => {
        const border = borders[selectedBorder];
        const eyebrow = eyebrows[selectedEyebrow];
        const eye = eyes[selectedEye];
        const cheek = cheeks[selectedCheek];
        const mouth = mouths[selectedMouth];
        const action = actions[selectedAction];

        // Format face parts
        const face = `${eyebrow.left}${cheek.left}${eye.left} ${mouth.char} ${eye.right}${cheek.right}${eyebrow.right}`;
        const output = `${action.left}${border.left}${face}${border.right}${action.right}`;

        setKaomojiOutput(output);
    }, [selectedBorder, selectedEyebrow, selectedEye, selectedCheek, selectedMouth, selectedAction]);

    const randomizeKaomoji = () => {
        setSelectedBorder(Math.floor(Math.random() * borders.length));
        setSelectedEyebrow(Math.floor(Math.random() * eyebrows.length));
        setSelectedEye(Math.floor(Math.random() * eyes.length));
        setSelectedCheek(Math.floor(Math.random() * cheeks.length));
        setSelectedMouth(Math.floor(Math.random() * mouths.length));
        setSelectedAction(Math.floor(Math.random() * actions.length));
        
        toast({ title: "Randomized Square Kaomoji Face!" });
    };

    const copyKaomoji = (textToCopy: string) => {
        navigator.clipboard.writeText(textToCopy);
        setKaomojiCopied(true);
        toast({ title: "Copied square emoticon to clipboard!" });
        setTimeout(() => setKaomojiCopied(false), 2000);
    };

    // Pixel drawing triggers
    const handleCellAction = (index: number) => {
        const newGrid = [...pixelGrid];
        newGrid[index] = selectedColor;
        setPixelGrid(newGrid);
    };

    const handleMouseDown = (index: number) => {
        setIsDrawing(true);
        handleCellAction(index);
    };

    const handleMouseEnter = (index: number) => {
        if (isDrawing) {
            handleCellAction(index);
        }
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearPixelGrid = () => {
        setPixelGrid(Array(gridSize * gridSize).fill("#00000000"));
        toast({ title: "Cleared pixel art canvas!" });
    };

    const loadPixelTemplate = (templateIndex: number) => {
        const template = pixelTemplates[templateIndex];
        const newGrid = template.grid.map(val => {
            const hex = template.colors[val as keyof typeof template.colors];
            return hex || "#00000000";
        });
        setPixelGrid(newGrid);
        toast({ title: `Loaded ${template.name} face template!` });
    };

    // Export pixel art as Unicode blocks
    const getUnicodeBlockString = (): string => {
        let text = "";
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                const idx = r * gridSize + c;
                const color = pixelGrid[idx];
                // If transparent or white, use light shadow block. If colored, use full block
                if (color === "#00000000") {
                    text += "░░";
                } else if (color === "#ffffff") {
                    text += "▒▒";
                } else {
                    text += "██";
                }
            }
            text += "\n";
        }
        return text;
    };

    const copyUnicodeBlocks = () => {
        const text = getUnicodeBlockString();
        navigator.clipboard.writeText(text);
        setUnicodeCopied(true);
        toast({ title: "Copied Unicode pixel blocks to clipboard!" });
        setTimeout(() => setUnicodeCopied(false), 2000);
    };

    // Draw grid to HTML Canvas and trigger PNG download
    const downloadPng = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Size: 512x512 pixels
        const size = 512;
        canvas.width = size;
        canvas.height = size;
        const cellPixelSize = size / gridSize;

        ctx.clearRect(0, 0, size, size);

        // Draw each grid block
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                const idx = r * gridSize + c;
                const color = pixelGrid[idx];

                if (color === "#00000000") {
                    // Transparent cells: keep transparent
                    continue;
                }
                ctx.fillStyle = color;
                ctx.fillRect(c * cellPixelSize, r * cellPixelSize, cellPixelSize, cellPixelSize);
            }
        }

        // Trigger file download
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `square-face-pixel-art.png`;
        link.href = image;
        link.click();
        
        toast({ title: "Downloaded PNG avatar!" });
    };

    return (
        <section className="section bg-muted/20 min-h-screen">
            <div className="container-narrow">
                <Link href="/tools" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Tools
                </Link>

                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">▢‿▢</div>
                    <h1 className="text-4xl font-extrabold mb-4 text-foreground tracking-tight">Square Face Generator</h1>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        Design retro text-based emoticons or draw customizable 8-bit square avatar faces.
                    </p>
                </div>

                <Tabs defaultValue="text" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md mx-auto">
                        <TabsTrigger value="text" className="gap-2">
                            <Smile className="h-4 w-4" />
                            ASCII Kaomoji
                        </TabsTrigger>
                        <TabsTrigger value="pixel" className="gap-2">
                            <Grid className="h-4 w-4" />
                            Retro Pixel Canvas
                        </TabsTrigger>
                    </TabsList>

                    {/* TABS CONTENT: ASCII KAOMOJI */}
                    <TabsContent value="text" className="space-y-6">
                        <Card className="border-border/50 shadow-sm overflow-hidden">
                            <div className="bg-primary/5 py-12 px-6 flex flex-col items-center justify-center border-b border-border/40 min-h-[160px]">
                                <span className="text-4xl sm:text-5xl font-mono text-primary select-all break-all tracking-wide font-semibold text-center select-all">
                                    {kaomojiOutput}
                                </span>
                            </div>
                            <CardContent className="p-6 flex flex-wrap gap-4 justify-center bg-card">
                                <Button onClick={() => copyKaomoji(kaomojiOutput)} size="lg" className="gap-2 font-bold px-8">
                                    {kaomojiCopied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                                    {kaomojiCopied ? "Copied!" : "Copy Face"}
                                </Button>
                                <Button onClick={randomizeKaomoji} variant="outline" size="lg" className="gap-2 px-6">
                                    <RefreshCw className="h-5 w-5" />
                                    Randomize
                                </Button>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Controls Card */}
                            <Card className="border-border/50">
                                <CardContent className="p-6 space-y-6">
                                    <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-3 mb-4">
                                        <Palette className="h-5 w-5 text-primary" />
                                        Customize Features
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        {/* Border Selector */}
                                        <div className="space-y-2">
                                            <Label>Square Frame Style</Label>
                                            <select 
                                                value={selectedBorder} 
                                                onChange={(e) => setSelectedBorder(Number(e.target.value))}
                                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            >
                                                {borders.map((b, idx) => (
                                                    <option key={idx} value={idx}>{b.name} ({b.left}...{b.right})</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Eyes Selector */}
                                        <div className="space-y-2">
                                            <Label>Eyes</Label>
                                            <select 
                                                value={selectedEye} 
                                                onChange={(e) => setSelectedEye(Number(e.target.value))}
                                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            >
                                                {eyes.map((e, idx) => (
                                                    <option key={idx} value={idx}>{e.name} ({e.left} _ {e.right})</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Mouth Selector */}
                                        <div className="space-y-2">
                                            <Label>Mouth</Label>
                                            <select 
                                                value={selectedMouth} 
                                                onChange={(e) => setSelectedMouth(Number(e.target.value))}
                                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            >
                                                {mouths.map((m, idx) => (
                                                    <option key={idx} value={idx}>{m.name} ({m.char})</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Eyebrows Selector */}
                                        <div className="space-y-2">
                                            <Label>Eyebrows</Label>
                                            <select 
                                                value={selectedEyebrow} 
                                                onChange={(e) => setSelectedEyebrow(Number(e.target.value))}
                                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            >
                                                {eyebrows.map((b, idx) => (
                                                    <option key={idx} value={idx}>{b.name} {b.left ? `(${b.left}...${b.right})` : ""}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Cheeks Selector */}
                                        <div className="space-y-2">
                                            <Label>Cheeks / Blush</Label>
                                            <select 
                                                value={selectedCheek} 
                                                onChange={(e) => setSelectedCheek(Number(e.target.value))}
                                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            >
                                                {cheeks.map((c, idx) => (
                                                    <option key={idx} value={idx}>{c.name} {c.left ? `(${c.left}...${c.right})` : ""}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Action/Hand Selector */}
                                        <div className="space-y-2">
                                            <Label>Pose Action</Label>
                                            <select 
                                                value={selectedAction} 
                                                onChange={(e) => setSelectedAction(Number(e.target.value))}
                                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            >
                                                {actions.map((a, idx) => (
                                                    <option key={idx} value={idx}>{a.name} {a.left || a.right ? `(${a.left}...${a.right})` : ""}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Preset Kaomojis Card */}
                            <Card className="border-border/50">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-3 mb-4">
                                        <Sparkles className="h-5 w-5 text-primary" />
                                        Popular Presets
                                    </h3>
                                    
                                    <div className="space-y-3">
                                        {predefinedEmoticons.map((emo, idx) => (
                                            <div 
                                                key={idx} 
                                                className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/70 transition-colors group"
                                            >
                                                <div className="flex flex-col">
                                                    <span className="font-mono font-semibold text-foreground text-lg">{emo.text}</span>
                                                    <span className="text-[11px] text-muted-foreground uppercase font-medium tracking-wide mt-0.5">{emo.description}</span>
                                                </div>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    onClick={() => copyKaomoji(emo.text)}
                                                    className="opacity-60 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* TABS CONTENT: RETRO PIXEL CANVAS */}
                    <TabsContent value="pixel" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            {/* Left: Interactive Canvas Grid */}
                            <Card className="lg:col-span-7 border-border/50">
                                <CardContent className="p-6 flex flex-col items-center">
                                    {/* Draw Canvas Grid */}
                                    <div 
                                        className="aspect-square w-full max-w-[380px] bg-muted/50 rounded-xl border border-border/85 grid overflow-hidden shadow-inner p-2 select-none"
                                        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
                                        onMouseLeave={stopDrawing}
                                    >
                                        {pixelGrid.map((color, idx) => (
                                            <div
                                                key={idx}
                                                onMouseDown={() => handleMouseDown(idx)}
                                                onMouseEnter={() => handleMouseEnter(idx)}
                                                onMouseUp={stopDrawing}
                                                className="border border-border/20 transition-colors duration-75 relative group cursor-crosshair"
                                                style={{ 
                                                    backgroundColor: color === "#00000000" ? "#ffffff00" : color,
                                                    // Chequered transparent background pattern
                                                    backgroundImage: color === "#00000000" 
                                                        ? `linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)` 
                                                        : "none",
                                                    backgroundSize: color === "#00000000" ? "12px 12px" : "auto",
                                                    backgroundPosition: color === "#00000000" ? "0 0, 0 6px, 6px -6px, -6px 0px" : "auto"
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-[11px] text-muted-foreground text-center mt-3 tracking-wide uppercase font-medium">
                                        Click or drag mouse to draw on the grid
                                    </p>
                                    
                                    <canvas ref={canvasRef} style={{ display: "none" }} />
                                </CardContent>
                            </Card>

                            {/* Right: Color Palette & Actions */}
                            <div className="lg:col-span-5 space-y-6">
                                <Card className="border-border/50">
                                    <CardContent className="p-6 space-y-6">
                                        {/* Color Palette */}
                                        <div className="space-y-3">
                                            <Label className="text-base font-bold">Draw Palette</Label>
                                            <div className="flex flex-wrap gap-2.5">
                                                {colorPalette.map((color, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setSelectedColor(color)}
                                                        className={`w-9 h-9 rounded-lg border transition-all ${
                                                            selectedColor === color 
                                                                ? "ring-2 ring-primary ring-offset-2 scale-105 border-primary" 
                                                                : "border-border hover:scale-105"
                                                        }`}
                                                        style={{ 
                                                            backgroundColor: color === "#00000000" ? "#ffffff00" : color,
                                                            // Chequered background for transparent eraser button
                                                            backgroundImage: color === "#00000000" 
                                                                ? `linear-gradient(45deg, #cbd5e1 25%, transparent 25%), linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cbd5e1 75%), linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)` 
                                                                : "none",
                                                            backgroundSize: "8px 8px",
                                                            backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px"
                                                        }}
                                                        title={color === "#00000000" ? "Eraser" : color}
                                                    />
                                                ))}
                                                {/* Custom Color Selector */}
                                                <div className="relative w-9 h-9 rounded-lg border border-border overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                                                    <input 
                                                        type="color" 
                                                        value={customColor}
                                                        onChange={(e) => {
                                                            setCustomColor(e.target.value);
                                                            setSelectedColor(e.target.value);
                                                        }}
                                                        className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer opacity-100"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Grid Actions */}
                                        <div className="flex gap-3">
                                            <Button onClick={clearPixelGrid} variant="outline" className="flex-1 gap-2 text-destructive border-destructive/25 hover:bg-destructive/10">
                                                <Trash2 className="h-4 w-4" />
                                                Clear Grid
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Template selector */}
                                <Card className="border-border/50">
                                    <CardContent className="p-6 space-y-4">
                                        <Label className="text-base font-bold block">Load Preset Avatars</Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {pixelTemplates.map((t, idx) => (
                                                <Button 
                                                    key={idx}
                                                    variant="secondary" 
                                                    onClick={() => loadPixelTemplate(idx)}
                                                    className="w-full text-xs font-semibold py-5"
                                                >
                                                    {t.name}
                                                </Button>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Export Cards */}
                                <Card className="border-border/50">
                                    <CardContent className="p-6 space-y-4">
                                        <Label className="text-base font-bold block">Export Art</Label>
                                        <div className="flex flex-col gap-3">
                                            {/* Export Block copy */}
                                            <Button onClick={copyUnicodeBlocks} variant="outline" className="w-full gap-2 font-bold py-6">
                                                {unicodeCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                                {unicodeCopied ? "Unicode Blocks Copied!" : "Copy Unicode Block Art"}
                                            </Button>

                                            {/* Download Image */}
                                            <Button onClick={downloadPng} className="w-full gap-2 font-bold py-6">
                                                <Download className="h-4 w-4" />
                                                Download PNG Avatar
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Educational SEO content section */}
                <div className="prose-custom mt-16 border-t border-border/50 pt-10 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold mb-4">What is a Square Face Generator?</h2>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                        A Square Face Generator is a utility designed to create emoticons, characters, and avatars that 
                        rely on standard square or block shapes. In internet culture, square emoticons and 8-bit block designs 
                        are popular due to their nostalgic resemblance to early retro gaming consoles and simple text-based chat formats.
                    </p>

                    <h3 className="text-xl font-semibold mb-3">Understanding the Formats: Kaomoji vs. Block Pixel Art</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                        Our tool supports the two most popular styles of square faces used online today:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-3 mb-8">
                        <li>
                            <strong>ASCII Kaomoji emoticons:</strong> These are constructed using Unicode text glyphs bounded 
                            by square brackets (like <code>[ ]</code> or <code>【 】</code>). They are highly popular in text chat, code comments, 
                            and forums because they do not require an image file to display.
                        </li>
                        <li>
                            <strong>Unicode Block / Pixel Art:</strong> This style uses colored blocks (such as <code>█</code>, <code>▒</code>, <code>░</code>) 
                            or color fills to form square-based grid characters. It is the core aesthetic style behind popular block-building voxel 
                            games like Minecraft and Roblox.
                        </li>
                    </ul>

                    <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
                    <div className="space-y-4 text-muted-foreground">
                        <div>
                            <h4 className="font-semibold text-foreground text-base mb-1">What can I use the downloaded PNG avatar images for?</h4>
                            <p className="text-sm leading-relaxed">
                                The exported PNG images are saved in a high-resolution square ratio (512x512 pixels), making them perfect for use as profile pictures or icons on social platforms like Discord, GitHub, Steam, or Twitter.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground text-base mb-1">How does the "Copy Unicode Block Art" feature work?</h4>
                            <p className="text-sm leading-relaxed">
                                This function generates your pixel art using standard Unicode shaded characters (<code>█</code> for colored pixels and <code>░</code> for transparent ones). This creates a text copy of your drawing that you can paste directly into chat boxes, Discord text messages, and terminal code.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground text-base mb-1">Is this generator mobile-friendly?</h4>
                            <p className="text-sm leading-relaxed">
                                Yes. The drawing canvas supports drag-to-draw gestures and touch inputs, so you can easily draw and export custom square pixel face avatars on any smartphone or tablet browser.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
