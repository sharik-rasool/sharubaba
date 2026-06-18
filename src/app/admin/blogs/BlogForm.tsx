"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, Send, X, Upload, ImageIcon, Plus, Trash2, Search, Link2, ExternalLink, PenSquare, CalendarIcon, Clock, Activity, CheckCircle2, AlertTriangle, XCircle, Sparkles } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { BlogDoc } from "@/lib/blogs";
import type { SummernoteRef } from "./SummernoteEditor";
import { scanContentHealth } from "@/lib/content-audit";

const SummernoteEditor = dynamic(() => import("./SummernoteEditor"), { ssr: false });

interface BlogFormProps {
    initialData?: BlogDoc;
}

function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

function calculateReadingTime(html: string) {
    const text = html.replace(/<[^>]*>?/gm, '');
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
}

export default function BlogForm({ initialData }: BlogFormProps) {
    const router = useRouter();
    const isEditing = !!initialData;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const editorRef = useRef<SummernoteRef>(null);

    const [form, setForm] = useState({
        title: initialData?.title ?? "",
        slug: initialData?.slug ?? "",
        excerpt: initialData?.excerpt ?? "",
        content: initialData?.content ?? "",
        coverImage: initialData?.coverImage ?? "",
        tags: initialData?.tags?.join(", ") ?? "",
        status: initialData?.status ?? "draft",
        seoTitle: initialData?.seoTitle ?? "",
        seoDescription: initialData?.seoDescription ?? "",
        canonicalUrl: initialData?.canonicalUrl ?? "",
        robotsMeta: initialData?.robotsMeta ?? "index, follow",
        ogImage: initialData?.ogImage ?? "",
        scheduledFor: initialData?.scheduledFor ? new Date(initialData.scheduledFor).toISOString() : "",
        faqs: initialData?.faqs ?? [],
        
        // NEW SEO Automation Fields
        aiGenerated: initialData?.aiGenerated ?? false,
        primaryKeyword: initialData?.primaryKeyword ?? "",
        secondaryKeywords: initialData?.secondaryKeywords?.join(", ") ?? "",
        anchors: initialData?.anchors?.join(", ") ?? "",
        contentBrief: initialData?.contentBrief ?? {
            intent: "",
            primaryKeyword: "",
            secondaryKeywords: [],
            competitorHeadings: [],
            paaQuestions: [],
            entities: []
        },
        qaReport: initialData?.qaReport ?? {
            wordCount: 0,
            headingCounts: {},
            internalLinkCount: 0,
            primaryKeywordPresence: false,
            metaTitleLength: 0,
            metaDescriptionLength: 0,
            status: "failed"
        }
    });

    const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEditing);
    const [canonicalManuallyEdited, setCanonicalManuallyEdited] = useState(!!initialData?.canonicalUrl);
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [error, setError] = useState("");
    const [uploading, setUploading] = useState(false);
    
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [existingBlogs, setExistingBlogs] = useState<{title: string, slug: string}[]>([]);
    const [linkSearch, setLinkSearch] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [runningQa, setRunningQa] = useState(false);

    const runOnDemandValidation = async () => {
        setRunningQa(true);
        setError("");
        setSuccessMessage("");
        try {
            const res = await fetch("/api/automation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "validate",
                    content: form.content,
                    seoTitle: form.seoTitle || form.title,
                    seoDescription: form.seoDescription || form.excerpt,
                    primaryKeyword: form.primaryKeyword
                })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setForm(f => ({ ...f, qaReport: data.qaReport }));
                setSuccessMessage("On-demand SEO QA Validation report successfully updated!");
            } else {
                throw new Error(data.error || "Validation failed");
            }
        } catch (err: unknown) {
            setError((err as Error).message || "Failed to validate SEO QA.");
        } finally {
            setRunningQa(false);
        }
    };

    const updateBrief = (key: string, value: unknown) => {
        setHasUnsavedChanges(true);
        setForm(f => ({
            ...f,
            contentBrief: {
                ...f.contentBrief,
                [key]: value
            }
        }));
    };

    async function handleAutoUploadBase64Images(html: string): Promise<{ success: boolean; updatedHtml: string; count: number; error?: string }> {
        const regex = /data:image\/([^;]+);base64,([A-Za-z0-9+/=\s\r\n]+)/gi;
        const matches: { full: string; ext: string; mimeType: string; base64: string }[] = [];
        let match;
        while ((match = regex.exec(html)) !== null) {
            matches.push({
                full: match[0],
                ext: match[1] === 'svg+xml' ? 'svg' : (match[1] === 'jpeg' ? 'jpg' : match[1]),
                mimeType: match[1] === 'svg+xml' ? 'image/svg+xml' : `image/${match[1]}`,
                base64: match[2].replace(/\s/g, ''),
            });
        }

        if (matches.length === 0) {
            return { success: true, updatedHtml: html, count: 0 };
        }

        let updatedHtml = html;
        let convertedCount = 0;

        for (let i = 0; i < matches.length; i++) {
            const item = matches[i];
            try {
                const byteCharacters = atob(item.base64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let j = 0; j < byteCharacters.length; j++) {
                    byteNumbers[j] = byteCharacters.charCodeAt(j);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: item.mimeType });
                const file = new File([blob], `migrated-paste-${Date.now()}-${i}.${item.ext}`, { type: item.mimeType });

                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch("/api/upload", { method: "POST", body: formData });
                if (!res.ok) {
                    throw new Error("Upload request failed");
                }
                const data = await res.json();
                if (data && data.url) {
                    updatedHtml = updatedHtml.replace(item.full, data.url);
                    convertedCount++;
                } else {
                    throw new Error(data?.error || "Invalid response from upload API");
                }
            } catch (e: unknown) {
                console.error("Error auto-uploading base64 image:", e);
                return {
                    success: false,
                    updatedHtml: html,
                    count: convertedCount,
                    error: `Failed to upload image ${i + 1}: ${(e as Error).message || "Unknown error"}`
                };
            }
        }

        return { success: true, updatedHtml, count: convertedCount };
    }

    // Fetch blogs for Link Suggestions
    useEffect(() => {
        fetch("/api/blogs")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setExistingBlogs(data);
                }
            })
            .catch(() => {});
    }, []);

    // Auto-generate slug
    useEffect(() => {
        if (!slugManuallyEdited) {
            setForm((f) => ({ ...f, slug: slugify(f.title) }));
        }
    }, [form.title, slugManuallyEdited]);

    // Auto-generate canonicalUrl
    useEffect(() => {
        if (!canonicalManuallyEdited && form.slug) {
            setForm((f) => ({ ...f, canonicalUrl: `https://www.sharikrasool.com/blog/${f.slug}` }));
        }
    }, [form.slug, canonicalManuallyEdited]);

    // Unsaved changes warning
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [hasUnsavedChanges]);

    // Auto-save logic (Debounced)
    useEffect(() => {
        if (!hasUnsavedChanges || !isEditing) return;
        const timer = setTimeout(() => {
            submit("draft", true);
        }, 45000);
        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form, hasUnsavedChanges, isEditing]);

    const set = (key: keyof typeof form) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setHasUnsavedChanges(true);
        setForm((f) => ({ ...f, [key]: e.target.value }));
    };

    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        setUploading(false);
        if (data.url) {
            setHasUnsavedChanges(true);
            setForm((f) => ({ ...f, coverImage: data.url }));
        } else {
            setError(data.error ?? "Upload failed");
        }
        e.target.value = "";
    };

    const addFaq = () => {
        setHasUnsavedChanges(true);
        setForm((f) => ({ ...f, faqs: [...f.faqs, { question: "", answer: "" }] }));
    };

    const removeFaq = (index: number) => {
        setHasUnsavedChanges(true);
        setForm((f) => ({ ...f, faqs: f.faqs.filter((_, i) => i !== index) }));
    };

    const updateFaq = (index: number, field: "question" | "answer", value: string) => {
        setHasUnsavedChanges(true);
        setForm((f) => {
            const newFaqs = [...f.faqs];
            newFaqs[index] = { ...newFaqs[index], [field]: value };
            return { ...f, faqs: newFaqs };
        });
    };

    const insertLink = (title: string, url: string) => {
        if (editorRef.current) {
            editorRef.current.insertLink(title, url);
        }
    };

    async function submit(status: "draft" | "published", isAutoSave = false) {
        if (!isAutoSave) {
            setError("");
            setSuccessMessage("");
        }
        if (!form.title.trim()) { if (!isAutoSave) setError("Title is required."); return; }
        if (!form.slug.trim()) { if (!isAutoSave) setError("Slug is required."); return; }
        if (!form.content.trim()) { if (!isAutoSave) setError("Content is required."); return; }

        let contentToSave = form.content;

        if (form.content.includes("data:image/")) {
            if (isAutoSave) return;

            if (status === "published") setPublishing(true);
            else setSaving(true);

            setError("Embedded base64 images detected. Automatically converting to upload URLs...");
            const uploadRes = await handleAutoUploadBase64Images(form.content);
            
            if (!uploadRes.success) {
                setSaving(false);
                setPublishing(false);
                setError(`Embedded Base64 images are not allowed. Auto-conversion failed: ${uploadRes.error}`);
                return;
            }

            contentToSave = uploadRes.updatedHtml;
            setForm((f) => ({ ...f, content: uploadRes.updatedHtml }));
            setSuccessMessage(`Successfully converted ${uploadRes.count} embedded Base64 image(s) to uploaded storage URLs.`);
            setError("");
        }

        // Sanitize and generate unique heading IDs before final verification and saving
        const { sanitizeContent, generateHeadingIds, repairMalformedHeadings } = await import("@/lib/blog-cleaner");
        let processedContent = sanitizeContent(contentToSave);
        processedContent = repairMalformedHeadings(processedContent);
        processedContent = generateHeadingIds(processedContent);
        contentToSave = processedContent;
        setForm((f) => ({ ...f, content: contentToSave }));

        // Final client-side content health verification
        const audit = scanContentHealth(contentToSave);
        if (audit.status === "critical") {
            setSaving(false);
            setPublishing(false);
            setError(audit.messages.join(" "));
            return;
        }

        if (!isAutoSave) {
            if (status === "published") setPublishing(true);
            else setSaving(true);
        }

        const payload = {
            ...form,
            content: contentToSave,
            faqs: form.faqs.filter((f) => f.question.trim() && f.answer.trim()),
            tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
            secondaryKeywords: typeof form.secondaryKeywords === "string"
                ? form.secondaryKeywords.split(",").map((t) => t.trim()).filter(Boolean)
                : form.secondaryKeywords,
            anchors: typeof form.anchors === "string"
                ? form.anchors.split(",").map((t) => t.trim()).filter(Boolean)
                : form.anchors,
            status: (status === "published" && form.scheduledFor && new Date(form.scheduledFor) > new Date()) ? "draft" : status,
            seoTitle: form.seoTitle || form.title,
            seoDescription: form.seoDescription || form.excerpt,
            canonicalUrl: form.canonicalUrl || `https://www.sharikrasool.com/blog/${form.slug}`,
            scheduledFor: form.scheduledFor ? new Date(form.scheduledFor).toISOString() : null,
            readingTime: calculateReadingTime(contentToSave),
        };

        const url = isEditing ? `/api/blogs/${initialData!._id}` : "/api/blogs";
        const method = isEditing ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (!isAutoSave) {
                setSaving(false);
                setPublishing(false);
            }

            if (!res.ok) {
                if (!isAutoSave) setError(data.error ?? "Something went wrong.");
                return;
            }

            setHasUnsavedChanges(false);
            
            if (!isAutoSave) {
                router.push("/admin/blogs");
                router.refresh();
            }
        } catch (error: unknown) {
            console.error("CLONE ERROR:", error);
            if (!isAutoSave) {
                setSaving(false);
                setPublishing(false);
                setError("Network error. Could not save.");
            }
        }
    }

    const images = useMemo(() => {
        if (typeof window === "undefined" || !form.content) return [];
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(form.content, "text/html");
            const imgElements = doc.querySelectorAll("img");
            return Array.from(imgElements).map((img, index) => ({
                index,
                src: img.getAttribute("src") || "",
                alt: img.getAttribute("alt") || "",
                outerHTML: img.outerHTML
            }));
        } catch (err) {
            console.error("Failed to parse images from content", err);
            return [];
        }
    }, [form.content]);

    const handleUpdateImageAlt = (imgIndex: number, newAlt: string) => {
        if (typeof window === "undefined") return;
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(form.content, "text/html");
            const imgElements = doc.querySelectorAll("img");
            if (imgElements[imgIndex]) {
                imgElements[imgIndex].setAttribute("alt", newAlt);
                setForm(f => ({ ...f, content: doc.body.innerHTML }));
                setHasUnsavedChanges(true);
            }
        } catch (err) {
            console.error("Failed to update image alt text", err);
        }
    };

    const tagList = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const filteredBlogs = existingBlogs.filter(b => b.title.toLowerCase().includes(linkSearch.toLowerCase()) && b.slug !== form.slug);
    
    // SEO Snippet Preview logic
    const previewTitle = form.seoTitle || form.title || "Your Blog Post Title";
    const previewDesc = form.seoDescription || form.excerpt || "Your compelling meta description will appear here in Google search results.";

    return (
        <div className="space-y-6">
            {error && (
                <div className="flex items-center gap-2 bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg">
                    <X className="h-4 w-4 shrink-0" />
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm px-4 py-3 rounded-lg">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    {successMessage}
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">{isEditing ? "Edit Post" : "New Post"}</h1>
                    {hasUnsavedChanges && <Badge variant="secondary" className="text-xs">Unsaved changes</Badge>}
                </div>
                <div className="flex items-center gap-3 self-start md:self-auto">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={saving || publishing}
                        onClick={() => submit("draft")}
                        className="gap-1"
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Draft
                    </Button>
                    <Button
                        size="sm"
                        disabled={saving || publishing}
                        onClick={() => submit("published")}
                        className="gap-1"
                    >
                        {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        {form.scheduledFor ? "Schedule" : "Publish"}
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="content" className="w-full">
                <TabsList className="flex w-full justify-start overflow-x-auto sm:grid sm:grid-cols-4 max-w-full sm:max-w-[500px] h-auto p-1 hide-scrollbar">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    <TabsTrigger value="ai-qa">AI & QA</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="mt-6">
                    <div className="grid gap-6 lg:grid-cols-4">
                        <div className="lg:col-span-3 space-y-6">
                            {/* Title */}
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={form.title}
                                    onChange={set("title")}
                                    placeholder="Your blog post title"
                                    className="text-lg font-medium"
                                />
                            </div>

                            {/* Summernote Content Editor */}
                            <div className="space-y-2">
                                <Label>Content (HTML) *</Label>
                                <div className="rounded-md overflow-hidden border border-input bg-card relative">
                                    <SummernoteEditor
                                        ref={editorRef}
                                        initialValue={form.content}
                                        onChange={(html) => {
                                            setHasUnsavedChanges(true);
                                            setForm((f) => ({ ...f, content: html }));
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Pre-publish SEO Health Panel */}
                            <Card>
                                <CardHeader className="pb-3 px-4">
                                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-primary" />
                                        Pre-Publish SEO Audit
                                    </CardTitle>
                                    <CardDescription className="text-xs">Real-time SEO health score and compliance checks</CardDescription>
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                    {(() => {
                                        const audit = scanContentHealth(form.content, {
                                            title: form.title,
                                            slug: form.slug,
                                            seoDescription: form.seoDescription,
                                            canonicalUrl: form.canonicalUrl,
                                            coverImage: form.coverImage,
                                            ogImage: form.ogImage,
                                            createdAt: initialData?.createdAt,
                                            updatedAt: new Date().toISOString(),
                                            tags: form.tags.split(",").map(t => t.trim()).filter(Boolean)
                                        });
                                        const isSafe = audit.status === "safe";
                                        const isWarning = audit.status === "warning";
                                        const isCritical = audit.status === "critical";
                                        const score = audit.seoHealthScore ?? 100;

                                        return (
                                            <div className="space-y-4">
                                                {/* Score Circular/Indicator style */}
                                                <div className="flex flex-col items-center justify-center p-3 rounded-lg border border-border bg-muted/30">
                                                    <span className="text-xs text-muted-foreground font-medium mb-1">SEO Health Score</span>
                                                    <div className={cn(
                                                        "text-3xl font-extrabold tracking-tight",
                                                        score >= 90 ? "text-green-600 dark:text-green-400" :
                                                        score >= 70 ? "text-yellow-600 dark:text-yellow-400" :
                                                        "text-destructive"
                                                    )}>
                                                        {score}/100
                                                    </div>
                                                    <Badge
                                                        className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 mt-2"
                                                        variant={isSafe ? "default" : (isWarning ? "secondary" : "destructive")}
                                                    >
                                                        {audit.status === "safe" ? "SEO Compliant" : `${audit.status} issues`}
                                                    </Badge>
                                                </div>

                                                {/* Metric Details Grid */}
                                                <div className="space-y-2 text-xs">
                                                    <div className="flex justify-between border-b border-border/40 pb-1.5">
                                                        <span className="text-muted-foreground">HTML Size:</span>
                                                        <span className={cn(
                                                            "font-medium",
                                                            audit.contentSize > 1.5 * 1024 * 1024 ? "text-destructive font-bold" : 
                                                            audit.contentSize > 500 * 1024 ? "text-yellow-600 dark:text-yellow-400 font-semibold" : "text-green-600 dark:text-green-400"
                                                        )}>
                                                            {(audit.contentSize / 1024).toFixed(1)} KB
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between border-b border-border/40 pb-1.5">
                                                        <span className="text-muted-foreground">Est. Render Size:</span>
                                                        <span className="font-medium">{(audit.renderedContentSize / 1024).toFixed(1)} KB</span>
                                                    </div>

                                                    <div className="flex flex-col border-b border-border/40 pb-1.5">
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Metadata Verification:</span>
                                                            <span className="font-medium">
                                                                {audit.missingCanonical || audit.missingMetaDesc ? "⚠️ Warning" : "✅ Valid"}
                                                            </span>
                                                        </div>
                                                        <div className="text-[10px] text-muted-foreground mt-1 pl-2 border-l border-border space-y-0.5">
                                                            {audit.missingCanonical ? (
                                                                <div className="text-destructive font-medium">• Canonical mismatch / missing</div>
                                                            ) : (
                                                                <div className="text-green-600 dark:text-green-400">• Rendered Canonical Valid</div>
                                                            )}
                                                            {audit.missingMetaDesc ? (
                                                                <div className="text-destructive font-medium">• Meta Description missing</div>
                                                            ) : (
                                                                <div className="text-green-600 dark:text-green-400">• Meta Description Valid</div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col border-b border-border/40 pb-1.5">
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Rendered Schema check:</span>
                                                            <span className="font-medium">
                                                                {audit.missingSchemaProps.length > 0 ? "⚠️ Missing properties" : "✅ Valid"}
                                                            </span>
                                                        </div>
                                                        {audit.missingSchemaProps.length > 0 && (
                                                            <div className="text-[10px] text-destructive font-medium mt-1 pl-2 border-l border-border space-y-0.5">
                                                                • Missing: {audit.missingSchemaProps.join(", ")}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col border-b border-border/40 pb-1.5">
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Headings Integrity:</span>
                                                            <span className="font-medium">{audit.headingsCount} total</span>
                                                        </div>
                                                        {(audit.emptyHeadingsCount > 0 || audit.imageHeadingsCount > 0 || audit.missingIdsCount > 0 || audit.malformedHeadingsCount > 0) && (
                                                            <div className="text-[10px] text-muted-foreground mt-1 pl-2 border-l border-border space-y-0.5">
                                                                {audit.malformedHeadingsCount > 0 && (
                                                                    <div className="text-destructive font-medium">• {audit.malformedHeadingsCount} malformed headings (auto-repaired on save)</div>
                                                                )}
                                                                {audit.emptyHeadingsCount > 0 && (
                                                                    <div className="text-destructive font-medium">• {audit.emptyHeadingsCount} empty headings</div>
                                                                )}
                                                                {audit.imageHeadingsCount > 0 && (
                                                                    <div className="text-destructive font-medium">• {audit.imageHeadingsCount} image-only headings</div>
                                                                )}
                                                                {audit.missingIdsCount > 0 && (
                                                                    <div className="text-yellow-600 dark:text-yellow-400">• {audit.missingIdsCount} missing IDs</div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col border-b border-border/40 pb-1.5">
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Image Alts & Embeds:</span>
                                                            <span className="font-medium">{audit.imageCount} images</span>
                                                        </div>
                                                        <div className="text-[10px] text-muted-foreground mt-1 pl-2 border-l border-border space-y-0.5">
                                                            {audit.base64Count > 0 && (
                                                                <div className="text-destructive font-bold">• {audit.base64Count} Base64 (Blocked)</div>
                                                            )}
                                                            {audit.missingAltCount > 0 && (
                                                                <div className="text-destructive font-medium">• {audit.missingAltCount} missing alt tags</div>
                                                            )}
                                                            {audit.shortAltsCount > 0 && (
                                                                <div className="text-yellow-600 dark:text-yellow-400">• {audit.shortAltsCount} short alt tags</div>
                                                            )}
                                                            {audit.genericAltsCount > 0 && (
                                                                <div className="text-yellow-600 dark:text-yellow-400">• {audit.genericAltsCount} generic alt tags</div>
                                                            )}
                                                            {audit.duplicateAlts.length > 0 && (
                                                                <div className="text-yellow-600 dark:text-yellow-400">• {audit.duplicateAlts.length} duplicate alt texts</div>
                                                            )}
                                                            {audit.heavyEmbedsCount > 0 && (
                                                                <div className="text-indigo-600 dark:text-indigo-400">• {audit.heavyEmbedsCount} heavy embeds / iframes</div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col">
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Links & Age Audit:</span>
                                                            <span className="font-medium">{audit.internalLinksCount} internal</span>
                                                        </div>
                                                        <div className="text-[10px] text-muted-foreground mt-1 pl-2 border-l border-border space-y-0.5">
                                                            {audit.brokenLinksCount > 0 && (
                                                                <div className="text-destructive font-medium">• {audit.brokenLinksCount} broken or placeholder link(s)</div>
                                                            )}
                                                            {audit.ageInDays > 0 && (
                                                                <div className={cn(
                                                                    "font-medium",
                                                                    audit.ageInDays > 180 ? "text-yellow-600 dark:text-yellow-400" : "text-green-600 dark:text-green-400"
                                                                )}>
                                                                    • Page updated {audit.ageInDays} days ago {audit.ageInDays > 180 && "(exceeds 6 months)"}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                {audit.messages.length > 0 && (
                                                    <div className="mt-3 pt-3 border-t border-border space-y-2">
                                                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">SEO Recommendations</span>
                                                        <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
                                                            {audit.messages.map((msg, i) => (
                                                                <div key={i} className="flex gap-1.5 items-start text-[11px] leading-tight">
                                                                    {msg.toLowerCase().includes("blocked") || msg.toLowerCase().includes("extremely large") || msg.toLowerCase().includes("base64") ? (
                                                                        <XCircle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
                                                                    ) : (
                                                                        <AlertTriangle className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                                                                    )}
                                                                    <span className={msg.toLowerCase().includes("blocked") || msg.toLowerCase().includes("base64") ? "text-destructive font-medium" : "text-muted-foreground"}>
                                                                        {msg}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </CardContent>
                            </Card>

                            {/* Link Suggestions */}
                            <Card className="sticky top-20">
                                <CardHeader className="pb-3 px-4">
                                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                        <Link2 className="h-4 w-4" />
                                        Internal Links
                                    </CardTitle>
                                    <CardDescription className="text-xs">Insert links into the editor</CardDescription>
                                </CardHeader>
                                <CardContent className="px-4 pb-4 space-y-3">
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                                        <Input 
                                            placeholder="Search posts..." 
                                            className="pl-8 text-sm h-9"
                                            value={linkSearch}
                                            onChange={(e) => setLinkSearch(e.target.value)}
                                        />
                                    </div>
                                    <div className="h-[400px] overflow-y-auto space-y-1.5 pr-2 custom-scrollbar">
                                        {filteredBlogs.length === 0 ? (
                                            <p className="text-xs text-muted-foreground text-center py-4">No posts found.</p>
                                        ) : (
                                            filteredBlogs.map(b => (
                                                <div 
                                                    key={b.slug} 
                                                    className="p-2 border rounded-md text-sm cursor-pointer hover:bg-muted transition-colors group"
                                                    onClick={() => insertLink(b.title, `https://www.sharikrasool.com/blog/${b.slug}`)}
                                                >
                                                    <p className="font-medium text-xs leading-tight line-clamp-2 group-hover:text-primary">{b.title}</p>
                                                    <p className="text-[10px] text-muted-foreground truncate mt-1">/blog/{b.slug}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="seo" className="mt-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-semibold">Search Engine Optimization</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Slug */}
                                    <div className="space-y-2">
                                        <Label htmlFor="slug" className="text-xs font-semibold">URL Slug *</Label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground hidden sm:inline">/blog/</span>
                                            <Input
                                                id="slug"
                                                value={form.slug}
                                                onChange={(e) => {
                                                    setSlugManuallyEdited(true);
                                                    setHasUnsavedChanges(true);
                                                    setForm((f) => ({ ...f, slug: slugify(e.target.value) }));
                                                }}
                                                placeholder="url-friendly-slug"
                                                className="font-mono text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* SEO Title */}
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-end">
                                            <Label className="text-xs font-semibold">SEO Title</Label>
                                            <span className={`text-xs ${form.seoTitle.length > 60 ? 'text-destructive' : 'text-muted-foreground'}`}>
                                                {form.seoTitle.length}/60
                                            </span>
                                        </div>
                                        <Input
                                            value={form.seoTitle}
                                            onChange={set("seoTitle")}
                                            placeholder="Defaults to post title"
                                            className="text-sm"
                                        />
                                    </div>

                                    {/* Meta Description */}
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-end">
                                            <Label className="text-xs font-semibold">Meta Description</Label>
                                            <span className={`text-xs ${form.seoDescription.length > 160 ? 'text-destructive' : 'text-muted-foreground'}`}>
                                                {form.seoDescription.length}/160
                                            </span>
                                        </div>
                                        <Textarea
                                            value={form.seoDescription}
                                            onChange={set("seoDescription")}
                                            placeholder="Defaults to excerpt"
                                            rows={3}
                                            className="text-sm resize-none"
                                        />
                                    </div>
                                    
                                    {/* Excerpt */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="excerpt" className="text-xs font-semibold">Excerpt</Label>
                                        <Textarea
                                            id="excerpt"
                                            value={form.excerpt}
                                            onChange={set("excerpt")}
                                            placeholder="Short summary shown in the blog listing cards"
                                            rows={2}
                                            className="text-sm resize-none"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* FAQ Builder */}
                            <Card>
                                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-sm font-semibold">FAQ Schema Builder</CardTitle>
                                        <CardDescription className="text-xs">Add schema-marked FAQs.</CardDescription>
                                    </div>
                                    <Button type="button" variant="outline" size="sm" onClick={addFaq} className="h-8 gap-1">
                                        <Plus className="h-3 w-3" /> Add FAQ
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {form.faqs.map((faq, index) => (
                                        <div key={index} className="relative p-4 border rounded-md bg-muted/30">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                                                onClick={() => removeFaq(index)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                            <div className="space-y-3 pt-1">
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs">Question</Label>
                                                    <Input
                                                        value={faq.question}
                                                        onChange={(e) => updateFaq(index, "question", e.target.value)}
                                                        className="h-8 text-sm"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs">Answer</Label>
                                                    <Textarea
                                                        value={faq.answer}
                                                        onChange={(e) => updateFaq(index, "answer", e.target.value)}
                                                        rows={2}
                                                        className="text-sm resize-none min-h-[60px]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {form.faqs.length === 0 && (
                                        <div className="text-center py-6 border border-dashed rounded-md text-muted-foreground text-xs">
                                            No FAQs added yet.
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Image Alt Texts Manager */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-2">
                                        <ImageIcon className="h-4 w-4 text-primary" />
                                        <CardTitle className="text-sm font-semibold">Image Alt Texts Manager</CardTitle>
                                    </div>
                                    <CardDescription className="text-xs">
                                        Edit the alternate description (alt text) for images embedded in your content to boost SEO health and accessibility.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {images.length === 0 ? (
                                        <div className="text-center py-8 border border-dashed rounded-md text-muted-foreground text-xs flex flex-col items-center justify-center gap-2">
                                            <ImageIcon className="h-8 w-8 opacity-30" />
                                            <span>No images found in your blog content. Add images via the editor above.</span>
                                        </div>
                                    ) : (
                                        <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
                                            {images.map((img) => (
                                                <ImageAltInput
                                                    key={img.index}
                                                    initialAlt={img.alt}
                                                    index={img.index}
                                                    src={img.src}
                                                    onSave={handleUpdateImageAlt}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            {/* Live Preview */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-semibold">Live Search Preview</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="p-4 bg-white border border-[#dfe1e5] rounded-lg shadow-[0_1px_6px_rgba(32,33,36,.28)] max-w-[600px] font-sans">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-7 h-7 bg-muted rounded-full overflow-hidden flex items-center justify-center">
                                                <span className="text-[10px] font-bold">SR</span>
                                            </div>
                                            <div>
                                                <div className="text-sm text-[#202124] leading-tight">Sharik Rasool</div>
                                                <div className="text-xs text-[#4d5156] leading-tight">https://www.sharikrasool.com › blog › {form.slug}</div>
                                            </div>
                                        </div>
                                        <h3 className="text-xl text-[#1a0dab] mb-1 leading-snug cursor-pointer hover:underline truncate">
                                            {previewTitle}
                                        </h3>
                                        <p className="text-sm text-[#4d5156] leading-snug line-clamp-2">
                                            {previewDesc}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Advanced SEO Fields */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-semibold">Advanced SEO</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold">Canonical URL</Label>
                                        <Input
                                            value={form.canonicalUrl}
                                            onChange={(e) => {
                                                setHasUnsavedChanges(true);
                                                setForm((f) => ({ ...f, canonicalUrl: e.target.value }));
                                                setCanonicalManuallyEdited(true);
                                            }}
                                            placeholder="Leave blank to self-reference"
                                            className="text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold">Robots Meta</Label>
                                        <Input
                                            value={form.robotsMeta}
                                            onChange={set("robotsMeta")}
                                            placeholder="index, follow"
                                            className="text-sm"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="advanced" className="mt-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Status & Schedule */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold">Publishing</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold">Status</Label>
                                    <div className="flex gap-2">
                                        {(() => {
                                            const isScheduled = form.scheduledFor && new Date(form.scheduledFor) > new Date();
                                            return (
                                                <Badge
                                                    variant={isScheduled ? "outline" : form.status === "published" ? "default" : "secondary"}
                                                    className={isScheduled ? "text-purple-600 border-purple-600 bg-purple-50 dark:text-purple-400 dark:border-purple-400 dark:bg-purple-950/20 uppercase" : ""}
                                                >
                                                    {isScheduled ? "SCHEDULED" : form.status.toUpperCase()}
                                                </Badge>
                                            );
                                        })()}
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold">Schedule Date & Time</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal h-9 px-3",
                                                    !form.scheduledFor && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {form.scheduledFor ? format(new Date(form.scheduledFor), "PPP p") : <span>Pick a date and time</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <CalendarComponent
                                                mode="single"
                                                selected={form.scheduledFor ? new Date(form.scheduledFor) : undefined}
                                                onSelect={(date) => {
                                                    if (date) {
                                                        const current = form.scheduledFor ? new Date(form.scheduledFor) : new Date();
                                                        date.setHours(current.getHours());
                                                        date.setMinutes(current.getMinutes());
                                                        setHasUnsavedChanges(true);
                                                        setForm(f => ({...f, scheduledFor: date.toISOString()}));
                                                    }
                                                }}
                                                initialFocus
                                            />
                                            <div className="p-3 border-t border-border flex items-center gap-2 bg-muted/20">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <Input 
                                                    type="time" 
                                                    className="h-8 text-sm flex-1"
                                                    value={form.scheduledFor ? format(new Date(form.scheduledFor), "HH:mm") : ""}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (!val) return;
                                                        const [hours, minutes] = val.split(':');
                                                        if (hours && minutes) {
                                                            const date = form.scheduledFor ? new Date(form.scheduledFor) : new Date();
                                                            date.setHours(parseInt(hours));
                                                            date.setMinutes(parseInt(minutes));
                                                            setHasUnsavedChanges(true);
                                                            setForm(f => ({...f, scheduledFor: date.toISOString()}));
                                                        }
                                                    }}
                                                />
                                            </div>
                                            {form.scheduledFor && (
                                                <div className="p-2 border-t border-border bg-muted/10">
                                                    <Button variant="ghost" size="sm" className="w-full text-xs text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => {
                                                        setHasUnsavedChanges(true);
                                                        setForm(f => ({...f, scheduledFor: ""}));
                                                    }}>
                                                        Clear Schedule
                                                    </Button>
                                                </div>
                                            )}
                                        </PopoverContent>
                                    </Popover>
                                    <p className="text-xs text-muted-foreground mt-1">Post will be hidden until this date. Keep draft status if you don't want it published automatically.</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Images & Tags */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-semibold">Cover Image</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                                    <Button type="button" variant="outline" size="sm" className="w-full gap-2" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
                                        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                        {uploading ? "Uploading..." : "Upload Image"}
                                    </Button>
                                    
                                    <Input value={form.coverImage} onChange={set("coverImage")} placeholder="Image URL..." className="text-sm" />

                                    {form.coverImage ? (
                                        <div className="relative group mt-2">
                                            <img src={form.coverImage} alt="Cover preview" className="w-full h-36 object-cover rounded-md border" />
                                            <button type="button" onClick={() => { setHasUnsavedChanges(true); setForm(f => ({...f, coverImage: ""})); }} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-full h-36 rounded-md border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground mt-2">
                                            <ImageIcon className="h-6 w-6 opacity-40 mb-1" />
                                            <span className="text-xs">No cover image</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-semibold">Tags</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Input value={form.tags} onChange={set("tags")} placeholder="Comma-separated..." className="text-sm" />
                                    {tagList.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {tagList.map((tag) => (
                                                <Badge key={tag} variant="secondary" className="text-[10px] uppercase">#{tag}</Badge>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="ai-qa" className="mt-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Left Column: Automation & Content Brief */}
                        <div className="space-y-6">
                            {/* AI Configuration settings */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-semibold">AI Generation Configuration</CardTitle>
                                    <CardDescription className="text-xs">Identify if this article was auto-generated and manage target search terms.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3 bg-muted/40 p-3 rounded-md border">
                                        <input
                                            type="checkbox"
                                            id="aiGenerated"
                                            checked={form.aiGenerated}
                                            onChange={(e) => {
                                                setHasUnsavedChanges(true);
                                                setForm(f => ({ ...f, aiGenerated: e.target.checked }));
                                            }}
                                            className="rounded border-input text-violet-600 focus:ring-violet-500 h-4 w-4 cursor-pointer"
                                        />
                                        <Label htmlFor="aiGenerated" className="text-xs font-semibold cursor-pointer">Mark this post as AI-Generated</Label>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold">Primary Focus Keyword</Label>
                                        <Input
                                            value={form.primaryKeyword}
                                            onChange={(e) => {
                                                setHasUnsavedChanges(true);
                                                setForm(f => ({ ...f, primaryKeyword: e.target.value }));
                                            }}
                                            placeholder="e.g. freelance developer tips"
                                            className="text-sm"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold">Secondary Keywords (comma-separated)</Label>
                                        <Input
                                            value={form.secondaryKeywords}
                                            onChange={(e) => {
                                                setHasUnsavedChanges(true);
                                                setForm(f => ({ ...f, secondaryKeywords: e.target.value }));
                                            }}
                                            placeholder="e.g. start freelancing, software engineer gig, remote coding"
                                            className="text-sm"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold">Keyword Anchors (comma-separated, used for linking to this post)</Label>
                                        <Input
                                            value={form.anchors}
                                            onChange={(e) => {
                                                setHasUnsavedChanges(true);
                                                setForm(f => ({ ...f, anchors: e.target.value }));
                                            }}
                                            placeholder="e.g. freelancing guide, code remotely, developer career"
                                            className="text-sm"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Content Brief */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-semibold">AI Content Brief Details</CardTitle>
                                    <CardDescription className="text-xs">Edit search intent, entities, and competitive headings mappings.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold">Search Intent Type</Label>
                                        <select
                                            value={form.contentBrief?.intent || ""}
                                            onChange={(e) => updateBrief("intent", e.target.value)}
                                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                        >
                                            <option value="">Select Intent...</option>
                                            <option value="informational">Informational (How-to, Guides)</option>
                                            <option value="commercial">Commercial (Reviews, Comparisons)</option>
                                            <option value="transactional">Transactional (Buying, Hiring)</option>
                                            <option value="navigational">Navigational (Logins, Brands)</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold">Competitor Headings Mapping (one per line)</Label>
                                        <Textarea
                                            value={Array.isArray(form.contentBrief?.competitorHeadings) ? form.contentBrief.competitorHeadings.join("\n") : ""}
                                            onChange={(e) => updateBrief("competitorHeadings", e.target.value.split("\n").map(h => h.trim()).filter(Boolean))}
                                            placeholder="Paste headings observed in competitor articles..."
                                            rows={4}
                                            className="text-sm resize-none"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold">People Also Ask (PAA) Questions (one per line)</Label>
                                        <Textarea
                                            value={Array.isArray(form.contentBrief?.paaQuestions) ? form.contentBrief.paaQuestions.join("\n") : ""}
                                            onChange={(e) => updateBrief("paaQuestions", e.target.value.split("\n").map(q => q.trim()).filter(Boolean))}
                                            placeholder="Paste PAA questions found on Google..."
                                            rows={3}
                                            className="text-sm resize-none"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold">Semantic Entities & Topics (comma-separated)</Label>
                                        <Textarea
                                            value={Array.isArray(form.contentBrief?.entities) ? form.contentBrief.entities.join(", ") : ""}
                                            onChange={(e) => updateBrief("entities", e.target.value.split(",").map(ent => ent.trim()).filter(Boolean))}
                                            placeholder="e.g. Upwork, GitHub portfolio, client contracts, invoices"
                                            rows={3}
                                            className="text-sm resize-none"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column: SEO QA Validation Report */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-sm font-semibold">SEO QA Validation Status</CardTitle>
                                        <Badge className={cn(
                                            "text-[10px] font-bold uppercase px-2 py-0.5 border-0",
                                            form.qaReport?.status === "passed" ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400" :
                                            form.qaReport?.status === "warned" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400" :
                                            "bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                                        )}>
                                            {form.qaReport?.status || "failed"}
                                        </Badge>
                                    </div>
                                    <CardDescription className="text-xs">Checker checklist for structural and content compliance.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2 text-xs divide-y">
                                        <div className="flex justify-between py-2 items-center">
                                            <span className="text-muted-foreground">Word Count:</span>
                                            <span className={cn(
                                                "font-semibold",
                                                form.qaReport?.wordCount >= 3000 ? "text-green-600 dark:text-green-400" : "text-destructive"
                                            )}>
                                                {form.qaReport?.wordCount || 0} words (Target &ge;3000)
                                            </span>
                                        </div>

                                        <div className="flex justify-between py-2 items-center">
                                            <span className="text-muted-foreground">Internal Link Count:</span>
                                            <span className="font-semibold text-foreground">
                                                {form.qaReport?.internalLinkCount || 0} links (Max 8)
                                            </span>
                                        </div>

                                        <div className="flex justify-between py-2 items-center">
                                            <span className="text-muted-foreground">Primary Keyword Presence:</span>
                                            <span className={cn(
                                                "font-semibold",
                                                form.qaReport?.primaryKeywordPresence ? "text-green-600 dark:text-green-400" : "text-amber-500"
                                            )}>
                                                {form.qaReport?.primaryKeywordPresence ? "Found in Body" : "Not Found"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between py-2 items-center">
                                            <span className="text-muted-foreground">Meta Title Character Length:</span>
                                            <span className={cn(
                                                "font-semibold",
                                                (form.qaReport?.metaTitleLength >= 50 && form.qaReport?.metaTitleLength <= 60) ? "text-green-600 dark:text-green-400" : "text-amber-500"
                                            )}>
                                                {form.qaReport?.metaTitleLength || 0} chars (Optimal 50-60)
                                            </span>
                                        </div>

                                        <div className="flex justify-between py-2 items-center">
                                            <span className="text-muted-foreground">Meta Description Character Length:</span>
                                            <span className={cn(
                                                "font-semibold",
                                                (form.qaReport?.metaDescriptionLength >= 140 && form.qaReport?.metaDescriptionLength <= 160) ? "text-green-600 dark:text-green-400" : "text-amber-500"
                                            )}>
                                                {form.qaReport?.metaDescriptionLength || 0} chars (Optimal 140-160)
                                            </span>
                                        </div>
                                    </div>

                                    {/* QA validation trigger button */}
                                    <div className="pt-4 border-t space-y-3">
                                        <Button
                                            type="button"
                                            onClick={runOnDemandValidation}
                                            disabled={runningQa || !form.primaryKeyword}
                                            className="w-full gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0 shadow-md font-semibold h-9"
                                        >
                                            {runningQa ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Sparkles className="h-4 w-4" />
                                            )}
                                            Run On-Demand SEO QA Validation
                                        </Button>
                                        {!form.primaryKeyword && (
                                            <p className="text-[10px] text-destructive text-center">
                                                * Fill in the Primary Keyword first to execute validation checks.
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

interface ImageAltInputProps {
    initialAlt: string;
    index: number;
    src: string;
    onSave: (index: number, newAlt: string) => void;
}

function ImageAltInput({ initialAlt, index, src, onSave }: ImageAltInputProps) {
    const [value, setValue] = useState(initialAlt);

    // Keep in sync if initialAlt changes from outside (e.g. editor updates)
    useEffect(() => {
        setValue(initialAlt);
    }, [initialAlt]);

    const isMissing = !value.trim();
    const isTooShort = value.trim().length > 0 && value.trim().length < 5;
    const hasGenericWord = ["image", "screenshot", "photo", "img", "pic", "picture", "logo"].some(
        word => value.toLowerCase() === word || value.toLowerCase().includes(" " + word) || value.toLowerCase().includes(word + " ")
    );

    return (
        <div className="flex items-start gap-4 p-3 border rounded-lg bg-card hover:bg-muted/10 transition-colors text-card-foreground">
            <div className="relative w-16 h-16 shrink-0 rounded border overflow-hidden bg-muted flex items-center justify-center">
                {src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-xs text-muted-foreground">No Src</span>
                )}
            </div>
            <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-muted-foreground truncate">
                        Image #{index + 1}
                    </span>
                    <div className="flex gap-1">
                        {isMissing ? (
                            <Badge variant="destructive" className="text-[9px] uppercase px-1 py-0 border-0">Missing Alt</Badge>
                        ) : isTooShort ? (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-950/30 dark:text-yellow-400 text-[9px] uppercase px-1 py-0 border-0">Too Short</Badge>
                        ) : hasGenericWord ? (
                            <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100 dark:bg-orange-950/30 dark:text-orange-400 text-[9px] uppercase px-1 py-0 border-0">Generic Alt</Badge>
                        ) : (
                            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-950/30 dark:text-green-400 text-[9px] uppercase px-1 py-0 border-0">SEO Compliant</Badge>
                        )}
                    </div>
                </div>
                <Input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={() => {
                        if (value !== initialAlt) {
                            onSave(index, value);
                        }
                    }}
                    placeholder="Describe this image for SEO..."
                    className="h-8 text-sm"
                />
            </div>
        </div>
    );
}
