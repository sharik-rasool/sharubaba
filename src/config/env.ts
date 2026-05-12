
export const config = {

  wordpress: {
    apiUrl: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '',
  },

  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL,
    name: process.env.NEXT_PUBLIC_SITE_NAME,
  },

  author: {
    name: process.env.NEXT_PUBLIC_AUTHOR_NAME,
    url: process.env.NEXT_PUBLIC_AUTHOR_URL,
  },
};

export default config;
