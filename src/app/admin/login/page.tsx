"use client";

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { loginAdminAction } from '@/app/actions';
import { Loader2, Home } from 'lucide-react';

const initialState = {
  success: false,
  message: '',
  errors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Login'}
    </Button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useActionState(loginAdminAction, initialState);
  const { toast } = useToast();
  // router kept for potential future use (redirect now handled server-side)
  const router = useRouter();

  useEffect(() => {
    // Only show error toasts — successful login redirects server-side via redirect()
    if (state.message && !state.success) {
      toast({
        title: 'Login Failed',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast]);

  // Silence unused variable lint warning for router (kept for future use)
  void router;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            ByteFolio Admin Login
          </CardTitle>
          <CardDescription>
            Enter your credentials to access the admin panel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1"
                placeholder="admin@example.com"
                aria-describedby={state.errors?.email ? 'email-error' : undefined}
              />
              {state.errors?.email && (
                <p id="email-error" className="mt-1 text-sm text-destructive">
                  {state.errors.email.join(', ')}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1"
                placeholder="••••••••"
                aria-describedby={state.errors?.password ? 'password-error' : undefined}
              />
              {state.errors?.password && (
                <p id="password-error" className="mt-1 text-sm text-destructive">
                  {state.errors.password.join(', ')}
                </p>
              )}
            </div>
            {state.errors?.general && (
              <p className="text-sm text-destructive">
                {state.errors.general.join(', ')}
              </p>
            )}
            <SubmitButton />
          </form>
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-primary hover:text-accent hover:underline"
            >
              <Home className="mr-1.5 h-4 w-4" />
              Back to Homepage
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
