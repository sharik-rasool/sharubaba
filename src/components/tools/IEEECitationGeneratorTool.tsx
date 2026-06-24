"use client";

import { useState } from "react";
import { Copy, Check, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

type SourceType = "journal" | "conference" | "book" | "website";

interface Author {
    firstName: string;
    lastName: string;
}

export function IEEECitationGeneratorTool() {
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);
    const [sourceType, setSourceType] = useState<SourceType>("journal");
    const [authors, setAuthors] = useState<Author[]>([{ firstName: "", lastName: "" }]);
    const [formData, setFormData] = useState({
        title: "",
        journalName: "",
        volume: "",
        issue: "",
        pages: "",
        year: "",
        doi: "",
        url: "",
        publisher: "",
        city: "",
        accessDate: "",
    });

    const [citation, setCitation] = useState("");

    const addAuthor = () => {
        setAuthors([...authors, { firstName: "", lastName: "" }]);
    };

    const removeAuthor = (index: number) => {
        setAuthors(authors.filter((_, i) => i !== index));
    };

    const updateAuthor = (index: number, field: keyof Author, value: string) => {
        const newAuthors = [...authors];
        newAuthors[index][field] = value;
        setAuthors(newAuthors);
    };

    const formatAuthors = () => {
        return authors
            .filter((a) => a.firstName || a.lastName)
            .map((a) => `${a.firstName.charAt(0)}. ${a.lastName}`)
            .join(", ");
    };

    const generateCitation = () => {
        const authorStr = formatAuthors();
        let cite = "";

        switch (sourceType) {
            case "journal":
                cite = `${authorStr}, "${formData.title}," ${formData.journalName}, vol. ${formData.volume}, no. ${formData.issue}, pp. ${formData.pages}, ${formData.year}.`;
                if (formData.doi) cite += ` doi: ${formData.doi}.`;
                break;
            case "conference":
                cite = `${authorStr}, "${formData.title}," in ${formData.journalName}, ${formData.city}, ${formData.year}, pp. ${formData.pages}.`;
                break;
            case "book":
                cite = `${authorStr}, ${formData.title}. ${formData.city}: ${formData.publisher}, ${formData.year}.`;
                break;
            case "website":
                cite = `${authorStr}, "${formData.title}," ${formData.journalName}. ${formData.url} (accessed ${formData.accessDate}).`;
                break;
        }

        setCitation(cite);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(citation);
        setCopied(true);
        toast({ title: "Citation copied to clipboard!" });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="section">
            <div className="container-narrow">
                <Link href="/tools" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Tools
                </Link>

                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">📚</div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">IEEE Citation Generator</h1>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        Generate properly formatted IEEE citations for your academic papers and research documents.
                    </p>
                </div>

                <Card className="mb-6">
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-2">
                            <Label>Source Type</Label>
                            <Select value={sourceType} onValueChange={(v) => setSourceType(v as SourceType)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="journal">Journal Article</SelectItem>
                                    <SelectItem value="conference">Conference Paper</SelectItem>
                                    <SelectItem value="book">Book</SelectItem>
                                    <SelectItem value="website">Website</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Authors</Label>
                                <Button type="button" variant="outline" size="sm" onClick={addAuthor} className="gap-1">
                                    <Plus className="h-3 w-3" /> Add Author
                                </Button>
                            </div>
                            {authors.map((author, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        placeholder="First name"
                                        value={author.firstName}
                                        onChange={(e) => updateAuthor(index, "firstName", e.target.value)}
                                    />
                                    <Input
                                        placeholder="Last name"
                                        value={author.lastName}
                                        onChange={(e) => updateAuthor(index, "lastName", e.target.value)}
                                    />
                                    {authors.length > 1 && (
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeAuthor(index)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Article or book title"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>{sourceType === "book" ? "Publisher" : sourceType === "website" ? "Website Name" : "Journal/Conference Name"}</Label>
                            <Input
                                value={formData.journalName}
                                onChange={(e) => setFormData({ ...formData, journalName: e.target.value })}
                                placeholder={sourceType === "journal" ? "IEEE Trans. on..." : ""}
                            />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {(sourceType === "journal" || sourceType === "conference") && (
                                <>
                                    <div className="space-y-2">
                                        <Label>Volume</Label>
                                        <Input
                                            value={formData.volume}
                                            onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Issue</Label>
                                        <Input
                                            value={formData.issue}
                                            onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Pages</Label>
                                        <Input
                                            value={formData.pages}
                                            onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                                            placeholder="1-10"
                                        />
                                    </div>
                                </>
                            )}
                            <div className="space-y-2">
                                <Label>Year</Label>
                                <Input
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                    placeholder="2024"
                                />
                            </div>
                        </div>

                        {sourceType === "website" && (
                            <>
                                <div className="space-y-2">
                                    <Label>URL</Label>
                                    <Input
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Access Date</Label>
                                    <Input
                                        value={formData.accessDate}
                                        onChange={(e) => setFormData({ ...formData, accessDate: e.target.value })}
                                        placeholder="Jan. 15, 2024"
                                    />
                                </div>
                            </>
                        )}

                        {(sourceType === "book" || sourceType === "conference") && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>City</Label>
                                    <Input
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    />
                                </div>
                                {sourceType === "book" && (
                                    <div className="space-y-2">
                                        <Label>Publisher</Label>
                                        <Input
                                            value={formData.publisher}
                                            onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {sourceType === "journal" && (
                            <div className="space-y-2">
                                <Label>DOI (optional)</Label>
                                <Input
                                    value={formData.doi}
                                    onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                                    placeholder="10.1109/..."
                                />
                            </div>
                        )}

                        <Button onClick={generateCitation} className="w-full">
                            Generate Citation
                        </Button>
                    </CardContent>
                </Card>

                {citation && (
                    <Card className="mb-6 bg-muted">
                        <CardContent className="p-6">
                            <Label className="mb-2 block">IEEE Citation</Label>
                            <p className="text-base mb-4 font-mono">{citation}</p>
                            <Button variant="outline" onClick={copyToClipboard} className="gap-2">
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                {copied ? "Copied!" : "Copy Citation"}
                            </Button>
                        </CardContent>
                    </Card>
                )}

                <div className="prose-custom mt-12 border-t border-border/50 pt-8 max-w-2xl">
                    <h2 className="text-2xl font-semibold mb-4">How IEEE Citations Work</h2>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                        The IEEE (Institute of Electrical and Electronics Engineers) style is a widely accepted format for 
                        writing and citing research in engineering, computer science, and technology. It uses a numerical 
                        referencing system where sources are cited in-text using bracketed numbers (e.g. <em>[1]</em>, <em>[2]</em>) 
                        that correspond to a numbered reference list at the end of the document.
                    </p>

                    <h3 className="text-xl font-medium mb-3">Core Citation Rules & Formats</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                        Here are standard templates and manual examples of how different sources are formatted in the bibliography:
                    </p>
                    <div className="space-y-4 mb-8 text-sm text-muted-foreground">
                        <div className="p-3 bg-muted rounded-lg">
                            <strong className="text-foreground">Journal Article Format:</strong>
                            <p className="font-mono mt-1 text-xs">J. K. Author, "Name of paper," <em>Journal Title</em>, vol. x, no. x, pp. xxx-xxx, Abbrev. Month, year.</p>
                            <p className="mt-1 italic">Example: A. Patel and B. Smith, "SaaS Database Scalability," <em>IEEE Trans. Cloud Comput.</em>, vol. 8, no. 3, pp. 201-210, Sept. 2023.</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                            <strong className="text-foreground">Book Format:</strong>
                            <p className="font-mono mt-1 text-xs">J. K. Author, <em>Title of Book</em>, xth ed. City of Publisher, Country: Publisher, year.</p>
                            <p className="mt-1 italic">Example: W. G. Anderson, <em>Fundamentals of Software Systems</em>. New York, USA: Academic Press, 2021.</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                            <strong className="text-foreground">Website Format:</strong>
                            <p className="font-mono mt-1 text-xs">J. K. Author, "Title of Webpage," <em>Website Name</em>. URL (accessed Abbrev. Month. Day, Year).</p>
                            <p className="mt-1 italic">Example: S. Rasool, "Understanding SaaS SEO Structure," <em>Sharik Rasool SEO Blog</em>. https://www.sharikrasool.com/blog/saas-seo (accessed Jan. 12, 2024).</p>
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
                    <div className="space-y-4 text-muted-foreground">
                        <div>
                            <h4 className="font-semibold text-foreground text-base mb-1">Should the reference list be alphabetical?</h4>
                            <p className="text-sm leading-relaxed">
                                No. Unlike APA or MLA styles, IEEE references are listed in the order they are first cited in the text, not alphabetically. The first source you mention is numbered [1], the second is [2], and so on.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground text-base mb-1">How do I format multiple authors?</h4>
                            <p className="text-sm leading-relaxed">
                                For up to six authors, list all names separated by commas. If a source has seven or more authors, write only the first author's name followed by a comma and "et al." (e.g. <em>J. Doe, et al.</em>).
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground text-base mb-1">How do in-text citations look?</h4>
                            <p className="text-sm leading-relaxed">
                                Place bracketed numbers directly within the sentence, before any punctuation, with a space before the bracket (e.g. "...as shown in [3]."). You do not need to repeat the author's name or date in the text.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
