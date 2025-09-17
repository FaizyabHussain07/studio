
'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createResource, updateResource } from "@/lib/services";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Resource } from "@/lib/types";
import { File as FileIcon, X, Upload } from "lucide-react";

const resourceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  coverImageUrl: z.string().url("Must be a valid URL for the cover image").optional().or(z.literal('')),
  pdfUrl: z.string().optional(),
  pdfFileName: z.string().optional(),
  pdfFile: z.any().optional(),
});

type ResourceFormProps = {
    resource: Resource | null;
    onFinished: () => void;
};

export function ResourceForm({ resource, onFinished }: ResourceFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof resourceSchema>>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title: resource?.title || "",
      description: resource?.description || "",
      coverImageUrl: resource?.coverImageUrl || "",
      pdfUrl: resource?.pdfUrl || "",
      pdfFileName: resource?.pdfFileName || "",
    },
  });
  
  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setPdfFile(file);
        form.setValue('pdfFile', file);
    }
  }
  
  const handleClearFile = () => {
    setPdfFile(null);
    form.setValue('pdfFile', null);
    form.setValue('pdfUrl', '');
    form.setValue('pdfFileName', '');
    const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
    if (fileInput) {
        fileInput.value = '';
    }
  }


  const onSubmit = async (data: z.infer<typeof resourceSchema>) => {
    setLoading(true);
    try {
      const payload: Partial<Resource> = {
        title: data.title,
        description: data.description,
        coverImageUrl: data.coverImageUrl,
        pages: resource?.pages || [],
        toc: resource?.toc || [],
      };

      if (pdfFile) {
        payload.pdfUrl = await fileToDataUrl(pdfFile);
        payload.pdfFileName = pdfFile.name;
      } else {
        payload.pdfUrl = resource?.pdfUrl || '';
        payload.pdfFileName = resource?.pdfFileName || '';
      }

      if (resource) {
        await updateResource(resource.id, payload);
        toast({ title: "Success", description: "Resource details updated successfully." });
      } else {
        await createResource(payload);
        toast({ title: "Success", description: "Resource created successfully." });
      }
      onFinished();
    } catch (error) {
      console.error("Failed to save resource:", error);
      toast({ title: "Error", description: "Could not save resource.", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4 max-h-[70vh] overflow-y-auto pr-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Book Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., The Holy Quran" {...field} />
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
                <Textarea placeholder="A short summary of the book..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
            control={form.control}
            name="coverImageUrl"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Cover Image URL</FormLabel>
                <FormControl>
                <Input type="url" placeholder="https://example.com/cover.jpg" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />

        <FormField
            control={form.control}
            name="pdfFile"
            render={() => (
                <FormItem>
                    <FormLabel>Full PDF (Optional)</FormLabel>
                    <FormControl>
                        <div className="relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                            <Upload className="h-8 w-8 text-muted-foreground mb-2"/>
                            <p className="text-muted-foreground text-sm">Drag & drop or</p>
                            <Button variant="link" className="p-0 h-auto" type="button">
                                <label htmlFor="pdf-upload" className="cursor-pointer">
                                    click to browse for a PDF
                                </label>
                            </Button>
                            <input id="pdf-upload" type="file" accept=".pdf" className="sr-only" onChange={handleFileChange} disabled={loading}/>
                        </div>
                    </FormControl>
                    <div className="text-sm text-muted-foreground">
                        {pdfFile ? (
                            <div className="mt-2 border rounded-lg p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <FileIcon className="h-5 w-5 flex-shrink-0 text-primary"/>
                                    <span className="text-sm truncate">{pdfFile.name}</span>
                                </div>
                                <Button variant="ghost" size="icon" onClick={handleClearFile} disabled={loading} type="button">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : resource?.pdfFileName && (
                            <div className="mt-2 border rounded-lg p-3 flex items-center justify-between gap-2 overflow-hidden">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <FileIcon className="h-5 w-5 flex-shrink-0 text-primary"/>
                                    <span className="text-sm truncate">Current: {resource.pdfFileName}</span>
                                </div>
                                <Button variant="ghost" size="icon" onClick={handleClearFile} disabled={loading} title="Remove current file" type="button">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
        
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Resource'}</Button>
      </form>
    </Form>
  );
}
