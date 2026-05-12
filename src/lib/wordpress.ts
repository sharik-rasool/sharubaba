export interface WordPressPost {
    id: number;
    title: { rendered: string };
    content: { rendered: string };
    excerpt: { rendered: string };
    slug: string;
    date: string;
    modified: string;
    _embedded?: {
        'wp:featuredmedia'?: Array<{
            source_url: string;
            alt_text?: string;
        }>;
        'wp:term'?: Array<Array<{
            id: number;
            name: string;
            slug: string;
            taxonomy: string;
        }>>;
    };
}



const WP_URL = 'https://sharikrasool.com/wp-json/wp/v2';

// Helper to fetch data
async function fetchAPI(endpoint: string) {
    const res = await fetch(`${WP_URL}${endpoint}`, {
        next: { revalidate: 60 }, // Revalidate every minute
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch API: ${endpoint}`);
    }

    return res.json();
}

export async function getWordPressPosts() {
    try {
        const posts = await fetchAPI('/posts?_embed&per_page=100');
        return posts.map((post: WordPressPost) => transformPost(post));
    } catch (error) {
        console.error("Error fetching WordPress posts:", error);
        return [];
    }
}

export async function getWordPressPostBySlug(slug: string) {
    try {
        const posts = await fetchAPI(`/posts?slug=${slug}&_embed`);
        if (posts.length > 0) {
            return transformPost(posts[0]);
        }
        return null;
    } catch (error) {
        console.error("Error fetching WordPress post by slug:", error);
        return null;
    }
}

function transformPost(post: WordPressPost) {
    const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
    const tags = post._embedded?.['wp:term']?.flat().filter(term => term.taxonomy === 'post_tag').map(term => term.name) || [];

    return {
        _id: post.id.toString(),
        title: post.title.rendered,
        slug: post.slug,
        content: post.content.rendered,
        excerpt: post.excerpt.rendered.replace(/<[^>]*>?/gm, ''), // Strip HTML from excerpt
        coverImage: featuredMedia?.source_url || null, // Fallback or null
        tags: tags,
        status: 'published', // WP API only returns published by default
        createdAt: post.date,
        updatedAt: post.modified,
    };
}


