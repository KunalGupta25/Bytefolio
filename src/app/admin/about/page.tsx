
"use client";

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateAboutInfo } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { aboutData as initialAboutData, siteSettingsData } from '@/lib/data'; // To pre-fill form, and for default image if needed
import { Loader2 } from 'lucide-react';
import { useState } from 'react'; // For managing local state of aboutData

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
      Save Changes
    </Button>
  );
}

export default function AdminAboutPage() {
  const [currentAboutData, setCurrentAboutData] = useState({...initialAboutData});
  const [state, formAction] = useActionState(updateAboutInfo, initialState);
  const { toast } = useToast();
  
  useEffect(() => {
    // Keep local state in sync if lib/data.ts changes (e.g. after successful action)
    setCurrentAboutData({...initialAboutData});
  }, [initialAboutData]);


  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success!' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
      if (state.success) {
        // Refresh currentAboutData from the source of truth after successful update
        setCurrentAboutData({...initialAboutData});
      }
    }
  }, [state, toast]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Manage About Me</h1>
        <p className="text-muted-foreground">Update your personal information displayed on the portfolio.</p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>About Me Details</CardTitle>
          <CardDescription>
            Edit the professional summary, biography, and profile image URL.
            Changes are managed in memory and persist for the current server session.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div>
              <Label htmlFor="professionalSummary" className="text-sm font-medium">Professional Summary</Label>
              <Textarea
                id="professionalSummary"
                name="professionalSummary"
                rows={5}
                required
                className="mt-1 min-h-[120px]"
                defaultValue={currentAboutData.professionalSummary}
                key={`summary-${currentAboutData.professionalSummary}`} // Key to force re-render on change
                aria-describedby={state.errors?.professionalSummary ? "summary-error" : undefined}
              />
              {state.errors?.professionalSummary && (
                <p id="summary-error" className="text-sm text-destructive mt-1">{state.errors.professionalSummary.join(', ')}</p>
              )}
            </div>

            <div>
              <Label htmlFor="bio" className="text-sm font-medium">Biography</Label>
              <Textarea
                id="bio"
                name="bio"
                rows={8}
                required
                className="mt-1 min-h-[150px]"
                defaultValue={currentAboutData.bio}
                key={`bio-${currentAboutData.bio}`} // Key to force re-render
                aria-describedby={state.errors?.bio ? "bio-error" : undefined}
              />
              {state.errors?.bio && (
                <p id="bio-error" className="text-sm text-destructive mt-1">{state.errors.bio.join(', ')}</p>
              )}
            </div>

            <div>
              <Label htmlFor="profileImageUrl" className="text-sm font-medium">Profile Image URL</Label>
              <Input
                type="url"
                id="profileImageUrl"
                name="profileImageUrl"
                className="mt-1"
                defaultValue={currentAboutData.profileImageUrl}
                key={`img-${currentAboutData.profileImageUrl}`} // Key to force re-render
                placeholder="https://example.com/your-image.jpg"
                aria-describedby={state.errors?.profileImageUrl ? "imageurl-error" : undefined}
              />
              {state.errors?.profileImageUrl && (
                <p id="imageurl-error" className="text-sm text-destructive mt-1">{state.errors.profileImageUrl.join(', ')}</p>
              )}
            </div>
            
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
