
"use client";

import { useEffect, useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

const defaultSiteSettings: Partial<SiteSettings> = { // Partial for this page, only needs customHtmlWidget
  customHtmlWidget: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Save Widget Code
    </Button>
  );
}

export default function AdminIntegrationsPage() {
  const [currentWidgetCode, setCurrentWidgetCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  // We reuse updateSiteSettings. It will only update fields present in formData.
  const [state, formAction] = useActionState(updateSiteSettings, initialFormActionState);
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const settings = await fetchSiteSettingsForAdmin();
        setCurrentWidgetCode(settings?.customHtmlWidget || "");
      } catch (error) {
        toast({
          title: 'Error fetching data',
          description: 'Could not load custom widget code. Please try again.',
          variant: 'destructive',
        });
        setCurrentWidgetCode("");
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
      if (state.success && state.updatedSiteSettings?.customHtmlWidget !== undefined) {
        setCurrentWidgetCode(state.updatedSiteSettings.customHtmlWidget);
      }
    }
  }, [state, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" /> Loading Integrations...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Manage Integrations</h1>
        <p className="text-muted-foreground">Embed custom HTML/script based widgets (e.g., chat, analytics).</p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Custom HTML Widget</CardTitle>
          <CardDescription>
            Paste your HTML/script code here. It will be rendered at the end of the body on all pages.
            <br />
            <strong className="text-destructive">Warning:</strong> Only use scripts from trusted sources. Incorrect or malicious scripts can break your site or compromise security.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form 
            action={(formData) => {
              // To make updateSiteSettings work, we need to provide all expected fields
              // for validation, even if they are not changed on this page.
              // Fetch current settings and merge.
              fetchSiteSettingsForAdmin().then(currentSettings => {
                const fullFormData = new FormData();
                // Populate with existing settings
                Object.entries(currentSettings).forEach(([key, value]) => {
                  if (key === 'contactDetails' && typeof value === 'object' && value !== null) {
                     Object.entries(value).forEach(([contactKey, contactValue]) => {
                        if (typeof contactValue === 'string') {
                           fullFormData.append(`contact${contactKey.charAt(0).toUpperCase() + contactKey.slice(1)}`, contactValue);
                        }
                     });
                  } else if (typeof value === 'string') {
                    fullFormData.append(key, value);
                  }
                });
                // Override with the new widget code from this page's form
                fullFormData.set('customHtmlWidget', formData.get('customHtmlWidget') as string);
                formAction(fullFormData);
              });
            }} 
            className="space-y-6"
          >
            <div>
              <Label htmlFor="customHtmlWidget" className="text-sm font-medium">Widget HTML/Script Code</Label>
              <Textarea
                id="customHtmlWidget"
                name="customHtmlWidget"
                rows={15}
                className="mt-1 font-mono text-xs min-h-[200px]"
                value={currentWidgetCode}
                onChange={(e) => setCurrentWidgetCode(e.target.value)}
                placeholder="<script>...</script> or <div>...</div>"
                aria-describedby={state.errors?.customHtmlWidget ? "widget-error" : undefined}
              />
              {state.errors?.customHtmlWidget && (
                <p id="widget-error" className="text-sm text-destructive mt-1">{state.errors.customHtmlWidget.join(', ')}</p>
              )}
            </div>
            
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
