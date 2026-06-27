"use client";

import { useState } from "react";
import { RefreshCw, Copy, Check, ArrowLeft, GraduationCap, MapPin, Calendar, Compass, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface College {
    name: string;
    location: string;
    type: "Public" | "Private" | "Ivy League" | "International";
    established: number;
    mascot: string;
    mascotEmoji: string;
    funFact: string;
    description: string;
}

const colleges: College[] = [
    {
        name: "Massachusetts Institute of Technology (MIT)",
        location: "Cambridge, Massachusetts, USA",
        type: "Private",
        established: 1861,
        mascot: "Tim the Beaver",
        mascotEmoji: "🦫",
        funFact: "MIT's campus features a massive system of underground tunnels connecting many buildings.",
        description: "Known globally for its elite science, engineering, and technology programs, MIT is a powerhouse of research and innovation."
    },
    {
        name: "Harvard University",
        location: "Cambridge, Massachusetts, USA",
        type: "Ivy League",
        established: 1636,
        mascot: "John Harvard / Crimson",
        mascotEmoji: "🦁",
        funFact: "Harvard is the oldest institution of higher learning in the United States.",
        description: "A prestigious Ivy League university famous for its historical legacy, vast library system, and prominent global alumni."
    },
    {
        name: "Stanford University",
        location: "Stanford, California, USA",
        type: "Private",
        established: 1885,
        mascot: "Stanford Tree",
        mascotEmoji: "🌲",
        funFact: "Stanford has one of the largest single campuses in the United States, spanning over 8,180 acres.",
        description: "Located in the heart of Silicon Valley, Stanford is celebrated for its entrepreneurial spirit and close ties to the tech industry."
    },
    {
        name: "Princeton University",
        location: "Princeton, New Jersey, USA",
        type: "Ivy League",
        established: 1746,
        mascot: "The Tiger",
        mascotEmoji: "🐯",
        funFact: "Princeton's Nassau Hall briefly served as the United States Capitol for four months in 1783.",
        description: "Renowned for its beautiful Gothic architecture, world-class faculty, and a strong focus on undergraduate research."
    },
    {
        name: "Yale University",
        location: "New Haven, Connecticut, USA",
        type: "Ivy League",
        established: 1701,
        mascot: "Handsome Dan (Bulldog)",
        mascotEmoji: "🐶",
        funFact: "Handsome Dan was the first live collegiate mascot in the United States, establishing a trend in 1889.",
        description: "Famous for its residential college system, elite law school, and prominent arts and humanities departments."
    },
    {
        name: "California Institute of Technology (Caltech)",
        location: "Pasadena, California, USA",
        type: "Private",
        established: 1891,
        mascot: "The Beaver",
        mascotEmoji: "🦫",
        funFact: "Caltech manages NASA's Jet Propulsion Laboratory (JPL), which designs and operates planetary robotic spacecraft.",
        description: "An incredibly selective research university focusing heavily on science and engineering, with an outstanding Nobel laureate-to-student ratio."
    },
    {
        name: "University of California, Berkeley",
        location: "Berkeley, California, USA",
        type: "Public",
        established: 1868,
        mascot: "Oski the Bear",
        mascotEmoji: "🐻",
        funFact: "Berkeley researchers discovered 16 elements on the periodic table, including Californium and Berkelium.",
        description: "Regularly ranked as the top public university in the world, renowned for academic excellence, research output, and social activism."
    },
    {
        name: "University of Michigan",
        location: "Ann Arbor, Michigan, USA",
        type: "Public",
        established: 1817,
        mascot: "Wolverines",
        mascotEmoji: "🐺",
        funFact: "Michigan's football stadium, 'The Big House', is the largest stadium in the Western Hemisphere, seating over 107,000.",
        description: "A leading public research institution with top-tier athletic programs and a massive global alumni network."
    },
    {
        name: "University of Oxford",
        location: "Oxford, Oxfordshire, England",
        type: "International",
        established: 1096,
        mascot: "The Dark Blue",
        mascotEmoji: "🏰",
        funFact: "Oxford has no clear foundation date, but teaching existed there in some form since 1096, making it the oldest English-speaking university.",
        description: "A world-renowned collegiate research university that has educated British prime ministers, world leaders, and prominent thinkers."
    },
    {
        name: "University of Cambridge",
        location: "Cambridge, Cambridgeshire, England",
        type: "International",
        established: 1209,
        mascot: "The Light Blue",
        mascotEmoji: "🛶",
        funFact: "Cambridge was founded by scholars leaving Oxford after a dispute with local townspeople.",
        description: "Famous for its historic colleges, punting on the River Cam, and producing giants of science like Isaac Newton and Charles Darwin."
    },
    {
        name: "University of Tokyo",
        location: "Bunkyo, Tokyo, Japan",
        type: "International",
        established: 1877,
        mascot: "Ginkgo Leaf",
        mascotEmoji: "🍁",
        funFact: "The university's Akamon (Red Gate) is a national cultural property constructed in 1827 during the Edo period.",
        description: "The most prestigious university in Japan, known for its academic rigour and leadership in engineering, science, and public administration."
    },
    {
        name: "University of Toronto",
        location: "Toronto, Ontario, Canada",
        type: "International",
        established: 1827,
        mascot: "True Blue (Beaver)",
        mascotEmoji: "🦫",
        funFact: "Insulin was discovered at the University of Toronto by Frederick Banting and Charles Best in 1921.",
        description: "Canada's leading research university, famous for its collegiate system and contributions to deep learning and medicine."
    },
    {
        name: "University of Pennsylvania (UPenn)",
        location: "Philadelphia, Pennsylvania, USA",
        type: "Ivy League",
        established: 1740,
        mascot: "The Quaker",
        mascotEmoji: "🎩",
        funFact: "UPenn was founded by Benjamin Franklin, who advocated for a practical, multi-disciplinary education system.",
        description: "Home to the Wharton School of Business, UPenn is celebrated for its focus on interdisciplinary studies and civic engagement."
    },
    {
        name: "Columbia University",
        location: "New York City, New York, USA",
        type: "Ivy League",
        established: 1754,
        mascot: "Roaree the Lion",
        mascotEmoji: "🦁",
        funFact: "Columbia administers the annual Pulitzer Prizes, recognizing outstanding achievements in journalism and literature.",
        description: "An Ivy League university located in Manhattan, known for its historic campus, rigorous Core Curriculum, and global influence."
    },
    {
        name: "Cornell University",
        location: "Ithaca, New York, USA",
        type: "Ivy League",
        established: 1865,
        mascot: "Touchdown (Big Red Bear)",
        mascotEmoji: "🐻",
        funFact: "Cornell was the first university in the US to offer a degree in veterinary medicine and the first to admit women.",
        description: "The federal land-grant Ivy League university, combining elite academics with top-ranked agricultural, engineering, and hotel management schools."
    },
    {
        name: "ETH Zurich",
        location: "Zurich, Switzerland",
        type: "International",
        established: 1855,
        mascot: "Albert Einstein (Alumnus)",
        mascotEmoji: "📐",
        funFact: "Albert Einstein studied at ETH Zurich and later returned as a professor of theoretical physics.",
        description: "A premier European university focused on science, technology, mathematics, and engineering, widely regarded as a global leader in research."
    },
    {
        name: "National University of Singapore (NUS)",
        location: "Kent Ridge, Singapore",
        type: "International",
        established: 1905,
        mascot: "LiNUS the Lion",
        mascotEmoji: "🦁",
        funFact: "NUS began as a modest medical school founded by a local Chinese community initiative in 1905.",
        description: "The flagship university of Singapore, consistently ranked as the top university in Asia, renowned for global research and technology entrepreneurship."
    },
    {
        name: "Imperial College London",
        location: "London, England",
        type: "International",
        established: 1907,
        mascot: "Blue Shield",
        mascotEmoji: "🛡️",
        funFact: "Sir Alexander Fleming discovered Penicillin at St Mary's Hospital, which is now part of Imperial College's medical school.",
        description: "A world-leading science, engineering, medicine, and business university situated in London's cultural heart of South Kensington."
    }
];

export function RandomCollegeGeneratorTool() {
    const { toast } = useToast();
    const [selectedType, setSelectedType] = useState<string>("All");
    const [currentCollege, setCurrentCollege] = useState<College | null>(null);
    const [history, setHistory] = useState<College[]>([]);
    const [copied, setCopied] = useState(false);

    const generateCollege = () => {
        const filtered = colleges.filter(c => {
            if (selectedType === "All") return true;
            return c.type === selectedType;
        });

        if (filtered.length === 0) {
            toast({ 
                title: "No colleges found", 
                description: "Try selecting a different category.",
                variant: "destructive"
            });
            return;
        }

        const random = filtered[Math.floor(Math.random() * filtered.length)];
        setCurrentCollege(random);

        // Add to history (max 5)
        setHistory(prev => {
            const filteredPrev = prev.filter(p => p.name !== random.name);
            return [random, ...filteredPrev].slice(0, 5);
        });
    };

    const copyToClipboard = () => {
        if (!currentCollege) return;
        const details = `${currentCollege.name}\nLocation: ${currentCollege.location}\nEstablished: ${currentCollege.established}\nMascot: ${currentCollege.mascot}\nFun Fact: ${currentCollege.funFact}`;
        navigator.clipboard.writeText(details);
        setCopied(true);
        toast({ title: "College details copied to clipboard!" });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="section bg-muted/20 min-h-screen">
            <div className="container-narrow">
                <Link href="/tools" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Tools
                </Link>

                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🎓</div>
                    <h1 className="text-4xl font-extrabold mb-4 text-foreground tracking-tight">Random College Generator</h1>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        Explore random top universities and colleges worldwide. Learn about their location, established dates, mascots, and fun facts.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {/* Left Panel: Settings */}
                    <div className="md:col-span-1 space-y-6">
                        <Card className="border-border/50 shadow-sm">
                            <CardContent className="p-6 space-y-4">
                                <h3 className="font-bold text-lg border-b pb-2 mb-4">Category Filters</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="category-select">Institution Type</Label>
                                    <select
                                        id="category-select"
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    >
                                        <option value="All">All Institutions</option>
                                        <option value="Public">Public State Schools</option>
                                        <option value="Private">Private US Colleges</option>
                                        <option value="Ivy League">Ivy League Elite</option>
                                        <option value="International">International Universities</option>
                                    </select>
                                </div>

                                <Button onClick={generateCollege} className="w-full gap-2 font-bold py-6 mt-2">
                                    <RefreshCw className="h-4 w-4" />
                                    Generate College
                                </Button>
                            </CardContent>
                        </Card>

                        {/* History Panel */}
                        {history.length > 0 && (
                            <Card className="border-border/50 shadow-sm">
                                <CardContent className="p-6">
                                    <h3 className="font-bold text-base border-b pb-2 mb-3">Recently Generated</h3>
                                    <div className="space-y-2">
                                        {history.map((college, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentCollege(college)}
                                                className="w-full text-left p-2 rounded hover:bg-muted text-xs truncate transition-colors font-medium border"
                                            >
                                                {college.name}
                                            </button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Panel: Details Display */}
                    <div className="md:col-span-2">
                        {currentCollege ? (
                            <Card className="border-border/50 shadow-md bg-card overflow-hidden">
                                <div className="bg-primary/5 p-6 border-b border-border/40 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <GraduationCap className="h-8 w-8 text-primary" />
                                        <div>
                                            <span className="text-[10px] uppercase font-bold text-primary px-2.5 py-1 bg-primary/10 rounded-full">
                                                {currentCollege.type}
                                            </span>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={copyToClipboard} className="gap-1.5 text-xs">
                                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                        {copied ? "Copied" : "Copy Details"}
                                    </Button>
                                </div>
                                <CardContent className="p-6 md:p-8 space-y-6">
                                    {/* College Name & Description */}
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3 leading-tight">
                                            {currentCollege.name}
                                        </h2>
                                        <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                                            {currentCollege.description}
                                        </p>
                                    </div>

                                    {/* Grid of details */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b py-5 border-border/50">
                                        <div className="flex items-center gap-3">
                                            <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                            <div>
                                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Location</p>
                                                <p className="text-sm font-semibold">{currentCollege.location}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                            <div>
                                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Established</p>
                                                <p className="text-sm font-semibold">{currentCollege.established}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Compass className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                            <div>
                                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Mascot / Symbol</p>
                                                <p className="text-sm font-semibold flex items-center gap-1.5">
                                                    <span>{currentCollege.mascotEmoji}</span>
                                                    <span>{currentCollege.mascot}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Award className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                            <div>
                                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Academics</p>
                                                <p className="text-sm font-semibold">Tier 1 Research</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Fun Fact Section */}
                                    <div className="bg-muted/50 p-4 rounded-xl border border-border/40">
                                        <h4 className="font-bold text-xs uppercase text-primary tracking-wider mb-1 flex items-center gap-1">
                                            💡 Fun Fact
                                        </h4>
                                        <p className="text-sm leading-relaxed text-muted-foreground font-medium">
                                            {currentCollege.funFact}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-border/50 border-2 border-dashed bg-card/50">
                                <CardContent className="p-16 text-center space-y-4">
                                    <div className="text-6xl">🏫</div>
                                    <h3 className="font-bold text-lg text-foreground">No College Generated Yet</h3>
                                    <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
                                        Select institution settings on the left panel and click the generate button to discover a random top-tier university.
                                    </p>
                                    <Button onClick={generateCollege} className="gap-2">
                                        <RefreshCw className="h-4 w-4" />
                                        Generate College
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Educational SEO content section */}
                <div className="prose-custom mt-16 border-t border-border/50 pt-10 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold mb-4">Why Use a Random College Generator?</h2>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                        Whether you are a student exploring potential options for higher education, a writer designing a 
                        college background for fictional characters, or a trivia enthusiast looking to expand your knowledge of mascot lore, 
                        our university picker provides instant, rich details about world-famous academic institutions.
                    </p>

                    <h3 className="text-xl font-semibold mb-3">Understanding the Categories</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                        Top-tier higher education institutions fall into several distinct organizational categories:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-3 mb-8">
                        <li>
                            <strong>Public Universities:</strong> State-supported research powerhouses (like UC Berkeley and University of Michigan) 
                            offering massive campuses, diverse programs, and large student populations.
                        </li>
                        <li>
                            <strong>Private Colleges:</strong> Independent institutions (like MIT, Stanford, and Caltech) that rely on endowments 
                            and tuition, typically featuring high research concentration and selective admission ratios.
                        </li>
                        <li>
                            <strong>Ivy League:</strong> An elite collegiate athletic conference of 8 historic private universities in the Northeast US 
                            (including Harvard, Princeton, Yale, Columbia, and UPenn), synonymous with academic prestige.
                        </li>
                        <li>
                            <strong>International Institutions:</strong> Leading research universities outside the United States (like Oxford and Cambridge in the UK, 
                            ETH Zurich in Switzerland, and NUS in Singapore) that draw global student cohorts.
                        </li>
                    </ul>

                    <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
                    <div className="space-y-4 text-muted-foreground">
                        <div>
                            <h4 className="font-semibold text-foreground text-base mb-1">What parameters does this generator provide?</h4>
                            <p className="text-sm leading-relaxed">
                                Each generated result lists the college name, regional location, year of foundation, official mascot, athletic conference symbols, academic classification, and a verified fun fact about their history or campus.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground text-base mb-1">Are all of these colleges real institutions?</h4>
                            <p className="text-sm leading-relaxed">
                                Yes. All generated items correspond to real, accredited universities ranked among the top global institutions for research and academic excellence.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
