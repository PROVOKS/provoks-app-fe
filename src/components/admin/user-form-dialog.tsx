"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
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
import { useCreateUser, useUpdateUser } from "@/hooks/use-users";
import type { ManagedUser, Path, Role } from "@/types";

const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Admin",
  INSTRUCTOR: "Instruktur",
  STUDENT: "Siswa",
};

const schema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  role: z.enum(["ADMIN", "INSTRUCTOR", "STUDENT"]),
  nim: z.string().optional(),
  prodi: z.string().optional(),
  password: z.string().optional(),
  pathId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const EMPTY: FormValues = {
  name: "",
  email: "",
  role: "STUDENT",
  nim: "",
  prodi: "",
  password: "",
  pathId: "",
};

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  paths = [],
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** null = tambah user baru */
  user: ManagedUser | null;
  paths?: Path[];
}) {
  const isEdit = Boolean(user);
  const create = useCreateUser();
  const update = useUpdateUser();
  const isPending = create.isPending || update.isPending;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (!open) return;
    form.reset(
      user
        ? {
            name: user.name,
            email: user.email,
            role: user.role,
            nim: user.nim ?? "",
            prodi: user.prodi ?? "",
            password: "",
            pathId: "",
          }
        : EMPTY,
    );
  }, [open, user, form]);

  const role = form.watch("role");
  const nim = form.watch("nim");

  function onSubmit(values: FormValues) {
    const nimValue = (values.nim ?? "").trim();
    const password = (values.password ?? "").trim();

    if (password && password.length < 6) {
      form.setError("password", { message: "Password minimal 6 karakter" });
      return;
    }

    // siswa boleh tanpa password → otomatis pakai NIM
    const passwordOptional = values.role === "STUDENT" && nimValue.length > 0;
    if (!isEdit && !password && !passwordOptional) {
      form.setError("password", { message: "Password wajib diisi" });
      return;
    }
    if (!isEdit && !passwordOptional && password.length < 6) {
      form.setError("password", { message: "Password minimal 6 karakter" });
      return;
    }

    const shared = {
      name: values.name,
      email: values.email,
      role: values.role,
      nim: nimValue,
      prodi: values.prodi ?? "",
      ...(password ? { password } : {}),
    };

    if (isEdit && user) {
      update.mutate(
        { id: user.id, ...shared },
        { onSuccess: () => onOpenChange(false) },
      );
      return;
    }

    create.mutate(
      {
        ...shared,
        ...(values.role === "STUDENT" && values.pathId
          ? { pathId: values.pathId }
          : {}),
      },
      { onSuccess: () => onOpenChange(false) },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="grid-rows-[auto_minmax(0,1fr)_auto] sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg">
            {isEdit ? "Edit User" : "Tambah User"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Perbarui data akun. Kosongkan password kalau tidak ingin mengubahnya."
              : "Buat akun baru. Password bisa dikosongkan untuk siswa — otomatis memakai NIM."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="user-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 overflow-y-auto pr-1"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="user-name">
              Nama <span className="text-destructive">*</span>
            </Label>
            <Input id="user-name" {...form.register("name")} />
            {form.formState.errors.name ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="user-email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input id="user-email" type="email" {...form.register("email")} />
            {form.formState.errors.email ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Role</Label>
            <Select
              value={role}
              onValueChange={(value) => form.setValue("role", value as Role)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(["ADMIN", "INSTRUCTOR", "STUDENT"] as Role[]).map((item) => (
                  <SelectItem key={item} value={item}>
                    {ROLE_LABEL[item]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {role === "STUDENT" ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="user-nim">NIM</Label>
                <Input id="user-nim" {...form.register("nim")} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="user-prodi">Prodi</Label>
                <Input id="user-prodi" {...form.register("prodi")} />
              </div>
            </div>
          ) : null}

          {!isEdit && role === "STUDENT" && paths.length > 0 ? (
            <div className="flex flex-col gap-2">
              <Label>Path (opsional)</Label>
              <Select
                value={form.watch("pathId") || "NONE"}
                onValueChange={(value) =>
                  form.setValue("pathId", value === "NONE" ? "" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Belum ada path" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">Belum ada path</SelectItem>
                  {paths.map((path) => (
                    <SelectItem key={path.id} value={path.id}>
                      {path.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Kalau dipilih, siswa langsung terdaftar di path tersebut.
              </p>
            </div>
          ) : null}

          <div className="flex flex-col gap-2">
            <Label htmlFor="user-password">
              {isEdit ? "Password Baru" : "Password"}
              {!isEdit ? null : (
                <span className="text-muted-foreground"> (opsional)</span>
              )}
            </Label>
            <Input
              id="user-password"
              type="password"
              placeholder={
                isEdit
                  ? "Kosongkan kalau tidak diubah"
                  : role === "STUDENT" && nim
                    ? "Kosongkan untuk memakai NIM"
                    : "Minimal 6 karakter"
              }
              {...form.register("password")}
            />
            {form.formState.errors.password ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.password.message}
              </p>
            ) : null}
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button type="submit" form="user-form" disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            {isEdit ? "Simpan Perubahan" : "Tambah User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
