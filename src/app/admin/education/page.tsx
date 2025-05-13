
"use client";

import React, { useState, useEffect, useMemo, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { saveEducationItemAction, deleteEducationItemAction } from '@/app/actions';
import { educationData as initialEducationData } from '@/lib/data';
import type { EducationItem } from '@/lib/data';
import { PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const iconNames = Object.keys(LucideIcons).filter(key => /^[A-Z]/.test(key) && LucideIcons[key as keyof typeof LucideIcons] !== LucideIcons.createLucideIcon) as (keyof typeof LucideIcons)[];

const initialFormState = { success: false, message: '', errors: {} };

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </Button>
  );
}

export default function AdminEducationPage() {
  const [educationItems, setEducationItems] = useState<EducationItem[]>(initialEducationData);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EducationItem | null>(null);
  const { toast } = useToast();

  const [formState, formAction] = useActionState(saveEducationItemAction, initialFormState);

  useEffect(() => {
    if (formState.message) {
      toast({
        title: formState.success ? 'Success!' : 'Error',
        description: formState.message,
        variant: formState.success ? 'default' : 'destructive',
      });
      if (formState.success) {
        setIsFormOpen(false);
        setEditingItem(null);
        const updatedItem = formState.updatedItem;
        if (updatedItem) {
          setEducationItems(prevItems => {
            const index = prevItems.findIndex(item => item.id === updatedItem.id);
            if (index > -1) {
              const newItems = [...prevItems];
              newItems[index] = updatedItem;
              return newItems;
            }
            return [...prevItems, updatedItem];
          });
        }
      }
    }
  }, [formState, toast]);

  const handleEdit = (item: EducationItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this education item? This action is simulated.')) {
      const result = await deleteEducationItemAction(id);
      toast({
        title: result.success ? 'Success!' : 'Error',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
      if (result.success) {
        setEducationItems(prevItems => prevItems.filter(item => item.id !== id));
      }
    }
  };

  const EducationFormFields = useMemo(() => (
    <>
      {editingItem?.id && <input type="hidden" name="id" defaultValue={editingItem.id} />}
      <div>
        <Label htmlFor="degree">Degree</Label>
        <Input id="degree" name="degree" required defaultValue={editingItem?.degree || ''} />
        {formState.errors?.degree && <p className="text-sm text-destructive mt-1">{formState.errors.degree.join(', ')}</p>}
      </div>
      <div>
        <Label htmlFor="institution">Institution</Label>
        <Input id="institution" name="institution" required defaultValue={editingItem?.institution || ''} />
        {formState.errors?.institution && <p className="text-sm text-destructive mt-1">{formState.errors.institution.join(', ')}</p>}
      </div>
      <div>
        <Label htmlFor="period">Period (e.g., 2020 - 2024)</Label>
        <Input id="period" name="period" required defaultValue={editingItem?.period || ''} />
        {formState.errors?.period && <p className="text-sm text-destructive mt-1">{formState.errors.period.join(', ')}</p>}
      </div>
      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea id="description" name="description" defaultValue={editingItem?.description || ''} />
        {formState.errors?.description && <p className="text-sm text-destructive mt-1">{formState.errors.description.join(', ')}</p>}
      </div>
      <div>
        <Label htmlFor="iconName">Icon Name (Lucide Icon)</Label>
         <Select name="iconName" defaultValue={editingItem?.iconName || ''}>
            <SelectTrigger id="iconName">
                <SelectValue placeholder="Select an icon (optional)" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
                <SelectItem value="">None</SelectItem>
                {iconNames.map(name => {
                    const IconComponent = LucideIcons[name] as React.ElementType;
                    if (!IconComponent) return null;
                    return (
                        <SelectItem key={name} value={name}>
                            <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            {name}
                            </div>
                        </SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
        {formState.errors?.iconName && <p className="text-sm text-destructive mt-1">{formState.errors.iconName.join(', ')}</p>}
      </div>
    </>
  ), [editingItem, formState.errors]);

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Manage Education</h1>
          <p className="text-muted-foreground">Add, edit, or delete education entries.</p>
           <p className="text-sm text-destructive mt-1">Note: Data changes are simulated and do not persist.</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={(open) => { setIsFormOpen(open); if (!open) setEditingItem(null); }}>
          <DialogTrigger asChild>
            <Button onClick={() => {setEditingItem(null); setIsFormOpen(true);}}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Education Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Education Item' : 'Add New Education Item'}</DialogTitle>
            </DialogHeader>
            <form action={formAction} className="space-y-4 py-4">
              {EducationFormFields}
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <SubmitButton>{editingItem ? 'Save Changes' : 'Add Item'}</SubmitButton>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <Card className="shadow-lg">
        <CardHeader><CardTitle>Education List</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Degree</TableHead>
                <TableHead>Institution</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {educationItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.degree}</TableCell>
                  <TableCell>{item.institution}</TableCell>
                  <TableCell>{item.period}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

