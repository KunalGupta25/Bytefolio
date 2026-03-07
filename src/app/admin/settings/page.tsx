
"use client";

import { useEffect, useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateSiteSettings, fetchSiteSettingsForAdmin } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { SiteSettings } from '@/lib/data';
import { Loader2 } from 'lucide-react';

const initialFormActionState = {
  success: false,
  message: '',
  errors: {},
  updatedSiteSettings: undefined as SiteSettings | undefined,
};

const defaultSiteSettings: SiteSettings = {
  siteName: "",
  siteTitleSuffix: "",
  siteDescription: "",
  defaultUserName: "",
  defaultUserSpecialization: "",
  heroTagline: "",
  defaultProfileImageUrl: "",
  faviconUrl: "",
  resumeUrl: "", 
  blogUrl: "",
  kofiUrl: "",
  contactDetails: {
    email: "",
    linkedin: "",
    github: "",
    twitter: "",
  },
  customHtmlWidget: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Save Site Settings
    </Button>
  );
}

export default function AdminSettingsPage() {
  const [currentSettings, setCurrentSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [state, formAction] = useActionState(updateSiteSettings, initialFormActionState);
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await fetchSiteSettingsForAdmin();
        setCurrentSettings(data || defaultSiteSettings);
      } catch (error) {
        toast({
          title: 'Error fetching data',
          description: 'Could not load site settings. Please try again.',
          variant: 'destructive',
        });
        setCurrentSettings(defaultSiteSettings);
      }
      setIsLoading(false);
    }
    loadData();
  }, [toast]);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success!' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
      if(state.success && state.updatedSiteSettings) {
        setCurrentSettings(state.updatedSiteSettings);
      }
    }
  }, [state, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" /> Loading Site Settings...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Site Settings</h1>
        <p className="text-muted-foreground">Manage global configurations for your portfolio.</p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>General Site Configuration</CardTitle>
          <CardDescription>
            Update site name, SEO meta, user details, and hero section content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div>
              <Label htmlFor="siteName" className="text-sm font-medium">Site Name (Brand)</Label>
              <Input
                id="siteName"
                name="siteName"
                required
                className="mt-1"
                value={currentSettings.siteName}
                onChange={(e) => setCurrentSettings(prev => ({...prev, siteName: e.target.value}))}
              />
              {state.errors?.siteName && <p className="text-sm text-destructive mt-1">{state.errors.siteName.join(', ')}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="defaultUserName" className="text-sm font-medium">Hero: User Name</Label>
                <Input
                  id="defaultUserName"
                  name="defaultUserName"
                  required
                  className="mt-1"
                  value={currentSettings.defaultUserName}
                  onChange={(e) => setCurrentSettings(prev => ({...prev, defaultUserName: e.target.value}))}
                />
                {state.errors?.defaultUserName && <p className="text-sm text-destructive mt-1">{state.errors.defaultUserName.join(', ')}</p>}
              </div>

              <div>
                <Label htmlFor="defaultUserSpecialization" className="text-sm font-medium">Hero: Specialization (Sub-title)</Label>
                <Input
                  id="defaultUserSpecialization"
                  name="defaultUserSpecialization"
                  required
                  className="mt-1"
                  value={currentSettings.defaultUserSpecialization}
                  onChange={(e) => setCurrentSettings(prev => ({...prev, defaultUserSpecialization: e.target.value}))}
                  placeholder="e.g., MEAN Stack and Python Developer"
                />
                {state.errors?.defaultUserSpecialization && <p className="text-sm text-destructive mt-1">{state.errors.defaultUserSpecialization.join(', ')}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="heroTagline" className="text-sm font-medium">Hero: Tagline (Description Paragraph)</Label>
              <Textarea
                id="heroTagline"
                name="heroTagline"
                required
                rows={3}
                className="mt-1"
                value={currentSettings.heroTagline}
                onChange={(e) => setCurrentSettings(prev => ({...prev, heroTagline: e.target.value}))}
                placeholder="e.g., Building web applications, APIs, and AI agents and more."
              />
              {state.errors?.heroTagline && <p className="text-sm text-destructive mt-1">{state.errors.heroTagline.join(', ')}</p>}
            </div>

            <h3 className="text-lg font-semibold pt-4 border-t mt-6">SEO & External Links</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="siteTitleSuffix" className="text-sm font-medium">Site Title Suffix</Label>
                <Input
                  id="siteTitleSuffix"
                  name="siteTitleSuffix"
                  required
                  className="mt-1"
                  value={currentSettings.siteTitleSuffix}
                  onChange={(e) => setCurrentSettings(prev => ({...prev, siteTitleSuffix: e.target.value}))}
                />
              </div>
              <div>
                <Label htmlFor="faviconUrl" className="text-sm font-medium">Favicon URL</Label>
                <Input
                  id="faviconUrl"
                  name="faviconUrl"
                  className="mt-1"
                  value={currentSettings.faviconUrl || ''}
                  onChange={(e) => setCurrentSettings(prev => ({...prev, faviconUrl: e.target.value}))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="siteDescription" className="text-sm font-medium">Meta Description (Max 160 chars)</Label>
              <Textarea
                id="siteDescription"
                name="siteDescription"
                required
                maxLength={160}
                className="mt-1"
                value={currentSettings.siteDescription}
                onChange={(e) => setCurrentSettings(prev => ({...prev, siteDescription: e.target.value}))}
              />
            </div>

            <h3 className="text-lg font-semibold pt-4 border-t mt-6">Contact Details</h3>
             <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="contactEmail" className="text-sm font-medium">Email</Label>
                <Input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  required
                  className="mt-1"
                  value={currentSettings.contactDetails.email}
                  onChange={(e) => setCurrentSettings(prev => ({...prev, contactDetails: {...prev.contactDetails, email: e.target.value}}))}
                />
              </div>
               <div>
                <Label htmlFor="contactLinkedin" className="text-sm font-medium">LinkedIn URL</Label>
                <Input
                  type="url"
                  id="contactLinkedin"
                  name="contactLinkedin"
                  required
                  className="mt-1"
                  value={currentSettings.contactDetails.linkedin}
                  onChange={(e) => setCurrentSettings(prev => ({...prev, contactDetails: {...prev.contactDetails, linkedin: e.target.value}}))}
                />
              </div>
            </div>

            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
