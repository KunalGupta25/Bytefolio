
"use client";

import React, { useState, useEffect, useMemo, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator, SelectLabel, SelectGroup } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { saveSkillAction, deleteSkillAction, fetchSkillsForAdmin } from '@/app/actions';
import type { Skill } from '@/lib/data';
import { PlusCircle, Edit, Trash2, Loader2, HelpCircle } from 'lucide-react'; // Added HelpCircle for placeholder
import * as LucideIcons from 'lucide-react';

// Manually curated list of common Lucide icons
const commonLucideIconNames: string[] = [
  'Code', 'Database', 'Cloud', 'Server', 'Terminal', 'GitMerge', 
  'Brain', 'Palette', 'Smartphone', 'Laptop', 'Cog', 'FileCode', 'Network',
  'ShieldCheck', 'Gauge', 'Users', 'Blocks', 'Wrench', 'Route', 'Component', 
  'Activity', 'Settings2', 'BrainCog', 'Cpu', 'Zap', 'Layers', 'Package', 'Filter', 'Rocket'
].sort();


const NULL_ICON_VALUE = "--no-icon--";
const initialFormActionState = {
  success: false,
  message: '',
  errors: {},
  skills: undefined as Skill[] | undefined,
  updatedSkill: undefined as Skill | undefined
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

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const { toast } = useToast();

  const [formState, formAction] = useActionState(saveSkillAction, initialFormActionState);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const fetchedSkills = await fetchSkillsForAdmin();
        setSkills(fetchedSkills || []);
      } catch (error) {
         toast({ title: "Error", description: "Could not load skills data.", variant: "destructive" });
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
        setEditingSkill(null);
        if (formState.skills) {
          setSkills(formState.skills);
        }
      }
    }
  }, [formState, toast]);

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) {
        toast({ title: "Error", description: "Skill ID is missing.", variant: "destructive" });
        return;
    }
    if (confirm('Are you sure you want to delete this skill?')) {
      const result = await deleteSkillAction(id);
      toast({
        title: result.success ? 'Success!' : 'Error',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
      if (result.success && result.skills) {
        setSkills(result.skills);
      }
    }
  };

  const categories: Skill['category'][] = ['Language', 'Framework/Library', 'Tool', 'Database', 'Cloud', 'Other'];

  const SkillFormFields = useMemo(() => (
    <>
      {editingSkill?.id && <input type="hidden" name="id" defaultValue={editingSkill.id} />}
      <div>
        <Label htmlFor="name">Skill Name</Label>
        <Input id="name" name="name" required defaultValue={editingSkill?.name || ''} />
        {formState.errors?.name && <p className="text-sm text-destructive mt-1">{formState.errors.name.join(', ')}</p>}
      </div>
      <div>
        <Label htmlFor="level">Proficiency Level (0-100, Optional)</Label>
        <Input id="level" name="level" type="number" min="0" max="100" defaultValue={editingSkill?.level ?? ''} />
        {formState.errors?.level && <p className="text-sm text-destructive mt-1">{formState.errors.level.join(', ')}</p>}
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select name="category" defaultValue={editingSkill?.category || categories[0]}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
          </SelectContent>
        </Select>
        {formState.errors?.category && <p className="text-sm text-destructive mt-1">{formState.errors.category.join(', ')}</p>}
      </div>
      <div>
        <Label htmlFor="iconName">Icon Name (Lucide Icon)</Label>
        <Select name="iconName" defaultValue={editingSkill?.iconName || NULL_ICON_VALUE}>
            <SelectTrigger id="iconName">
                <SelectValue placeholder="Select an icon (optional)" />
            </SelectTrigger>
            <SelectContent className="max-h-60"> {/* Ensure this allows enough height */}
                <SelectItem value={NULL_ICON_VALUE}>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" /> {/* Example: Use a generic icon for "None" */}
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
  ), [editingSkill, formState.errors, categories]); // Added categories to dependency array

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" /> Loading skills...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Manage Skills</h1>
          <p className="text-muted-foreground">Add, edit, or delete skills showcased in your portfolio.</p>
           <p className="text-sm text-muted-foreground mt-1">Note: Data is stored in Firebase Realtime Database.</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={(open) => { setIsFormOpen(open); if (!open) {setEditingSkill(null); } }}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingSkill(null); setIsFormOpen(true); }}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Skill
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingSkill ? 'Edit Skill' : 'Add New Skill'}</DialogTitle>
              <DialogDescription>
                {editingSkill ? 'Modify the details of this skill.' : 'Enter the details for the new skill.'}
              </DialogDescription>
            </DialogHeader>
            <form action={formAction} className="space-y-4 py-4">
              {SkillFormFields}
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <SubmitButton>{editingSkill ? 'Save Changes' : 'Add Skill'}</SubmitButton>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Skills List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skills.map((skill) => {
                const IconComponent = skill.iconName && skill.iconName !== NULL_ICON_VALUE && (LucideIcons as Record<string, React.ElementType | undefined>)[skill.iconName]
                  ? (LucideIcons as Record<string, React.ElementType>)[skill.iconName]
                  : null;
                return (
                <TableRow key={skill.id || skill.name}>
                  <TableCell className="font-medium">{skill.name}</TableCell>
                  <TableCell>{skill.category}</TableCell>
                  <TableCell>{skill.level !== undefined && skill.level !== null ? `${skill.level}%` : 'N/A'}</TableCell>
                  <TableCell>
                    {IconComponent ? <IconComponent className="h-5 w-5" /> : 'None'}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(skill)}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(skill.id)}>
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
