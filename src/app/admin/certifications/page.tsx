
"use client";

import React, { useState, useEffect, useMemo, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectSeparator } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { saveCertificationAction, deleteCertificationAction, fetchCertificationsForAdmin } from '@/app/actions';
import type { Certification } from '@/lib/data';
import { PlusCircle, Edit, Trash2, Loader2, HelpCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

// Manually curated list of common Lucide icons
const commonLucideIconNames: string[] = [
  'Award', 'BadgeCheck', 'BookMarked', 'Briefcase', 'CalendarCheck', 'Certificate',
  'CheckCircle', 'ClipboardCheck', 'FileText', 'GraduationCap', 'Key', 'LifeBuoy',
  'Lightbulb', 'Link', 'Medal', 'Paperclip', 'ShieldCheck', 'Sparkles', 'Star', 'Trophy',
  'UserCheck', 'Verified', 'Wrench'
].sort();


const NULL_ICON_VALUE = "--no-icon--";
const initialFormActionState = { 
  success: false, 
  message: '', 
  errors: {},
  certifications: undefined as Certification[] | undefined,
  updatedCertification: undefined as Certification | undefined,
};

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </Button>
  );
}

export default function AdminCertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const { toast } = useToast();

  const [formState, formAction] = useActionState(saveCertificationAction, initialFormActionState);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const fetchedCerts = await fetchCertificationsForAdmin();
        setCertifications(fetchedCerts || []);
      } catch (error) {
        toast({ title: "Error", description: "Could not load certifications data.", variant: "destructive" });
      }
      setIsLoading(false);
    }
    loadData();
  }, [toast]);


  useEffect(() => {
    if (formState.message) {
      toast({
        title: formState.success ? 'Success!' : 'Error',
        description: formState.message,
        variant: formState.success ? 'default' : 'destructive',
      });
      if (formState.success) {
        setIsFormOpen(false);
        setEditingCertification(null);
        if (formState.certifications) {
          setCertifications(formState.certifications); 
        }
      }
    }
  }, [formState, toast]);

  const handleEdit = (certification: Certification) => {
    setEditingCertification(certification);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) {
      toast({ title: "Error", description: "Certification ID is missing.", variant: "destructive" });
      return;
    }
    if (confirm('Are you sure you want to delete this certification?')) {
      const result = await deleteCertificationAction(id);
      toast({
        title: result.success ? 'Success!' : 'Error',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
      if (result.success && result.certifications) {
        setCertifications(result.certifications);
      }
    }
  };

  const CertificationFormFields = useMemo(() => (
    <>
      {editingCertification?.id && <input type="hidden" name="id" defaultValue={editingCertification.id} />}
      <div>
        <Label htmlFor="name">Certification Name</Label>
        <Input id="name" name="name" required defaultValue={editingCertification?.name || ''} />
        {formState.errors?.name && <p className="text-sm text-destructive mt-1">{formState.errors.name.join(', ')}</p>}
      </div>
      <div>
        <Label htmlFor="organization">Issuing Organization</Label>
        <Input id="organization" name="organization" required defaultValue={editingCertification?.organization || ''} />
        {formState.errors?.organization && <p className="text-sm text-destructive mt-1">{formState.errors.organization.join(', ')}</p>}
      </div>
      <div>
        <Label htmlFor="date">Date Issued</Label>
        <Input id="date" name="date" required defaultValue={editingCertification?.date || ''} placeholder="e.g., June 2023" />
        {formState.errors?.date && <p className="text-sm text-destructive mt-1">{formState.errors.date.join(', ')}</p>}
      </div>
      <div>
        <Label htmlFor="verifyLink">Verification Link (Optional)</Label>
        <Input id="verifyLink" name="verifyLink" type="url" defaultValue={editingCertification?.verifyLink || ''} />
        {formState.errors?.verifyLink && <p className="text-sm text-destructive mt-1">{formState.errors.verifyLink.join(', ')}</p>}
      </div>
      <div>
        <Label htmlFor="iconName">Icon Name (Lucide Icon)</Label>
         <Select name="iconName" defaultValue={editingCertification?.iconName || NULL_ICON_VALUE}>
            <SelectTrigger id="iconName">
                <SelectValue placeholder="Select an icon (optional)" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
                <SelectItem value={NULL_ICON_VALUE}>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    None (Clear Icon)
                  </div>
                </SelectItem>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>Common Icons</SelectLabel>
                  {commonLucideIconNames.map(name => {
                      const IconComponent = (LucideIcons as Record<string, React.ElementType | undefined>)[name];
                      return (
                          <SelectItem key={`common-${name}`} value={name}>
                              <div className="flex items-center gap-2">
                              {IconComponent ? <IconComponent className="h-4 w-4" /> : <span className="h-4 w-4 inline-block border border-dashed border-muted-foreground" title="Icon not found" />}
                              {name}
                              </div>
                          </SelectItem>
                      );
                  })}
                </SelectGroup>
            </SelectContent>
        </Select>
        {formState.errors?.iconName && <p className="text-sm text-destructive mt-1">{formState.errors.iconName.join(', ')}</p>}
      </div>
    </>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [editingCertification, formState.errors]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" /> Loading certifications...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Manage Certifications</h1>
          <p className="text-muted-foreground">Add, edit, or delete certifications.</p>
           <p className="text-sm text-muted-foreground mt-1">Note: Data is stored in Firebase Realtime Database.</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={(open) => { setIsFormOpen(open); if (!open) setEditingCertification(null); }}>
          <DialogTrigger asChild>
            <Button onClick={() => {setEditingCertification(null); setIsFormOpen(true); }}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Certification
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingCertification ? 'Edit Certification' : 'Add New Certification'}</DialogTitle>
            </DialogHeader>
            <form action={formAction} className="space-y-4 py-4">
              {CertificationFormFields}
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <SubmitButton>{editingCertification ? 'Save Changes' : 'Add Certification'}</SubmitButton>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <Card className="shadow-lg">
        <CardHeader><CardTitle>Certifications List</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Icon</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certifications.map((cert) => {
                const IconComponent = cert.iconName && cert.iconName !== NULL_ICON_VALUE && (LucideIcons as Record<string, React.ElementType | undefined>)[cert.iconName]
                  ? (LucideIcons as Record<string, React.ElementType>)[cert.iconName]
                  : null;
                return (
                  <TableRow key={cert.id}>
                    <TableCell>
                      {IconComponent ? <IconComponent className="h-5 w-5" /> : 'None'}
                    </TableCell>
                    <TableCell className="font-medium">{cert.name}</TableCell>
                    <TableCell>{cert.organization}</TableCell>
                    <TableCell>{cert.date}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(cert)}>
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(cert.id)}>
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
