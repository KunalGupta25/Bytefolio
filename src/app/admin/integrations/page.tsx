
"use client";

import { useEffect, useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
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

const defaultSiteSettingsForForm: Partial<SiteSettings> = {
  customHtmlWidget: "",
  emailJsServiceId: "",
  emailJsTemplateId: "",
  emailJsPublicKey: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Save Integrations
    </Button>
  );
}

export default function AdminIntegrationsPage() {
  const [currentIntegrationSettings, setCurrentIntegrationSettings] = useState<Partial<SiteSettings>>(defaultSiteSettingsForForm);
  const [isLoading, setIsLoading] = useState(true);
  const [state, formAction] = useActionState(updateSiteSettings, initialFormActionState);
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const settings = await fetchSiteSettingsForAdmin();
        setCurrentIntegrationSettings({
          customHtmlWidget: settings?.customHtmlWidget || "",
          emailJsServiceId: settings?.emailJsServiceId || "",
          emailJsTemplateId: settings?.emailJsTemplateId || "",
          emailJsPublicKey: settings?.emailJsPublicKey || "",
        });
      } catch (error) {
        toast({
          title: 'Error fetching data',
          description: 'Could not load integration settings. Please try again.',
          variant: 'destructive',
        });
        setCurrentIntegrationSettings(defaultSiteSettingsForForm);
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
      if (state.success && state.updatedSiteSettings) {
        setCurrentIntegrationSettings({
          customHtmlWidget: state.updatedSiteSettings.customHtmlWidget || "",
          emailJsServiceId: state.updatedSiteSettings.emailJsServiceId || "",
          emailJsTemplateId: state.updatedSiteSettings.emailJsTemplateId || "",
          emailJsPublicKey: state.updatedSiteSettings.emailJsPublicKey || "",
        });
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

  const handleFormSubmit = async (formData: FormData) => {
    // Fetch current full settings to ensure non-integration fields are preserved
    // and passed to the updateSiteSettings action for validation.
    try {
      const currentFullSettings = await fetchSiteSettingsForAdmin();
      const comprehensiveFormData = new FormData();

      // Populate with existing general settings
      Object.entries(currentFullSettings).forEach(([key, value]) => {
        if (key === 'contactDetails' && typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([contactKey, contactValue]) => {
            if (typeof contactValue === 'string') {
              comprehensiveFormData.append(`contact${contactKey.charAt(0).toUpperCase() + contactKey.slice(1)}`, contactValue);
            }
          });
        } else if (typeof value === 'string' && key !== 'customHtmlWidget' && key !== 'emailJsServiceId' && key !== 'emailJsTemplateId' && key !== 'emailJsPublicKey' ) {
          comprehensiveFormData.append(key, value);
        }
      });
      
      // Add/override with the new integration settings from this page's form
      comprehensiveFormData.set('customHtmlWidget', formData.get('customHtmlWidget') as string);
      comprehensiveFormData.set('emailJsServiceId', formData.get('emailJsServiceId') as string);
      comprehensiveFormData.set('emailJsTemplateId', formData.get('emailJsTemplateId') as string);
      comprehensiveFormData.set('emailJsPublicKey', formData.get('emailJsPublicKey') as string);

      console.log("Submitting comprehensive FormData from Integrations page:", Object.fromEntries(comprehensiveFormData));
      formAction(comprehensiveFormData);

    } catch (error) {
      console.error("Error preparing form data for integrations update:", error);
      toast({
        title: 'Error',
        description: 'Could not prepare settings for update. Please try again.',
        variant: 'destructive',
      });
    }
  };


  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Manage Integrations</h1>
        <p className="text-muted-foreground">Configure third-party services like EmailJS and custom HTML widgets.</p>
      </header>

      <form action={handleFormSubmit} className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>EmailJS Configuration</CardTitle>
            <CardDescription>
              Enter your EmailJS credentials to enable client-side email sending for the contact form.
              These are stored in Firebase. Your Service ID for Gmail might be `service_gula7q9`.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="emailJsServiceId" className="text-sm font-medium">EmailJS Service ID</Label>
              <Input
                id="emailJsServiceId"
                name="emailJsServiceId"
                className="mt-1"
                value={currentIntegrationSettings.emailJsServiceId || 'service_gula7q9'}
                onChange={(e) => setCurrentIntegrationSettings(prev => ({...prev, emailJsServiceId: e.target.value}))}
                placeholder="e.g., service_xxxxxxx"
                aria-describedby={state.errors?.emailJsServiceId ? "emailjs-serviceid-error" : undefined}
              />
              {state.errors?.emailJsServiceId && (
                <p id="emailjs-serviceid-error" className="text-sm text-destructive mt-1">{state.errors.emailJsServiceId.join(', ')}</p>
              )}
            </div>
             <div>
              <Label htmlFor="emailJsTemplateId" className="text-sm font-medium">EmailJS Template ID</Label>
              <Input
                id="emailJsTemplateId"
                name="emailJsTemplateId"
                className="mt-1"
                value={currentIntegrationSettings.emailJsTemplateId || ''}
                onChange={(e) => setCurrentIntegrationSettings(prev => ({...prev, emailJsTemplateId: e.target.value}))}
                placeholder="e.g., template_xxxxxxx"
                aria-describedby={state.errors?.emailJsTemplateId ? "emailjs-templateid-error" : undefined}
              />
              {state.errors?.emailJsTemplateId && (
                <p id="emailjs-templateid-error" className="text-sm text-destructive mt-1">{state.errors.emailJsTemplateId.join(', ')}</p>
              )}
            </div>
             <div>
              <Label htmlFor="emailJsPublicKey" className="text-sm font-medium">EmailJS Public Key (User ID)</Label>
              <Input
                id="emailJsPublicKey"
                name="emailJsPublicKey"
                className="mt-1"
                value={currentIntegrationSettings.emailJsPublicKey || ''}
                onChange={(e) => setCurrentIntegrationSettings(prev => ({...prev, emailJsPublicKey: e.target.value}))}
                placeholder="e.g., YourPublicKeyOrUserID"
                aria-describedby={state.errors?.emailJsPublicKey ? "emailjs-publickey-error" : undefined}
              />
              {state.errors?.emailJsPublicKey && (
                <p id="emailjs-publickey-error" className="text-sm text-destructive mt-1">{state.errors.emailJsPublicKey.join(', ')}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Custom HTML Widget</CardTitle>
            <CardDescription>
              Paste your HTML/script code here (e.g., chat, analytics). It will be rendered at the end of the body on all pages.
              <br />
              <strong className="text-destructive">Warning:</strong> Only use scripts from trusted sources.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="customHtmlWidget" className="text-sm font-medium">Widget HTML/Script Code</Label>
              <Textarea
                id="customHtmlWidget"
                name="customHtmlWidget"
                rows={10}
                className="mt-1 font-mono text-xs min-h-[150px]"
                value={currentIntegrationSettings.customHtmlWidget || ''}
                onChange={(e) => setCurrentIntegrationSettings(prev => ({...prev, customHtmlWidget: e.target.value}))}
                placeholder="<script>...</script> or <div>...</div>"
                aria-describedby={state.errors?.customHtmlWidget ? "widget-error" : undefined}
              />
              {state.errors?.customHtmlWidget && (
                <p id="widget-error" className="text-sm text-destructive mt-1">{state.errors.customHtmlWidget.join(', ')}</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <SubmitButton />
      </form>
    </div>
  );
}
