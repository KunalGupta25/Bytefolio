
import Image from 'next/image';
import { aboutData, siteSettingsData } from '@/lib/data';
import SectionWrapper from './section-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SplineViewerComponent from './spline-viewer-component';

export default function AboutSection() {
  // In a real app, this data would come from a dynamic source (e.g., context, API)
  // For now, we use the static data. Admin panel changes are simulated.
  const profileName = siteSettingsData.defaultUserName; // For alt text

  return (
    <SectionWrapper id="about" title="About Me" subtitle="A little bit about my journey and passion for technology.">
      <div className="grid md:grid-cols-3 gap-8 items-center">
        <div className="md:col-span-1 flex flex-col items-center space-y-6">
          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-xl border-4 border-accent">
            <Image
              src={aboutData.profileImageUrl} // This can be updated by admin (simulated)
              alt={`Profile Picture of ${profileName}`}
              layout="fill"
              objectFit="cover"
              priority // Add priority for LCP images if this is above the fold
              data-ai-hint={aboutData.dataAiHint}
              className="transform hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="w-full h-64 md:h-96 md:col-span-1">
           <SplineViewerComponent />
          </div>
        </div>
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Professional Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-foreground leading-relaxed">
                {aboutData.professionalSummary} {/* This can be updated by admin (simulated) */}
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
             <CardHeader>
              <CardTitle className="text-2xl text-primary">More About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-foreground leading-relaxed">
                {aboutData.bio} {/* This can be updated by admin (simulated) */}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SectionWrapper>
  );
}

