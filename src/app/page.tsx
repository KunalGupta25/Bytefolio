
import Navigation from '@/app/components/navigation';
import HeroSection from '@/app/components/hero-section';
import AboutSection from '@/app/components/about-section';
import SkillsSection from '@/app/components/skills-section';
import EducationSection from '@/app/components/education-section';
import ProjectsSection from '@/app/components/projects-section';
import CertificationsSection from '@/app/components/certifications-section';
import BlogCallToActionSection from '@/app/components/blog-call-to-action-section'; // New import
import ContactSection from '@/app/components/contact-section';
import Footer from '@/app/components/footer';
import { 
  getSiteSettings, 
  getAboutData, 
  getSkills, 
  getEducationItems, 
  getProjects, 
  getCertifications 
} from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function PortfolioPage() {
  const siteSettings = await getSiteSettings();
  const aboutData = await getAboutData();
  const skills = await getSkills();
  const educationItems = await getEducationItems();
  const projects = await getProjects();
  const certifications = await getCertifications();

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation 
        siteName={siteSettings.siteName} 
        blogUrl={siteSettings.blogUrl} 
      />
      <main className="flex-grow">
        <HeroSection 
          userName={siteSettings.defaultUserName} 
          userSpecialization={siteSettings.defaultUserSpecialization} 
          resumeUrl={siteSettings.resumeUrl || "/resume.pdf"} 
        />
        <AboutSection 
          aboutData={aboutData} 
          userName={siteSettings.defaultUserName}
        />
        <SkillsSection skills={skills} />
        <EducationSection educationItems={educationItems} />
        <ProjectsSection projects={projects} />
        <CertificationsSection certifications={certifications} />
        <BlogCallToActionSection blogUrl={siteSettings.blogUrl} /> {/* New Section */}
        <ContactSection 
          contactDetails={siteSettings.contactDetails} 
          kofiUrl={siteSettings.kofiUrl} 
        />
      </main>
      <Footer 
        siteName={siteSettings.siteName} 
        userName={siteSettings.defaultUserName} 
        contactDetails={siteSettings.contactDetails} 
      />
    </div>
  );
}
