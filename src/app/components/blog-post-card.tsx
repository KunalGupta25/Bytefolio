
import type { BlogPost } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, CalendarDays, UserCircle } from 'lucide-react';
import { format } from 'date-fns';

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden h-full">
      {post.imageUrl && (
        <div className="relative w-full h-48 sm:h-56 group">
          <Image
            src={post.imageUrl}
            alt={post.title || 'Blog post image'}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint={post.dataAiHint || "blog image"}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <CardHeader className="pb-3">
        <CardTitle className="text-lg md:text-xl font-semibold text-primary leading-tight hover:text-accent transition-colors">
          <Link href={post.link || '#'} target="_blank" rel="noopener noreferrer">
            {post.title || 'Untitled Post'}
          </Link>
        </CardTitle>
        {(post.pubDate || post.author) && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1.5">
            {post.pubDate && (
              <div className="flex items-center">
                <CalendarDays className="h-3.5 w-3.5 mr-1" />
                <time dateTime={post.pubDate}>{format(new Date(post.pubDate), 'MMM d, yyyy')}</time>
              </div>
            )}
            {post.author && (
              <div className="flex items-center">
                <UserCircle className="h-3.5 w-3.5 mr-1" />
                <span>{post.author}</span>
              </div>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-grow py-0">
        {post.description && (
          <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">
            {post.description}
          </p>
        )}
        {post.categories && post.categories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.categories.slice(0, 3).map((category) => ( // Show max 3 categories
              <Badge key={category} variant="secondary" className="text-xs">{category}</Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-4 pb-4">
        <Button asChild variant="link" size="sm" className="p-0 h-auto text-accent">
          <Link href={post.link || '#'} target="_blank" rel="noopener noreferrer">
            Read More <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
