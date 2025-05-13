
"use client";

import { useEffect, useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSiteSettings } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { siteSettingsData as initialSiteSettingsData } from '@/lib/data'; 
import { Loader2 } from 'lucide-react';

const initialState = {
  success: false,
  message: '',
  errors: {},
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
  const [currentSettings, setCurrentSettings] = useState({...initialSiteSettingsData});
  const [state, formAction] = useActionState(updateSiteSettings, initialState);
  const { toast } = useToast();

  useEffect(() => {
    // Keep local state in sync if lib/data.ts changes
    setCurrentSettings({...initialSiteSettingsData});
  }, [initialSiteSettingsData]);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success!' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
      if(state.success) {
        // Refresh from source of truth
        setCurrentSettings({...initialSiteSettingsData});
      }
    }
  }, [state, toast]);

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
            Update the site name and other default values. 
            Changes are managed in memory and persist for the current server session.
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
                defaultValue={currentSettings.siteName}
                key={`sitename-${currentSettings.siteName}`}
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
                defaultValue={currentSettings.defaultUserName}
                key={`username-${currentSettings.defaultUserName}`}
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
                defaultValue={currentSettings.defaultUserSpecialization}
                key={`specialization-${currentSettings.defaultUserSpecialization}`}
                aria-describedby={state.errors?.defaultUserSpecialization ? "specialization-error" : undefined}
              />
              {state.errors?.defaultUserSpecialization && (
                <p id="specialization-error" className="text-sm text-destructive mt-1">{state.errors.defaultUserSpecialization.join(', ')}</p>
              )}
            </div>
            
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
