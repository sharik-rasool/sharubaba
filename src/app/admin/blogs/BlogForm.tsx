"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, Send, X, Upload, ImageIcon, Plus, Trash2, Search, Link2, ExternalLink, PenSquare, CalendarIcon, Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { BlogDoc } from "@/lib/blogs";
import type { SummernoteRef } from "./SummernoteEditor";

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
    });

    const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [error, setError] = useState("");
    const [uploading, setUploading] = useState(false);
    
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [existingBlogs, setExistingBlogs] = useState<{title: string, slug: string}[]>([]);
    const [linkSearch, setLinkSearch] = useState("");

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
        if (!isAutoSave) setError("");
        if (!form.title.trim()) { if (!isAutoSave) setError("Title is required."); return; }
        if (!form.slug.trim()) { if (!isAutoSave) setError("Slug is required."); return; }
        if (!form.content.trim()) { if (!isAutoSave) setError("Content is required."); return; }

        if (!isAutoSave) {
            if (status === "published") setPublishing(true);
            else setSaving(true);
        }

        const payload = {
            ...form,
            faqs: form.faqs.filter((f) => f.question.trim() && f.answer.trim()),
            tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
            status,
            seoTitle: form.seoTitle || form.title,
            seoDescription: form.seoDescription || form.excerpt,
            scheduledFor: form.scheduledFor ? new Date(form.scheduledFor).toISOString() : null,
            readingTime: calculateReadingTime(form.content),
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
                <TabsList className="flex w-full justify-start overflow-x-auto sm:grid sm:grid-cols-3 max-w-full sm:max-w-[400px] h-auto p-1 hide-scrollbar">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
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
                                            onChange={set("canonicalUrl")}
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
                                        <Badge variant={form.status === "published" ? "default" : "secondary"}>
                                            {form.status.toUpperCase()}
                                        </Badge>
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
            </Tabs>
        </div>
    );
}
