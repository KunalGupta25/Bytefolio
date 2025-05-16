
import Image from 'next/image';
import type { AboutData } from '@/lib/data'; // Import type
import SectionWrapper from './section-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SplineViewerComponent from './spline-viewer-component';

interface AboutSectionProps {
  aboutData: AboutData;
  userName: string; // For alt text
}

export default function AboutSection({ aboutData, userName }: AboutSectionProps) {
  return (
    <SectionWrapper id="about" title="About Me" subtitle="A little bit about my journey and passion for technology.">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
        {/* Visual Column: Profile Image & Spline Viewer */}
        <div className="lg:col-span-2 flex flex-col items-center space-y-8">
          <div className="relative w-52 h-52 md:w-64 md:h-64 rounded-full overflow-hidden shadow-xl border-4 border-accent transform hover:scale-105 transition-transform duration-300">
            <Image
              src={aboutData.profileImageUrl || "https://placehold.co/300x300.png"}
              alt={`Profile Picture of ${userName}`}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 208px, 256px" // Adjusted sizes for w-52 and w-64
              priority 
              data-ai-hint={aboutData.dataAiHint || "profile picture"}
              className="transform hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="w-full h-72 md:h-96 rounded-lg overflow-hidden shadow-lg border border-border bg-card">
           <SplineViewerComponent />
          </div>
        </div>

        {/* Text Column: Summary & Bio Cards */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Professional Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-foreground leading-relaxed">
                {aboutData.professionalSummary}
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
             <CardHeader>
              <CardTitle className="text-2xl text-primary">More About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-foreground leading-relaxed">
                {aboutData.bio}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SectionWrapper>
  );
}
