
import type { Skill } from '@/lib/data';
import SectionWrapper from './section-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as LucideIcons from 'lucide-react';

const categoryOrder: Array<Skill['category']> = ['Language', 'Framework/Library', 'Tool', 'Database', 'Cloud', 'Other'];

interface SkillsSectionProps {
  skills: Skill[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<Skill['category'], Skill[]>);

  const IconComponent = ({ iconName }: { iconName?: Skill['iconName'] }) => {
    if (!iconName || typeof iconName !== 'string' || !(iconName in LucideIcons)) return null;
    const ResolvedIcon = LucideIcons[iconName as keyof typeof LucideIcons] as React.ElementType;
    return ResolvedIcon ? <ResolvedIcon className="h-7 w-7 text-accent" /> : null;
  };


  return (
    <SectionWrapper 
      id="skills" 
      title="My Skills" 
      subtitle="Technologies and tools I work with."
      className="bg-secondary"
    >
      <Tabs defaultValue={categoryOrder.find(cat => skillsByCategory[cat] && skillsByCategory[cat].length > 0) || categoryOrder[0]} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-8">
          {categoryOrder.map((category) => (
            skillsByCategory[category] && skillsByCategory[category].length > 0 && (
              <TabsTrigger key={category} value={category} className="text-xs sm:text-sm">
                {category}
              </TabsTrigger>
            )
          ))}
        </TabsList>

        {categoryOrder.map((category) => (
          skillsByCategory[category] && skillsByCategory[category].length > 0 && (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {skillsByCategory[category].map((skill) => (
                    <Card key={skill.id} className="shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-semibold text-primary">{skill.name}</CardTitle>
                          <IconComponent iconName={skill.iconName} />
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        {skill.level !== undefined && skill.level !== null && ( // Check for null as well
                          <div className="mt-2">
                            <Progress value={skill.level} aria-label={`${skill.name} proficiency ${skill.level}%`} className="h-3" />
                            <p className="text-xs text-muted-foreground mt-1 text-right">{skill.level}%</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                )}
              </div>
            </TabsContent>
          )
        ))}
      </Tabs>
    </SectionWrapper>
  );
}
