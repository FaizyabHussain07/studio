
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

const resourceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  coverImage: z.any().optional(),
  pdfFile: z.any().optional(),
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
    },
  });

  const onSubmit = async (data: z.infer<typeof resourceSchema>) => {
    setLoading(true);
    try {
      const payload: any = {
        title: data.title,
        description: data.description,
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
        // When updating, we preserve the existing pages.
        payload.pages = resource.pages || [];
        await updateResource(resource.id, payload);
        toast({ title: "Success", description: "Resource details updated successfully." });
      } else {
        // When creating, pages array is initialized as empty.
        payload.pages = [];
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
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Resource'}</Button>
      </form>
    </Form>
  );
}
