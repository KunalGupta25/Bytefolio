
"use client";

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { loginAdminAction } from '@/app/actions'; // Will be created
import { Loader2 } from 'lucide-react';

const ADMIN_AUTH_TOKEN_KEY = 'adminAuthToken';

const initialState = {
  success: false,
  message: '',
  errors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Login"}
    </Button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(loginAdminAction, initialState);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success!' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
    }
    if (state.success) {
      localStorage.setItem(ADMIN_AUTH_TOKEN_KEY, 'true'); // Simplified token
      router.push('/admin');
    }
  }, [state, router, toast]);

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem(ADMIN_AUTH_TOKEN_KEY) === 'true') {
      router.replace('/admin');
    }
  }, [router]);


  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">ByteFolio Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the admin panel.</CardDescription>
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
                defaultValue="admin@example.com"
                aria-describedby={state.errors?.email ? "email-error" : undefined}
              />
              {state.errors?.email && <p id="email-error" className="mt-1 text-sm text-destructive">{state.errors.email.join(', ')}</p>}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1"
                defaultValue="k4912005"
                aria-describedby={state.errors?.password ? "password-error" : undefined}
              />
              {state.errors?.password && <p id="password-error" className="mt-1 text-sm text-destructive">{state.errors.password.join(', ')}</p>}
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
