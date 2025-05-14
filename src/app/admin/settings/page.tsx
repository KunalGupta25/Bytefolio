
"use client";

import { useEffect, useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  defaultUserName: "",
  defaultUserSpecialization: "",
  defaultProfileImageUrl: "",
  contactDetails: {
    email: "",
    linkedin: "",
    github: "",
    twitter: "",
  }
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
            Update the site name, default user info, profile image URL, and contact details. 
            Changes are stored in Firebase Realtime Database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div>
              <Label htmlFor="siteName" className="text-sm font-medium">Site Name</Label>
              <Input
                id="siteName"
                name="siteName"
                required
                className="mt-1"
                value={currentSettings.siteName}
                onChange={(e) => setCurrentSettings(prev => ({...prev, siteName: e.target.value}))}
                aria-describedby={state.errors?.siteName ? "sitename-error" : undefined}
              />
              {state.errors?.siteName && (
                <p id="sitename-error" className="text-sm text-destructive mt-1">{state.errors.siteName.join(', ')}</p>
              )}
            </div>

            <div>
              <Label htmlFor="defaultUserName" className="text-sm font-medium">Default User Name (for Hero Section)</Label>
              <Input
                id="defaultUserName"
                name="defaultUserName"
                required
                className="mt-1"
                value={currentSettings.defaultUserName}
                onChange={(e) => setCurrentSettings(prev => ({...prev, defaultUserName: e.target.value}))}
                aria-describedby={state.errors?.defaultUserName ? "username-error" : undefined}
              />
              {state.errors?.defaultUserName && (
                <p id="username-error" className="text-sm text-destructive mt-1">{state.errors.defaultUserName.join(', ')}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="defaultUserSpecialization" className="text-sm font-medium">Default User Specialization (for Hero Section)</Label>
              <Input
                id="defaultUserSpecialization"
                name="defaultUserSpecialization"
                required
                className="mt-1"
                value={currentSettings.defaultUserSpecialization}
                onChange={(e) => setCurrentSettings(prev => ({...prev, defaultUserSpecialization: e.target.value}))}
                aria-describedby={state.errors?.defaultUserSpecialization ? "specialization-error" : undefined}
              />
              {state.errors?.defaultUserSpecialization && (
                <p id="specialization-error" className="text-sm text-destructive mt-1">{state.errors.defaultUserSpecialization.join(', ')}</p>
              )}
            </div>

            <div>
              <Label htmlFor="defaultProfileImageUrl" className="text-sm font-medium">Default Profile Image URL (Fallback for About Me)</Label>
              <Input
                type="url"
                id="defaultProfileImageUrl"
                name="defaultProfileImageUrl"
                required
                className="mt-1"
                value={currentSettings.defaultProfileImageUrl}
                onChange={(e) => setCurrentSettings(prev => ({...prev, defaultProfileImageUrl: e.target.value}))}
                aria-describedby={state.errors?.defaultProfileImageUrl ? "defaultimageurl-error" : undefined}
              />
              {state.errors?.defaultProfileImageUrl && (
                <p id="defaultimageurl-error" className="text-sm text-destructive mt-1">{state.errors.defaultProfileImageUrl.join(', ')}</p>
              )}
            </div>

            <h3 className="text-lg font-semibold pt-4 border-t mt-6">Contact Details</h3>
             <div>
              <Label htmlFor="contactEmail" className="text-sm font-medium">Contact Email</Label>
              <Input
                type="email"
                id="contactEmail"
                name="contactEmail"
                required
                className="mt-1"
                value={currentSettings.contactDetails.email}
                onChange={(e) => setCurrentSettings(prev => ({...prev, contactDetails: {...prev.contactDetails, email: e.target.value}}))}
                aria-describedby={state.errors?.contactEmail ? "contactemail-error" : undefined}
              />
              {state.errors?.contactEmail && (
                <p id="contactemail-error" className="text-sm text-destructive mt-1">{state.errors.contactEmail.join(', ')}</p>
              )}
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
                aria-describedby={state.errors?.contactLinkedin ? "contactlinkedin-error" : undefined}
              />
              {state.errors?.contactLinkedin && (
                <p id="contactlinkedin-error" className="text-sm text-destructive mt-1">{state.errors.contactLinkedin.join(', ')}</p>
              )}
            </div>
             <div>
              <Label htmlFor="contactGithub" className="text-sm font-medium">GitHub URL</Label>
              <Input
                type="url"
                id="contactGithub"
                name="contactGithub"
                required
                className="mt-1"
                value={currentSettings.contactDetails.github}
                onChange={(e) => setCurrentSettings(prev => ({...prev, contactDetails: {...prev.contactDetails, github: e.target.value}}))}
                aria-describedby={state.errors?.contactGithub ? "contactgithub-error" : undefined}
              />
              {state.errors?.contactGithub && (
                <p id="contactgithub-error" className="text-sm text-destructive mt-1">{state.errors.contactGithub.join(', ')}</p>
              )}
            </div>
             <div>
              <Label htmlFor="contactTwitter" className="text-sm font-medium">Twitter URL (Optional)</Label>
              <Input
                type="url"
                id="contactTwitter"
                name="contactTwitter"
                className="mt-1"
                value={currentSettings.contactDetails.twitter || ''}
                onChange={(e) => setCurrentSettings(prev => ({...prev, contactDetails: {...prev.contactDetails, twitter: e.target.value}}))}
                aria-describedby={state.errors?.contactTwitter ? "contacttwitter-error" : undefined}
              />
              {state.errors?.contactTwitter && (
                <p id="contacttwitter-error" className="text-sm text-destructive mt-1">{state.errors.contactTwitter.join(', ')}</p>
              )}
            </div>
            
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
