"use client";

import { useEffect } from "react";

export default function ViewCounter({ id }: { id: string }) {
    useEffect(() => {
        // Run once on mount
        fetch(`/api/blogs/view/${id}`, { method: "POST" })
            .catch((err) => console.error("Failed to track view:", err));
    }, [id]);

    return null; // Invisible component
}
