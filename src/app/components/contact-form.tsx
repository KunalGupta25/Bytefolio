
"use client";

import { useActionState, useEffect, useState, FormEvent } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { submitContactForm } from '@/app/actions'; // Server action for Firebase storage / Resend fallback
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import emailjs from 'emailjs-com';

const serverActionInitialState = {
  success: false,
  message: '',
  errors: {}, 
};

interface ContactFormProps {
  emailJsServiceId?: string;
  emailJsTemplateId?: string;
  emailJsPublicKey?: string;
}

interface ClientSideFormState {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
    general?: string[];
  };
  isSubmitting: boolean;
}

const clientInitialState: ClientSideFormState = {
  success: false,
  message: '',
  errors: {},
  isSubmitting: false,
};

function SubmitButton({ isSubmittingClient }: { isSubmittingClient: boolean }) {
  const { pending: pendingServer } = useFormStatus();
  const isPending = isSubmittingClient || pendingServer;
  return (
    <Button type="submit" disabled={isPending} className="w-full sm:w-auto" size="lg">
      {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Send Message
    </Button>
  );
}

export function ContactForm({ emailJsServiceId, emailJsTemplateId, emailJsPublicKey }: ContactFormProps) {
  const [serverState, serverFormAction] = useActionState(submitContactForm, serverActionInitialState);
  const [clientState, setClientState] = useState<ClientSideFormState>(clientInitialState);
  const { toast } = useToast();

  const useEmailJS = !!(emailJsServiceId && emailJsTemplateId && emailJsPublicKey);

  useEffect(() => {
    if (serverState.message && !useEmailJS) { // Only show server toasts if not using EmailJS or EmailJS failed and fell back
      toast({
        title: serverState.success ? 'Success!' : 'Error',
        description: serverState.message,
        variant: serverState.success ? 'default' : 'destructive',
      });
    }
  }, [serverState, toast, useEmailJS]);
  
  useEffect(() => {
    if (clientState.message && useEmailJS) { // Only show client toasts if using EmailJS
       toast({
        title: clientState.success ? 'Success!' : 'Error',
        description: clientState.message,
        variant: clientState.success ? 'default' : 'destructive',
      });
    }
  }, [clientState, toast, useEmailJS]);


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    // Basic client-side validation
    const errors: ClientSideFormState['errors'] = {};
    if (!name || name.length < 2) errors.name = ["Name must be at least 2 characters."];
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = ["Invalid email address."];
    if (!message || message.length < 10) errors.message = ["Message must be at least 10 characters."];

    if (Object.keys(errors).length > 0) {
      setClientState({
        success: false,
        message: "Validation failed. Please check your input.",
        errors: errors,
        isSubmitting: false,
      });
      return;
    }
    
    setClientState(prev => ({ ...prev, isSubmitting: true, message: '', errors: {} }));

    if (useEmailJS && emailJsServiceId && emailJsTemplateId && emailJsPublicKey) {
      const templateParams = {
        name: name,
        email: email,
        message: message,
      };
      try {
        await emailjs.send(emailJsServiceId, emailJsTemplateId, templateParams, emailJsPublicKey);
        setClientState({
          success: true,
          message: 'Your message has been sent successfully via EmailJS!',
          errors: {},
          isSubmitting: false,
        });
        (event.target as HTMLFormElement).reset(); // Reset form on success

        // Optionally, still save to Firebase via server action for backup or records
        // serverFormAction(formData); 
        // console.log("EmailJS success, also sending to server action for backup.");

      } catch (error) {
        console.error('EmailJS failed:', error);
        setClientState({
          success: false,
          message: 'Failed to send message via EmailJS. Please try again later.',
          errors: { general: ['EmailJS sending error.'] },
          isSubmitting: false,
        });
        // Optionally, attempt server fallback on EmailJS failure
        // serverFormAction(formData);
      }
    } else {
      // Fallback to server action if EmailJS is not configured
      serverFormAction(formData);
      setClientState(prev => ({ ...prev, isSubmitting: false })); // Reflect server action's pending state via useFormStatus
    }
  };
  
  const currentErrors = useEmailJS ? clientState.errors : serverState.errors;
  const isSubmitting = useEmailJS ? clientState.isSubmitting : false; // useFormStatus handles server pending

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          className="mt-1"
          aria-describedby={currentErrors?.name ? "name-error" : undefined}
        />
        {currentErrors?.name && <p id="name-error" className="text-sm text-destructive mt-1">{currentErrors.name.join(', ')}</p>}
      </div>
      <div>
        <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
        <Input
          type="email"
          id="email"
          name="email"
          required
          className="mt-1"
          aria-describedby={currentErrors?.email ? "email-error" : undefined}
        />
         {currentErrors?.email && <p id="email-error" className="text-sm text-destructive mt-1">{currentErrors.email.join(', ')}</p>}
      </div>
      <div>
        <Label htmlFor="message" className="text-sm font-medium">Message</Label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          required
          className="mt-1 min-h-[120px]"
          aria-describedby={currentErrors?.message ? "message-error" : undefined}
        />
        {currentErrors?.message && <p id="message-error" className="text-sm text-destructive mt-1">{currentErrors.message.join(', ')}</p>}
      </div>
      {currentErrors?.general && <p className="text-sm text-destructive mt-1">{currentErrors.general.join(', ')}</p>}
      <SubmitButton isSubmittingClient={isSubmitting} />
    </form>
  );
}
