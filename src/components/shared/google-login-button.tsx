"use client";

import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { toast } from "sonner";

/**
 * Tombol "Masuk dengan Google" (Google Identity Services).
 * Tidak dirender kalau NEXT_PUBLIC_GOOGLE_CLIENT_ID belum diisi.
 */
export function GoogleLoginButton({
  onCredential,
}: {
  onCredential: (credential: string) => void;
}) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) return null;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">atau</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="flex justify-center">
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
          width="360"
        />
      </div>
    </GoogleOAuthProvider>
  );
}
