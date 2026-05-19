"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

export interface SummernoteRef {
    insertLink: (text: string, url: string) => void;
}

interface SummernoteEditorProps {
    initialValue?: string;
    onChange: (html: string) => void;
}

const assetPromises = new Map<string, Promise<void>>();

function loadAsset(tag: "script" | "link", attrs: Record<string, string>): Promise<void> {
    const key = tag === "script" ? "src" : "href";
    const url = attrs[key];
    if (!url) return Promise.resolve();

    if (assetPromises.has(url)) {
        return assetPromises.get(url)!;
    }

    const promise = new Promise<void>((resolve) => {
        if (document.querySelector(`${tag}[${key}="${url}"]`)) {
            resolve();
            return;
        }
        const el = document.createElement(tag) as HTMLScriptElement & HTMLLinkElement;
        Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
        el.onload = () => resolve();
        el.onerror = () => resolve();
        document.head.appendChild(el);
    });

    assetPromises.set(url, promise);
    return promise;
}

const SummernoteEditor = forwardRef<SummernoteRef, SummernoteEditorProps>(({ initialValue = "", onChange }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const initialized = useRef(false);
    const onChangeRef = useRef(onChange);

    useImperativeHandle(ref, () => ({
        insertLink: (text: string, url: string) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const $ = (window as any).$;
            if ($ && editorRef.current) {
                $(editorRef.current).summernote("createLink", {
                    text,
                    url,
                    isNewWindow: false,
                });
            }
        },
    }));

    // Keep the latest onChange callback without triggering re-initialization
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        if (initialized.current || !editorRef.current) return;
        const editorNode = editorRef.current;

        const init = async () => {
            await loadAsset("script", { src: "https://code.jquery.com/jquery-3.7.1.min.js" });
            await loadAsset("link", {
                rel: "stylesheet",
                href: "https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-lite.min.css",
            });
            await loadAsset("script", {
                src: "https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-lite.min.js",
            });

            // Polling loop: wait for Summernote plugin to attach to jQuery prototype
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let $ = (window as any).$;
            let attempts = 0;
            while ((!$ || !$.fn?.summernote) && attempts < 50) {
                await new Promise((r) => setTimeout(r, 100));
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                $ = (window as any).$;
                attempts++;
            }

            if (!$ || !$.fn?.summernote || !editorNode) return;

            $(editorNode).summernote({
                height: 500,
                placeholder: "Write your blog post content here...",
                toolbar: [
                    ["style", ["style"]],
                    ["font", ["bold", "italic", "underline", "strikethrough", "clear"]],
                    ["fontsize", ["fontsize"]],
                    ["color", ["color"]],
                    ["para", ["ul", "ol", "paragraph"]],
                    ["table", ["table"]],
                    ["insert", ["link", "picture", "hr"]],
                    ["view", ["fullscreen", "codeview"]],
                ],
                fontSizes: ["12", "13", "14", "15", "16", "18", "20", "24", "28", "32", "36", "48"],
                callbacks: {
                    onChange: (contents: string) => {
                        onChangeRef.current(contents);
                    },
                    onImageUpload: async (files: FileList) => {
                        const formData = new FormData();
                        formData.append("file", files[0]);
                        try {
                            const res = await fetch("/api/upload", { method: "POST", body: formData });
                            const data = await res.json();
                            if (data.url) {
                                $(editorNode).summernote("insertImage", data.url, files[0].name);
                            }
                        } catch {
                            alert("Image upload failed. Please try again.");
                        }
                    },
                },
            });

            if (initialValue) {
                $(editorNode).summernote("code", initialValue);
            }

            initialized.current = true;
        };

        init();

        return () => {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const $ = (window as any).$;
                if ($ && editorNode && initialized.current) {
                    $(editorNode).summernote("destroy");
                }
            } catch {
                // Ignore destruction errors on unmount
            }
            initialized.current = false;
        };
    }, []); // Run only once on mount

    return (
        <div className="editor-container max-w-full overflow-hidden relative">
            <style>{`
                .note-editor.note-frame { border-radius: 6px; border-color: hsl(var(--border)); display: flex; flex-direction: column; }
                
                /* Sticky Toolbar Magic */
                .note-toolbar { 
                    background: hsl(var(--muted)) !important; 
                    border-color: hsl(var(--border)) !important; 
                    border-radius: 6px 6px 0 0; 
                    position: sticky; 
                    top: 0; 
                    z-index: 40; 
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); 
                }
                
                .note-editable { background: hsl(var(--background)) !important; color: hsl(var(--foreground)) !important; font-size: 16px; line-height: 1.8; min-height: 400px; padding: 24px !important; }
                
                /* Mobile Responsiveness */
                @media (max-width: 768px) {
                    .note-editable { font-size: 15px; padding: 16px !important; }
                    .note-btn-group { margin-bottom: 4px; }
                }

                .note-statusbar { background: hsl(var(--muted)) !important; border-color: hsl(var(--border)) !important; border-radius: 0 0 6px 6px; }
                .note-btn { background: transparent !important; border-color: transparent !important; color: hsl(var(--foreground)) !important; }
                .note-btn > span { color: hsl(var(--foreground)) !important; }
                .note-btn:hover { background: hsl(var(--accent)) !important; }
                
                .note-dropdown-menu { background: hsl(var(--background)) !important; border-color: hsl(var(--border)) !important; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
                .note-dropdown-menu a, .note-dropdown-item { color: hsl(var(--foreground)) !important; }
                .note-dropdown-menu a:hover, .note-dropdown-item:hover { background: hsl(var(--accent)) !important; color: hsl(var(--foreground)) !important; }
                .note-dropdown-menu h1, .note-dropdown-menu h2, .note-dropdown-menu h3, .note-dropdown-menu h4, .note-dropdown-menu h5, .note-dropdown-menu h6, .note-dropdown-menu p, .note-dropdown-menu pre { 
                    color: hsl(var(--foreground)) !important; 
                    margin: 0; 
                }
                
                /* Override Tailwind Preflight for headings inside editor and dropdown */
                .note-editable h1, .note-dropdown-menu h1 { font-size: 2.25rem !important; font-weight: 700 !important; }
                .note-editable h2, .note-dropdown-menu h2 { font-size: 1.875rem !important; font-weight: 700 !important; }
                .note-editable h3, .note-dropdown-menu h3 { font-size: 1.5rem !important; font-weight: 600 !important; }
                .note-editable h4, .note-dropdown-menu h4 { font-size: 1.25rem !important; font-weight: 600 !important; }
                .note-editable h5, .note-dropdown-menu h5 { font-size: 1.125rem !important; font-weight: 600 !important; }
                .note-editable h6, .note-dropdown-menu h6 { font-size: 1rem !important; font-weight: 600 !important; }
                
                /* Margins for editor only (not dropdown) */
                .note-editable h1, .note-editable h2 { margin-top: 1.5rem !important; margin-bottom: 1rem !important; line-height: 1.2 !important; }
                .note-editable h3, .note-editable h4 { margin-top: 1.25rem !important; margin-bottom: 0.75rem !important; line-height: 1.2 !important; }
                .note-editable h5, .note-editable h6 { margin-top: 1rem !important; margin-bottom: 0.5rem !important; line-height: 1.2 !important; }
                .note-editable p { margin-bottom: 1rem !important; }
                
                .note-placeholder { color: hsl(var(--muted-foreground)) !important; padding: 24px !important; }
            `}</style>
            <div ref={editorRef} />
        </div>
    );
});

SummernoteEditor.displayName = "SummernoteEditor";

export default SummernoteEditor;
