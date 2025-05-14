
"use client";

import { useEffect, useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateAboutInfo, fetchAboutDataForAdmin } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { AboutData } from '@/lib/data';
import { Loader2 } from 'lucide-react';

const initialFormActionState = {
  success: false,
  message: '',
  errors: {},
  updatedAboutData: undefined as AboutData | undefined,
};

const defaultAboutData: AboutData = {
  professionalSummary: "",
  bio: "",
  profileImageUrl: "",
  dataAiHint: "",
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
  const [currentAboutData, setCurrentAboutData] = useState<AboutData>(defaultAboutData);
  const [isLoading, setIsLoading] = useState(true);
  const [state, formAction] = useActionState(updateAboutInfo, initialFormActionState);
  const { toast } = useToast();
  
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await fetchAboutDataForAdmin();
        setCurrentAboutData(data || defaultAboutData);
      } catch (error) {
        toast({
          title: 'Error fetching data',
          description: 'Could not load About Me information. Please try again.',
          variant: 'destructive',
        });
        setCurrentAboutData(defaultAboutData); // Fallback
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
      if (state.success && state.updatedAboutData) {
        setCurrentAboutData(state.updatedAboutData);
      }
    }
  }, [state, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" /> Loading About Me data...
      </div>
    );
  }

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
            Changes are stored in Firebase Realtime Database.
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
                value={currentAboutData.professionalSummary}
                onChange={(e) => setCurrentAboutData(prev => ({...prev, professionalSummary: e.target.value}))}
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
                value={currentAboutData.bio}
                onChange={(e) => setCurrentAboutData(prev => ({...prev, bio: e.target.value}))}
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
                value={currentAboutData.profileImageUrl}
                onChange={(e) => setCurrentAboutData(prev => ({...prev, profileImageUrl: e.target.value}))}
                placeholder="https://example.com/your-image.jpg"
                aria-describedby={state.errors?.profileImageUrl ? "imageurl-error" : undefined}
              />
              {state.errors?.profileImageUrl && (
                <p id="imageurl-error" className="text-sm text-destructive mt-1">{state.errors.profileImageUrl.join(', ')}</p>
              )}
            </div>
            <div>
              <Label htmlFor="dataAiHint" className="text-sm font-medium">AI Hint for Profile Image (Optional, 1-2 words)</Label>
              <Input
                id="dataAiHint"
                name="dataAiHint"
                className="mt-1"
                value={currentAboutData.dataAiHint || ''}
                onChange={(e) => setCurrentAboutData(prev => ({...prev, dataAiHint: e.target.value}))}
                placeholder="e.g., professional portrait"
                aria-describedby={state.errors?.dataAiHint ? "dataaihint-error" : undefined}
              />
              {state.errors?.dataAiHint && (
                <p id="dataaihint-error" className="text-sm text-destructive mt-1">{state.errors.dataAiHint.join(', ')}</p>
              )}
            </div>
            
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
