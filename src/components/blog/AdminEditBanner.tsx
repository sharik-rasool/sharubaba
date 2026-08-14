"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export function AdminEditBanner({ postId }: { postId: string }) {
    const { data: session, status } = useSession();

    if (status !== "authenticated" || !session) return null;

    return (
        <div className="w-full bg-slate-900 text-slate-100 py-2.5 px-4 text-sm sticky top-0 z-50 shadow-md">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>SR Admin Mode</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-400 hidden sm:inline">{session.user?.email}</span>
                    <Link
                        href={`/admin/blogs/${postId}/edit`}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-3.5 py-1.5 rounded-md transition-colors text-xs flex items-center gap-1.5"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                        Edit Post
                    </Link>
                </div>
            </div>
        </div>
    );
}
