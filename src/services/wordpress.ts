
import { config } from "@/config/env";

const BASE_URL = config.wordpress.apiUrl;

export interface WordPressPost {
  id: number;
  slug: string;
  date: string;
  modified: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _embedded?: any;
}


export const wordpressService = {
  
  async getPosts(page = 1, perPage = 12): Promise<WordPressPost[]> {
    const res = await fetch(
      `${BASE_URL}/posts?page=${page}&per_page=${perPage}&_embed=true`
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch posts: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  },

  async getPost(slug: string): Promise<WordPressPost> {
    const res = await fetch(
      `${BASE_URL}/posts?slug=${slug}&_embed=true`
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch post: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error("Post not found");
    }

    return data[0];
  },


  getFeaturedImageUrl(post: WordPressPost): string | null {
    return (
      post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null
    );
  },

  getAuthor(post: WordPressPost) {
    return post?._embedded?.author?.[0] || null;
  },

  getPostCategories(post: WordPressPost) {
    return post?._embedded?.["wp:term"]?.[0] || [];
  },

  getPostTags(post: WordPressPost) {
    return post?._embedded?.["wp:term"]?.[1] || [];
  },

  stripHtml(html: string): string {
    return html.replace(/<[^>]*>?/gm, "").trim();
  },

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },
};
