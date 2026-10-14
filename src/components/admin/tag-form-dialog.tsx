"use client";

import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api-client";
import type { Tag } from "@/types";

const schema = z.object({
  name: z.string().min(1, "Nama tag wajib diisi"),
  slug: z.string().optional(),
  category: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const EMPTY: FormValues = { name: "", slug: "", category: "" };

export function TagFormDialog({
  open,
  onOpenChange,
  tag,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag?: Tag | null;
}) {
  const queryClient = useQueryClient();
  const isEdit = Boolean(tag);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (!open) return;
    form.reset(
      tag
        ? { name: tag.name, slug: tag.slug, category: tag.category ?? "" }
        : EMPTY,
    );
  }, [open, tag, form]);

  const save = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = {
        name: values.name,
        slug: values.slug?.trim() ? values.slug.trim() : undefined,
        category: values.category?.trim() ? values.category.trim() : undefined,
      };
      if (tag) await api.put(`/tags/${tag.id}`, payload);
      else await api.post("/tags", payload);
    },
    onSuccess: () => {
      toast.success(isEdit ? "Tag diperbarui" : "Tag dibuat");
      void queryClient.invalidateQueries({ queryKey: ["tags"] });
      onOpenChange(false);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg">
            {isEdit ? "Edit Tag" : "Tambah Tag"}
          </DialogTitle>
          <DialogDescription>
            Tag dipakai untuk menandai course (React, Next.js, Figma, dll).
          </DialogDescription>
        </DialogHeader>

        <form
          id="tag-form"
          onSubmit={form.handleSubmit((values) => save.mutate(values))}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="tag-name">
              Nama Tag <span className="text-destructive">*</span>
            </Label>
            <Input
              id="tag-name"
              placeholder="Contoh: React"
              {...form.register("name")}
            />
            {form.formState.errors.name ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="tag-slug">Slug</Label>
            <Input
              id="tag-slug"
              placeholder="otomatis dari nama"
              className="font-mono text-[13px]"
              {...form.register("slug")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="tag-category">Kategori</Label>
            <Input
              id="tag-category"
              placeholder="Contoh: Frontend"
              {...form.register("category")}
            />
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button type="submit" form="tag-form" disabled={save.isPending}>
            {save.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            {isEdit ? "Simpan Perubahan" : "Simpan Tag"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
