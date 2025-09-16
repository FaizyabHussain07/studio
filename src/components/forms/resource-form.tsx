

'use client';

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { createResource, updateResource } from "@/lib/services";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Resource, ResourcePage } from "@/lib/types";
import { FileUp, X, GripVertical, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { Card } from "../ui/card";

const resourceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  coverImage: z.any().optional(),
  pdfFile: z.any().optional(),
  pages: z.array(z.object({
    pageNumber: z.number(),
    imageUrl: z.string().min(1),
  })).optional(),
});

type ResourceFormProps = {
    resource: Resource | null;
    onFinished: () => void;
};

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
};

export function ResourceForm({ resource, onFinished }: ResourceFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof resourceSchema>>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title: resource?.title || "",
      description: resource?.description || "",
      pages: resource?.pages || [],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "pages",
  });
  
  useEffect(() => {
    if (resource) {
       form.reset({
          title: resource.title,
          description: resource.description,
          pages: resource.pages.sort((a,b) => a.pageNumber - b.pageNumber),
       });
    }
  }, [resource, form]);
  
  const handlePageFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        setLoading(true);
        const files = Array.from(e.target.files);
        try {
            for (const file of files) {
                const imageUrl = await fileToDataUrl(file);
                append({ pageNumber: fields.length + 1, imageUrl });
            }
        } catch (error) {
            toast({ title: "Error reading files", description: "Could not process all selected page images.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }
  };

  const onSubmit = async (data: z.infer<typeof resourceSchema>) => {
    setLoading(true);
    try {
      const payload: any = {
        title: data.title,
        description: data.description,
        pages: data.pages?.map((p, i) => ({...p, pageNumber: i + 1 })) || []
      };

      if (data.coverImage instanceof File) {
        payload.coverImageUrl = await fileToDataUrl(data.coverImage);
      } else if (resource?.coverImageUrl) {
        payload.coverImageUrl = resource.coverImageUrl;
      }
      
      if (data.pdfFile instanceof File) {
        payload.pdfDataUrl = await fileToDataUrl(data.pdfFile);
        payload.pdfFileName = data.pdfFile.name;
      } else if (resource?.pdfDataUrl) {
        payload.pdfDataUrl = resource.pdfDataUrl;
        payload.pdfFileName = resource.pdfFileName;
      }

      if (resource) {
        await updateResource(resource.id, payload);
        toast({ title: "Success", description: "Resource updated successfully." });
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="coverImage"
            render={({ field: { onChange, value, ...rest } }) => (
              <FormItem>
                <FormLabel>Cover Image</FormLabel>
                 {resource?.coverImageUrl && !value && (
                      <div className="text-xs text-muted-foreground">Current cover exists. Upload a new file to replace it.</div>
                  )}
                <FormControl>
                  <Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files?.[0])} {...rest} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pdfFile"
            render={({ field: { onChange, value, ...rest } }) => (
              <FormItem>
                <FormLabel>Full PDF (Optional)</FormLabel>
                {resource?.pdfFileName && !value && (
                      <div className="text-xs text-muted-foreground">Current: {resource.pdfFileName}. Upload to replace.</div>
                )}
                <FormControl>
                  <Input type="file" accept=".pdf" onChange={(e) => onChange(e.target.files?.[0])} {...rest}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div>
            <FormLabel>Book Pages</FormLabel>
            <FormDescription>Upload one or more images for the book's pages.</FormDescription>
            <Card className="mt-2 p-4 space-y-4">
                <div className="relative border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center">
                    <FileUp className="h-10 w-10 text-muted-foreground mb-2"/>
                    <p className="text-muted-foreground">Drag &amp; drop page images here, or</p>
                    <Button variant="link" className="p-0 h-auto" type="button">
                        <label htmlFor="pages-upload" className="cursor-pointer">
                           click to browse
                        </label>
                    </Button>
                    <input id="pages-upload" type="file" className="sr-only" onChange={handlePageFilesChange} disabled={loading} multiple accept="image/*"/>
                </div>

                {fields.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="font-medium">Uploaded Pages ({fields.length})</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {fields.map((field, index) => (
                                <Card key={field.id} className="relative group p-2">
                                    <div className="relative aspect-[8/11] w-full overflow-hidden rounded-md bg-secondary">
                                        <Image src={field.imageUrl} alt={`Page ${index+1}`} fill className="object-contain" />
                                    </div>
                                    <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button type="button" size="icon" variant="destructive" className="h-7 w-7" onClick={() => remove(index)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="absolute bottom-1 left-1 bg-background/80 px-1.5 py-0.5 rounded-full text-xs font-bold">
                                        {index + 1}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </Card>
        </div>

        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Resource'}</Button>
      </form>
    </Form>
  );
}
