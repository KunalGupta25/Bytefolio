
import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/lib/data';
import SectionWrapper from './section-wrapper';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Github, ExternalLink } from 'lucide-react';

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <SectionWrapper id="projects" title="Projects" subtitle="Some of the things I've built." className="bg-secondary">
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        {projects.map((project) => (
          <Card key={project.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden">
            <div className="group relative w-full h-56 sm:h-64">
              <Image
                src={project.imageUrl || "https://placehold.co/600x400.png"}
                alt={project.title}
                layout="fill"
                objectFit="cover"
                data-ai-hint={project.dataAiHint || 'project image'}
                className="transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-primary">{project.title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground min-h-[3em]">{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              {project.liveLink && (
                <Button asChild variant="outline" size="sm">
                  <Link href={project.liveLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                  </Link>
                </Button>
              )}
              {project.repoLink && (
                <Button asChild variant="default" size="sm">
                  <Link href={project.repoLink} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" /> Source Code
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
}
