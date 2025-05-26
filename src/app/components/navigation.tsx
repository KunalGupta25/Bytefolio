
"use client";

import Link from 'next/link';
import { ThemeToggleButton } from './theme-toggle-button';
import { Code2, BookOpen } from 'lucide-react'; // Added BookOpen for Blog
import { cn } from '@/lib/utils';
import React from 'react';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Education', href: '#education' },
  { name: 'Projects', href: '#projects' },
  { name: 'Certs', href: '#certifications' },
  { name: 'Contact', href: '#contact' },
];

interface NavigationProps {
  siteName: string;
  blogUrl?: string;
}

export default function Navigation({ siteName, blogUrl }: NavigationProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled ? "bg-background/80 backdrop-blur-md shadow-md" : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:text-accent transition-colors">
            <Code2 className="h-8 w-8 text-accent" />
            <span>{siteName}</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
            {blogUrl && (
              <Button asChild variant="ghost" className="text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                <Link href={blogUrl} target="_blank" rel="noopener noreferrer">
                  <BookOpen className="mr-1.5 h-4 w-4" /> Blog
                </Link>
              </Button>
            )}
          </nav>
          <div className="flex items-center">
            <ThemeToggleButton />
            {/* Mobile menu button can be added here */}
          </div>
        </div>
      </div>
    </header>
  );
}
