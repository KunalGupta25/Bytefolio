
'use server';

import type { BlogPost } from './data'; // Assuming BlogPost is in data.ts

/**
 * Fetches blog posts. Currently returns placeholder data.
 * For actual RSS feed parsing, you would integrate a library like 'rss-parser'.
 * @param feedUrl The URL of the RSS feed.
 * @returns A promise that resolves to an array of BlogPost objects.
 */
export async function fetchBlogPosts(feedUrl?: string): Promise<BlogPost[]> {
  if (!feedUrl || feedUrl.trim() === '') {
    console.log('No RSS feed URL provided, returning no blog posts.');
    return [];
  }

  // TODO: This is placeholder data.
  // For actual RSS feed parsing, you would use a library like 'rss-parser'
  // and fetch the content from the feedUrl.
  // Example:
  // import Parser from 'rss-parser';
  // const parser = new Parser();
  // try {
  //   const feed = await parser.parseURL(feedUrl);
  //   return feed.items.map((item, index) => ({
  //     id: item.guid || item.link || `post-${index}`,
  //     title: item.title || 'No title',
  //     link: item.link || '#',
  //     pubDate: item.pubDate,
  //     description: item.contentSnippet || item.content || item.summary,
  //     imageUrl: item.enclosure?.url || (item.media && item.media.content && item.media.content.$ && item.media.content.$.url), // Basic image extraction
  //     author: item.creator || item.author,
  //     categories: Array.isArray(item.categories) ? item.categories : (item.categories ? [item.categories] : []),
  //     dataAiHint: 'blog post' // Generic hint
  //   }));
  // } catch (error) {
  //   console.error('Error fetching or parsing RSS feed:', error);
  //   return [];
  // }

  console.warn(`RSS feed URL provided ("${feedUrl}"), but currently using placeholder blog data. Actual RSS parsing needs to be implemented in src/lib/blog-utils.ts.`);

  return [
    {
      id: 'placeholder-1',
      title: 'My First Awesome Blog Post',
      link: '#', 
      pubDate: new Date(Date.now() - 86400000 * 2).toISOString(),
      description: 'This is a short snippet of my first blog post. It talks about interesting things and modern web development techniques, along with other cool stuff.',
      imageUrl: 'https://placehold.co/600x400.png?text=Blog+Post+1',
      dataAiHint: 'technology abstract',
      author: 'AI Assistant',
      categories: ['Tech', 'WebDev', 'Intro'],
    },
    {
      id: 'placeholder-2',
      title: 'Exploring Next.js Server Components',
      link: '#',
      pubDate: new Date(Date.now() - 86400000 * 5).toISOString(),
      description: 'A deep dive into how Next.js Server Components work and how they can improve performance and developer experience for modern web applications.',
      imageUrl: 'https://placehold.co/600x400.png?text=Blog+Post+2',
      dataAiHint: 'server code',
      author: 'AI Assistant',
      categories: ['Next.js', 'React', 'Performance'],
    },
    {
      id: 'placeholder-3',
      title: 'The Future of AI in Coding',
      link: '#',
      pubDate: new Date(Date.now() - 86400000 * 10).toISOString(),
      description: 'Discussing the evolving role of AI in software development, from code generation and automated testing to advanced debugging and beyond.',
      // No imageUrl for this one to test fallback
      dataAiHint: 'ai brain',
      author: 'AI Assistant',
      categories: ['AI', 'Development', 'Future'],
    },
  ];
}
