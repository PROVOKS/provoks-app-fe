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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api-client";
import type { Path } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Nama path minimal 2 karakter"),
  description: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

type FormValues = z.infer<typeof schema>;

const EMPTY: FormValues = {
  name: "",
  description: "",
  status: "DRAFT",
};

export function PathFormDialog({
  open,
  onOpenChange,
  path,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  path?: Path | null;
}) {
  const queryClient = useQueryClient();
  const isEdit = Boolean(path);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (!open) return;
    form.reset(
      path
        ? {
            name: path.name,
            description: path.description ?? "",
            status: path.status,
          }
        : EMPTY,
    );
  }, [open, path, form]);

  const save = useMutation({
    mutationFn: async (values: FormValues) => {
      if (path) await api.put(`/paths/${path.id}`, values);
      else await api.post("/paths", values);
    },
    onSuccess: () => {
      toast.success(isEdit ? "Path diperbarui" : "Path dibuat");
      void queryClient.invalidateQueries({ queryKey: ["paths"] });
      onOpenChange(false);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg">
            {isEdit ? "Edit Path" : "Tambah Path"}
          </DialogTitle>
          <DialogDescription>
            Kelola learning path beserta level dan statusnya.
          </DialogDescription>
        </DialogHeader>

        <form
          id="path-form"
          onSubmit={form.handleSubmit((values) => save.mutate(values))}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="path-name">
              Nama Path <span className="text-destructive">*</span>
            </Label>
            <Input
              id="path-name"
              placeholder="Contoh: Frontend Development"
              {...form.register("name")}
            />
            {form.formState.errors.name ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="path-description">Deskripsi</Label>
            <Textarea
              id="path-description"
              rows={3}
              placeholder="Jelaskan tujuan dan cakupan path ini..."
              {...form.register("description")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Status</Label>
            <Select
              value={form.watch("status")}
              onValueChange={(value) =>
                form.setValue("status", value as FormValues["status"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button type="submit" form="path-form" disabled={save.isPending}>
            {save.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            {isEdit ? "Simpan Perubahan" : "Simpan Path"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
