
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
import { useToast } from '@/hooks/use-toast';
import { saveProjectAction, deleteProjectAction, fetchProjectsForAdmin } from '@/app/actions';
import type { Project } from '@/lib/data';
import { PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import Image from 'next/image';

const initialFormActionState = { 
  success: false, 
  message: '', 
  errors: {},
  projects: undefined as Project[] | undefined,
  updatedProject: undefined as Project | undefined,
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

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { toast } = useToast();

  const [formState, formAction] = useActionState(saveProjectAction, initialFormActionState);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const fetchedProjects = await fetchProjectsForAdmin();
        setProjects(fetchedProjects || []);
      } catch (error) {
        toast({ title: "Error", description: "Could not load projects data.", variant: "destructive" });
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
        setEditingProject(null);
        if (formState.projects) {
          setProjects(formState.projects); 
        }
      }
    }
  }, [formState, toast]);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const result = await deleteProjectAction(id);
      toast({
        title: result.success ? 'Success!' : 'Error',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
      if (result.success && result.projects) {
        setProjects(result.projects);
      }
    }
  };
  
  const ProjectFormFields = useMemo(() => (
    <>
      {editingProject?.id && <input type="hidden" name="id" defaultValue={editingProject.id} />}
      <div>
        <Label htmlFor="title">Project Title</Label>
        <Input id="title" name="title" required defaultValue={editingProject?.title || ''} />
        {formState.errors?.title && <p className="text-sm text-destructive mt-1">{formState.errors.title.join(', ')}</p>}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required defaultValue={editingProject?.description || ''} />
        {formState.errors?.description && <p className="text-sm text-destructive mt-1">{formState.errors.description.join(', ')}</p>}
      </div>
      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input id="imageUrl" name="imageUrl" type="url" required defaultValue={editingProject?.imageUrl || ''} />
        {formState.errors?.imageUrl && <p className="text-sm text-destructive mt-1">{formState.errors.imageUrl.join(', ')}</p>}
      </div>
      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input id="tags" name="tags" defaultValue={editingProject?.tags.join(', ') || ''} />
        {formState.errors?.tags && <p className="text-sm text-destructive mt-1">{formState.errors.tags.join(', ')}</p>}
      </div>
      <div>
        <Label htmlFor="liveLink">Live Demo Link (Optional)</Label>
        <Input id="liveLink" name="liveLink" type="url" defaultValue={editingProject?.liveLink || ''} />
        {formState.errors?.liveLink && <p className="text-sm text-destructive mt-1">{formState.errors.liveLink.join(', ')}</p>}
      </div>
      <div>
        <Label htmlFor="repoLink">Repository Link (Optional)</Label>
        <Input id="repoLink" name="repoLink" type="url" defaultValue={editingProject?.repoLink || ''} />
        {formState.errors?.repoLink && <p className="text-sm text-destructive mt-1">{formState.errors.repoLink.join(', ')}</p>}
      </div>
      <div>
        <Label htmlFor="dataAiHint">AI Hint for Image (Optional, 1-2 words)</Label>
        <Input id="dataAiHint" name="dataAiHint" defaultValue={editingProject?.dataAiHint || ''} />
        {formState.errors?.dataAiHint && <p className="text-sm text-destructive mt-1">{formState.errors.dataAiHint.join(', ')}</p>}
      </div>
    </>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [editingProject, formState.errors]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" /> Loading projects...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Manage Projects</h1>
          <p className="text-muted-foreground">Add, edit, or delete projects.</p>
           <p className="text-sm text-muted-foreground mt-1">Note: Data is stored in Firebase Realtime Database.</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={(open) => { setIsFormOpen(open); if (!open) setEditingProject(null); }}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingProject(null); setIsFormOpen(true); }}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
            </DialogHeader>
            <form action={formAction} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
              {ProjectFormFields}
              <DialogFooter className="sticky bottom-0 bg-background py-4">
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <SubmitButton>{editingProject ? 'Save Changes' : 'Add Project'}</SubmitButton>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <Card className="shadow-lg">
        <CardHeader><CardTitle>Projects List</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <Image 
                      src={project.imageUrl || "https://placehold.co/64x48.png"} 
                      alt={project.title} 
                      width={64} 
                      height={48} 
                      className="object-cover rounded-md" 
                      data-ai-hint={project.dataAiHint || "project image"}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell className="text-xs">{project.tags.join(', ')}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)}>
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
