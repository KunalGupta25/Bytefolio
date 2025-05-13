import { skillsData } from '@/lib/data';
import SectionWrapper from './section-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress'; // For optional skill bars
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

const categoryOrder: Array<Skill['category']> = ['Language', 'Framework/Library', 'Tool', 'Database', 'Cloud', 'Other'];


export default function SkillsSection() {
  const skillsByCategory = skillsData.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<Skill['category'], typeof skillsData>);

  return (
    <SectionWrapper 
      id="skills" 
      title="My Skills" 
      subtitle="Technologies and tools I work with."
      className="bg-secondary"
    >
      <Tabs defaultValue={categoryOrder[0]} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-8">
          {categoryOrder.map((category) => (
            skillsByCategory[category] && (
              <TabsTrigger key={category} value={category} className="text-xs sm:text-sm">
                {category}
              </TabsTrigger>
            )
          ))}
        </TabsList>

        {categoryOrder.map((category) => (
          skillsByCategory[category] && (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {skillsByCategory[category].map((skill) => (
                  <Card key={skill.name} className="shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-primary">{skill.name}</CardTitle>
                        {skill.icon && <skill.icon className="h-7 w-7 text-accent" />}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      {skill.level !== undefined && (
                        <div className="mt-2">
                           <Progress value={skill.level} aria-label={`${skill.name} proficiency ${skill.level}%`} className="h-3" />
                           <p className="text-xs text-muted-foreground mt-1 text-right">{skill.level}%</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )
        ))}
      </Tabs>
    </SectionWrapper>
  );
}
