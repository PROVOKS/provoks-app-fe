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
import { useUpdateUser } from "@/hooks/use-users";
import type { ManagedUser, Role } from "@/types";

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
});

type FormValues = z.infer<typeof schema>;

const EMPTY: FormValues = {
  name: "",
  email: "",
  role: "STUDENT",
  nim: "",
  prodi: "",
  password: "",
};

export function UserFormDialog({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: ManagedUser | null;
}) {
  const update = useUpdateUser();

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
          }
        : EMPTY,
    );
  }, [open, user, form]);

  const role = form.watch("role");

  function onSubmit(values: FormValues) {
    if (!user) return;
    if (values.password && values.password.length < 6) {
      form.setError("password", {
        message: "Password minimal 6 karakter (atau kosongkan)",
      });
      return;
    }

    update.mutate(
      {
        id: user.id,
        name: values.name,
        email: values.email,
        role: values.role,
        nim: values.nim ?? "",
        prodi: values.prodi ?? "",
        ...(values.password ? { password: values.password } : {}),
      },
      { onSuccess: () => onOpenChange(false) },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="grid-rows-[auto_minmax(0,1fr)_auto] sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg">Edit User</DialogTitle>
          <DialogDescription>
            Perbarui data akun. Kosongkan password kalau tidak ingin mengubahnya.
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
            <div className="grid grid-cols-2 gap-4">
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

          <div className="flex flex-col gap-2">
            <Label htmlFor="user-password">Password Baru</Label>
            <Input
              id="user-password"
              type="password"
              placeholder="Kosongkan kalau tidak diubah"
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
          <Button type="submit" form="user-form" disabled={update.isPending}>
            {update.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
