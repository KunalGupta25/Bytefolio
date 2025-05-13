
"use client";

import Link from 'next/link';
import { ThemeToggleButton } from './theme-toggle-button';
import { Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';
import { siteSettingsData } from '@/lib/data'; // Import site settings

const navItems = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Education', href: '#education' },
  { name: 'Projects', href: '#projects' },
  { name: 'Certs', href: '#certifications' },
  { name: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const siteName = siteSettingsData.siteName; // Simulated: Use static data

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
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
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
