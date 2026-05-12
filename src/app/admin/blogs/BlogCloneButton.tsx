"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogCloneButtonProps {
    id: string;
}

export default function BlogCloneButton({ id }: BlogCloneButtonProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleClone() {
        if (!confirm("Are you sure you want to clone this post?")) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/blogs/clone/${id}`, {
                method: "POST",
            });

            if (!res.ok) {
                const data = await res.json();
                alert(data.error || "Failed to clone post");
                return;
            }

            const clonedBlog = await res.json();
            router.push(`/admin/blogs/${clonedBlog._id}/edit`);
            router.refresh();
        } catch {
            alert("Something went wrong while cloning");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            onClick={handleClone}
            disabled={loading}
            title="Clone Post"
        >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Copy className="h-4 w-4" />}
        </Button>
    );
}
