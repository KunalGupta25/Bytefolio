
import SectionWrapper from './section-wrapper';
import BlogPostCard from './blog-post-card';
import { fetchBlogPosts } from '@/lib/blog-utils'; // Placeholder fetcher
import type { BlogPost } from '@/lib/data';

interface BlogSectionProps {
  rssFeedUrl?: string;
}

export default async function BlogSection({ rssFeedUrl }: BlogSectionProps) {
  if (!rssFeedUrl) {
    return null; // Don't render the section if no RSS feed URL is provided
  }

  const posts: BlogPost[] = await fetchBlogPosts(rssFeedUrl);

  if (!posts || posts.length === 0) {
    // Optionally, render a message if the feed URL is set but no posts are found/returned
    // For now, just return null to hide the section
    console.log("BlogSection: No posts found or feed URL invalid, section will not render.");
    return null;
  }

  return (
    <SectionWrapper
      id="blog"
      title="Latest Posts"
      subtitle="Insights, thoughts, and updates from my blog."
      className="bg-secondary"
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {posts.map((post) => (
          <BlogPostCard key={post.id || post.link} post={post} />
        ))}
      </div>
    </SectionWrapper>
  );
}
