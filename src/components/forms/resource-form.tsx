
'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { createResource, updateResource, getResource } from "@/lib/services";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const resourceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  coverImage: z.any().optional(),
  pdfFile: z.any().optional(),
  pages: z.string().optional(),
});

type ResourceFormProps = {
    resource: { id: string, [key: string]: any } | null;
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
  const [existingData, setExistingData] = useState<any>(null);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof resourceSchema>>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title: "",
      description: "",
      coverImage: undefined,
      pdfFile: undefined,
      pages: ""
    },
  });
  
  useEffect(() => {
    if (resource) {
      setLoading(true);
      getResource(resource.id).then(data => {
        if(data) {
           form.reset({
              title: data.title,
              description: data.description,
              pages: JSON.stringify(data.pages || [], null, 2)
           });
           setExistingData(data);
        }
      }).finally(() => setLoading(false));
    }
  }, [resource, form]);
  
  const onSubmit = async (data: z.infer<typeof resourceSchema>) => {
    setLoading(true);
    try {
      const payload: any = {
        title: data.title,
        description: data.description,
      };

      if (data.coverImage instanceof File) {
        payload.coverImageUrl = await fileToDataUrl(data.coverImage);
      }
      
      if (data.pdfFile instanceof File) {
        payload.pdfDataUrl = await fileToDataUrl(data.pdfFile);
        payload.pdfFileName = data.pdfFile.name;
      }

      try {
        if(data.pages) {
            payload.pages = JSON.parse(data.pages);
        } else {
            payload.pages = existingData?.pages || [];
        }
      } catch (e) {
          toast({ title: "Invalid JSON", description: "The 'pages' field contains invalid JSON.", variant: "destructive"});
          setLoading(false);
          return;
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto pr-2">
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
                   {existingData?.coverImageUrl && !value && (
                        <div className="text-xs text-muted-foreground">Current: Cover image exists. Upload a new file to replace it.</div>
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
                  <FormLabel>PDF File</FormLabel>
                  {existingData?.pdfFileName && !value && (
                        <div className="text-xs text-muted-foreground">Current: {existingData.pdfFileName}. Upload to replace.</div>
                  )}
                  <FormControl>
                    <Input type="file" accept=".pdf" onChange={(e) => onChange(e.target.files?.[0])} {...rest}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="pages"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Book Pages (JSON)</FormLabel>
                <FormDescription>
                    This is a placeholder. A better UI will be built next. Paste a JSON array of objects, e.g., `[{ "pageNumber": 1, "imageUrl": "data:..." }]`
                </FormDescription>
                <FormControl>
                    <Textarea {...field} rows={10} placeholder="Enter JSON for pages here..."/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Resource'}</Button>
        </form>
      </Form>
  );
}
