
import Navigation from '@/app/components/navigation';
import HeroSection from '@/app/components/hero-section';
import AboutSection from '@/app/components/about-section';
import SkillsSection from '@/app/components/skills-section';
import EducationSection from '@/app/components/education-section';
import ProjectsSection from '@/app/components/projects-section';
import CertificationsSection from '@/app/components/certifications-section';
import ContactSection from '@/app/components/contact-section';
import Footer from '@/app/components/footer';

// Force dynamic rendering to ensure data changes from admin panel are reflected
export const dynamic = 'force-dynamic';

export default function PortfolioPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <EducationSection />
        <ProjectsSection />
        <CertificationsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

