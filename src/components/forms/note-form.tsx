
'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createNote, updateNote } from "@/lib/services";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { MultiSelect } from "@/components/ui/multi-select";
import { File, Link as LinkIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";


const noteSchema = z.object({
  name: z.string().min(1, "Note title is required"),
  description: z.string().optional(),
  assignedStudentIds: z.array(z.string()).min(1, "Please assign to at least one student"),
  externalUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  file: z.any().optional(),
}).refine(data => !!data.externalUrl || !!data.file, {
    message: "Either a file or an external URL is required.",
    path: ["file"],
});


export function NoteForm({ students, note, onFinished }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [file, setFile] = useState(null);
  const [contentType, setContentType] = useState<'url' | 'file'>(
    note?.fileDataUrl ? 'file' : 'url'
  );

  const studentOptions = students.map(student => ({
    value: student.id,
    label: student.name,
  }));
  
  const form = useForm({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      name: note?.name || "",
      description: note?.description || "",
      assignedStudentIds: note?.assignedStudentIds || [],
      externalUrl: note?.externalUrl || "",
      file: null,
    },
  });

  const fileToDataUrl = (fileToConvert) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(fileToConvert);
    });
  };
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        setFile(selectedFile);
        form.setValue('file', selectedFile);
        form.clearErrors('file');
    }
  }

  const onSubmit = async (data) => {
    setLoading(true);

    if (contentType === 'file' && !file && !note?.fileDataUrl) {
         form.setError("file", { type: "manual", message: "Please upload a file." });
         setLoading(false);
         return;
    }
     if (contentType === 'url' && !data.externalUrl) {
         form.setError("externalUrl", { type: "manual", message: "Please enter a URL." });
         setLoading(false);
         return;
    }

    try {
      let payload = {
        name: data.name,
        description: data.description,
        assignedStudentIds: data.assignedStudentIds,
        externalUrl: contentType === 'url' ? data.externalUrl : null,
        fileDataUrl: note?.fileDataUrl || null,
        fileName: note?.fileName || null,
      };

      if (contentType === 'file' && file) {
          payload.fileDataUrl = await fileToDataUrl(file);
          payload.fileName = file.name;
          payload.externalUrl = null;
      }
      
      if (note) {
        await updateNote(note.id, payload);
        toast({ title: "Success", description: "Note updated successfully." });
      } else {
        await createNote(payload);
        toast({ title: "Success", description: "Note created successfully." });
      }
      onFinished();
    } catch (error) {
      console.error("Failed to save note:", error);
      toast({ title: "Error", description: "Could not save note.", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Chapter 5 Key Concepts" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Provide some context for this note..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="assignedStudentIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assign to Students</FormLabel>
                <FormControl>
                   <MultiSelect
                        options={studentOptions}
                        selected={field.value}
                        onChange={field.onChange}
                        placeholder="Select students..."
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <FormLabel>Content Type</FormLabel>
            <div className="flex gap-2 mt-2">
                <Button 
                    type="button"
                    variant={contentType === 'url' ? 'default' : 'outline'}
                    onClick={() => setContentType('url')}
                >
                    <LinkIcon className="mr-2 h-4 w-4"/> URL
                </Button>
                 <Button 
                    type="button"
                    variant={contentType === 'file' ? 'default' : 'outline'}
                    onClick={() => setContentType('file')}
                >
                    <File className="mr-2 h-4 w-4"/> File
                </Button>
            </div>
          </div>
          
           <div className={cn(contentType === 'url' ? 'block' : 'hidden')}>
              <FormField
                control={form.control}
                name="externalUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>External URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/notes.pdf" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
           </div>

           <div className={cn(contentType === 'file' ? 'block' : 'hidden')}>
               <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload File</FormLabel>
                     <FormControl>
                        <div className="relative border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center">
                            <File className="h-10 w-10 text-muted-foreground mb-2"/>
                            <p className="text-muted-foreground">Drag & drop or</p>
                            <Button variant="link" className="p-0 h-auto" type="button">
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    click to browse for a file
                                </label>
                            </Button>
                            <input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} disabled={loading}/>
                        </div>
                    </FormControl>
                    <FormDescription>
                       {file ? (
                          <div className="mt-2 border rounded-lg p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2 overflow-hidden">
                               <File className="h-5 w-5 flex-shrink-0"/>
                               <span className="text-sm truncate">{file.name}</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => { setFile(null); form.setValue('file', null);}} disabled={loading}>
                                <X className="h-4 w-4" />
                            </Button>
                          </div>
                      ) : note?.fileName && (
                         <div className="mt-2 border rounded-lg p-3 flex items-center gap-2 overflow-hidden">
                            <File className="h-5 w-5 flex-shrink-0"/>
                            <span className="text-sm truncate">Current file: {note.fileName}</span>
                         </div>
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
           </div>
          <Button type="submit" disabled={loading}>{loading ? 'Saving Note...' : 'Save Note'}</Button>
        </form>
      </Form>
  );
}
