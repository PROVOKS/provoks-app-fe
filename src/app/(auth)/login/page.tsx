"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CheckCircle2, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, TOKEN_KEY, USER_KEY, type ApiEnvelope } from "@/lib/api-client";
import type { User } from "@/types";

const schema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Minimal 6 karakter"),
});

type FormValues = z.infer<typeof schema>;

type LoginResponse = { token: string; user: User };

export default function LoginPage() {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const login = useMutation({
    mutationFn: async (values: FormValues) => {
      const { data } = await api.post<ApiEnvelope<LoginResponse>>(
        "/auth/login",
        values,
      );
      return data.data;
    },
    onSuccess: (data) => {
      window.localStorage.setItem(TOKEN_KEY, data.token);
      window.localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      toast.success("Berhasil masuk");
      router.push(data.user.role === "STUDENT" ? "/my-learning" : "/dashboard");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="flex min-h-screen">
      {/* Panel brand */}
      <div className="hidden w-[640px] shrink-0 flex-col justify-between bg-brand-deep p-16 text-brand-deep-foreground lg:flex">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-primary font-heading text-[22px] font-bold text-primary-foreground">
            P
          </span>
          <span className="font-heading text-[22px] font-bold">Provoks</span>
        </div>

        <div className="flex max-w-[512px] flex-col gap-[18px]">
          <p className="text-[13px] font-semibold tracking-[3px] text-accent">
            PROVOKS LMS
          </p>
          <h1 className="font-heading text-[44px] leading-[52px] font-bold">
            Code, Create, Conquer
          </h1>
          <p className="text-base/6 opacity-85">
            Learning Management System yang dibuat untuk mendukung pembelajaran
            di setiap path Provoks - dari fundamental sampai siap kerja.
          </p>
          <ul className="flex flex-col gap-3 text-[15px]">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="size-4.5 text-accent" />
              Path terstruktur: Frontend, Backend, Full-Stack
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="size-4.5 text-accent" />
              Kelas interaktif berbasis proyek
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="size-4.5 text-accent" />
              Sertifikat resmi & mentor praktisi
            </li>
          </ul>
        </div>

        <p className="text-[13px] opacity-70">
          © 2026 Provoks LMS. All rights reserved.
        </p>
      </div>

      {/* Panel form */}
      <div className="flex flex-1 items-center justify-center bg-background p-8">
        <form
          onSubmit={form.handleSubmit((values) => login.mutate(values))}
          className="flex w-[400px] flex-col gap-5"
        >
          <div className="flex flex-col gap-1.5">
            <h2 className="font-heading text-[28px] font-bold">
              Selamat datang kembali
            </h2>
            <p className="text-sm text-muted-foreground">
              Masuk ke akun Provoks LMS kamu.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              autoComplete="email"
              {...form.register("email")}
            />
            {form.formState.errors.email ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                {...form.register("password")}
              />
              <Eye className="pointer-events-none absolute top-1/2 right-3.5 size-4.5 -translate-y-1/2 text-muted-foreground" />
            </div>
            {form.formState.errors.password ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.password.message}
              </p>
            ) : null}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" className="size-4 rounded border-border" />
              Ingat saya
            </label>
            <a href="/forgot-password" className="text-sm font-semibold text-primary">
              Lupa password?
            </a>
          </div>

          <Button type="submit" size="lg" disabled={login.isPending}>
            {login.isPending ? "Memproses..." : "Masuk"}
          </Button>
        </form>
      </div>
    </div>
  );
}
