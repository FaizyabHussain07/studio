
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
  coverImageUrl: z.string().url("Must be a valid URL for the cover image").optional().or(z.literal('')),
  pdfUrl: z.string().url("Must be a valid URL for the PDF").optional().or(z.literal('')),
  pdfFileName: z.string().optional(),
});

type ResourceFormProps = {
    resource: Resource | null;
    onFinished: () => void;
};

export function ResourceForm({ resource, onFinished }: ResourceFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

  const onSubmit = async (data: z.infer<typeof resourceSchema>) => {
    setLoading(true);
    try {
      const payload: any = {
        title: data.title,
        description: data.description,
        coverImageUrl: data.coverImageUrl,
        pdfUrl: data.pdfUrl,
      };

      // Extract filename from URL if not provided
      if (data.pdfUrl && !data.pdfFileName) {
        try {
            const url = new URL(data.pdfUrl);
            const pathname = url.pathname;
            payload.pdfFileName = pathname.substring(pathname.lastIndexOf('/') + 1) || `${data.title.replace(/\s+/g, '-')}.pdf`;
        } catch (_) {
            payload.pdfFileName = `${data.title.replace(/\s+/g, '-')}.pdf`;
        }
      } else {
        payload.pdfFileName = data.pdfFileName;
      }


      if (resource) {
        payload.pages = resource.pages || [];
        payload.toc = resource.toc || [];
        await updateResource(resource.id, payload);
        toast({ title: "Success", description: "Resource details updated successfully." });
      } else {
        payload.pages = [];
        payload.toc = [];
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
        <div className="grid grid-cols-1 gap-4">
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
                name="pdfUrl"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Full PDF URL (Optional)</FormLabel>
                    <FormControl>
                    <Input type="url" placeholder="https://example.com/book.pdf" {...field} />
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
