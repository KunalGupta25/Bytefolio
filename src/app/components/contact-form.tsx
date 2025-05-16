
// "use client";

// import { useActionState, useEffect } from 'react';
// import { useFormStatus } from 'react-dom';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import { submitContactForm } from '@/app/actions';
// import { useToast } from '@/hooks/use-toast';
// import { Loader2 } from 'lucide-react';

// const initialState = {
//   success: false,
//   message: '',
//   errors: {}, // Added to match the state structure in actions.ts
// };

// function SubmitButton() {
//   const { pending } = useFormStatus();
//   return (
//     <Button type="submit" disabled={pending} className="w-full sm:w-auto" size="lg">
//       {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
//       Send Message
//     </Button>
//   );
// }

// export function ContactForm() {
//   const [state, formAction] = useActionState(submitContactForm, initialState);
//   const { toast } = useToast();

//   useEffect(() => {
//     if (state.message) {
//       toast({
//         title: state.success ? 'Success!' : 'Error',
//         description: state.message,
//         variant: state.success ? 'default' : 'destructive',
//       });
//     }
//   }, [state, toast]);

//   return (
//     <form action={formAction} className="space-y-6">
//       <div>
//         <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
//         <Input
//           type="text"
//           id="name"
//           name="name"
//           required
//           className="mt-1"
//           aria-describedby={state.errors?.name ? "name-error" : undefined}
//         />
//         {state.errors?.name && <p id="name-error" className="text-sm text-destructive mt-1">{state.errors.name.join(', ')}</p>}
//       </div>
//       <div>
//         <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
//         <Input
//           type="email"
//           id="email"
//           name="email"
//           required
//           className="mt-1"
//           aria-describedby={state.errors?.email ? "email-error" : undefined}
//         />
//          {state.errors?.email && <p id="email-error" className="text-sm text-destructive mt-1">{state.errors.email.join(', ')}</p>}
//       </div>
//       <div>
//         <Label htmlFor="message" className="text-sm font-medium">Message</Label>
//         <Textarea
//           id="message"
//           name="message"
//           rows={5}
//           required
//           className="mt-1 min-h-[120px]"
//           aria-describedby={state.errors?.message ? "message-error" : undefined}
//         />
//         {state.errors?.message && <p id="message-error" className="text-sm text-destructive mt-1">{state.errors.message.join(', ')}</p>}
//       </div>
//       <SubmitButton />
//     </form>
//   );
// }
