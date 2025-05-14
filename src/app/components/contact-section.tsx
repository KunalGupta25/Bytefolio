
import type { ContactDetails } from '@/lib/data';
import SectionWrapper from './section-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import { ContactForm } from './contact-form';

interface ContactSectionProps {
  contactDetails: ContactDetails;
}

export default function ContactSection({ contactDetails }: ContactSectionProps) {
  return (
    <SectionWrapper id="contact" title="Get In Touch" subtitle="Feel free to reach out. I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Send me a message</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card className="shadow-xl">
            <CardHeader>
                <CardTitle className="text-2xl text-primary">Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <a href={`mailto:${contactDetails.email}`} className="flex items-center group">
                <Mail className="h-6 w-6 mr-3 text-accent group-hover:scale-110 transition-transform" />
                <span className="text-lg text-foreground group-hover:text-accent transition-colors">{contactDetails.email}</span>
              </a>
              <p className="text-muted-foreground">
                Connect with me on social media:
              </p>
              <div className="flex space-x-4">
                <Button asChild variant="outline" size="icon" aria-label="GitHub Profile">
                  <Link href={contactDetails.github} target="_blank" rel="noopener noreferrer">
                    <Github className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="icon" aria-label="LinkedIn Profile">
                  <Link href={contactDetails.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-5 w-5" />
                  </Link>
                </Button>
                {contactDetails.twitter && (
                   <Button asChild variant="outline" size="icon" aria-label="Twitter Profile">
                    <Link href={contactDetails.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-5 w-5" />
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
           <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Let&apos;s Collaborate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">
                I&apos;m excited to connect with fellow developers, designers, and potential employers. Whether you have a question or just want to say hi, I&apos;ll try my best to get back to you!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SectionWrapper>
  );
}
