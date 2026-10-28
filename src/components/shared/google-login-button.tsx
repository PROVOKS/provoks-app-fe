"use client";

import { useEffect, useRef, useState } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { toast } from "sonner";

/**
 * Tombol "Masuk dengan Google" (Google Identity Services).
 *
 * Tombol ini dirender Google di dalam container sendiri dan lebarnya harus
 * angka piksel (200–400), jadi lebarnya diukur dari container supaya sama
 * dengan tombol form lain dan tidak memaksa form melebar di layar kecil.
 *
 * Tidak dirender kalau NEXT_PUBLIC_GOOGLE_CLIENT_ID belum diisi.
 */
export function GoogleLoginButton({
  onCredential,
}: {
  onCredential: (credential: string) => void;
}) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    if (!clientId) return;
    const element = containerRef.current;
    if (!element) return;

    const update = () => {
      const next = Math.floor(element.getBoundingClientRect().width);
      if (next > 0) {
        // kuantisasi 10px supaya tidak memicu re-render berulang
        setWidth(Math.max(200, Math.min(400, Math.round(next / 10) * 10)));
      }
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [clientId]);

  if (!clientId) return null;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">atau</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div
        ref={containerRef}
        className="flex min-w-0 w-full justify-center overflow-hidden"
      >
        {width ? (
          <GoogleLogin
            onSuccess={(response) => {
              if (response.credential) onCredential(response.credential);
            }}
            onError={() => {
              toast.error("Gagal menghubungi Google. Coba lagi.");
            }}
            theme="outline"
            shape="rectangular"
            text="signin_with"
            width={String(width)}
          />
        ) : null}
      </div>
    </GoogleOAuthProvider>
  );
}
