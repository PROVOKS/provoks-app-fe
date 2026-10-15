"use client";

import { useRef, useState } from "react";
import { CloudUpload, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { api, type ApiEnvelope } from "@/lib/api-client";
import { cn } from "@/lib/utils";

export type UploadedFile = {
  url: string;
  publicId: string;
  format: string;
  bytes: number;
  resourceType: string;
  originalName: string;
};

/** Dikirim backend: cukup untuk upload langsung tanpa file melewati server. */
type UploadSignature = {
  cloudName: string;
  apiKey: string;
  folder: string;
  timestamp: number;
  signature: string;
  maxBytes: number;
  allowedMime: string[];
};

type CloudinaryResponse = {
  secure_url?: string;
  public_id?: string;
  format?: string;
  bytes?: number;
  resource_type?: string;
  error?: { message?: string };
};

/**
 * Upload ke Cloudinary langsung dari browser. Pakai XMLHttpRequest (bukan fetch)
 * karena hanya XHR yang punya event progress upload.
 */
function postToCloudinary(
  sig: UploadSignature,
  file: File,
  onProgress: (percent: number) => void,
): Promise<CloudinaryResponse> {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("file", file);
    form.append("api_key", sig.apiKey);
    form.append("timestamp", String(sig.timestamp));
    form.append("signature", sig.signature);
    form.append("folder", sig.folder);

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`,
    );

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      let payload: CloudinaryResponse = {};
      try {
        payload = JSON.parse(xhr.responseText) as CloudinaryResponse;
      } catch {
        // respons bukan JSON — ditangani di bawah
      }
      if (xhr.status >= 200 && xhr.status < 300 && payload.secure_url) {
        resolve(payload);
      } else {
        reject(
          new Error(payload.error?.message ?? `Upload gagal (HTTP ${xhr.status})`),
        );
      }
    };

    xhr.onerror = () => reject(new Error("Koneksi ke Cloudinary gagal"));
    xhr.send(form);
  });
}

export function FileUpload({
  accept,
  label = "Tarik file ke sini atau pilih dari komputer",
  hint,
  onUploaded,
  className,
}: {
  accept?: string;
  label?: string;
  hint?: string;
  onUploaded: (file: UploadedFile) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);

  async function upload(file: File) {
    setIsUploading(true);
    setProgress(0);

    try {
      // 1. minta tanda tangan dari API (file tidak dikirim ke server kita)
      const { data } = await api.post<ApiEnvelope<UploadSignature>>(
        "/uploads/signature",
      );
      const sig = data.data;

      // 2. validasi di sisi client sebelum menyentuh Cloudinary
      if (file.size > sig.maxBytes) {
        throw new Error(
          `Ukuran file maksimal ${Math.round(sig.maxBytes / 1024 / 1024)}MB`,
        );
      }
      const mime = file.type || "unknown";
      if (sig.allowedMime.length && !sig.allowedMime.some((m) => mime.startsWith(m))) {
        throw new Error(`Tipe file tidak didukung: ${mime}`);
      }

      // 3. kirim langsung ke Cloudinary
      const payload = await postToCloudinary(sig, file, setProgress);

      toast.success(`"${file.name}" berhasil diunggah`);
      onUploaded({
        url: payload.secure_url ?? "",
        publicId: payload.public_id ?? "",
        format: payload.format ?? "",
        bytes: payload.bytes ?? file.size,
        resourceType: payload.resource_type ?? "auto",
        originalName: file.name,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload gagal");
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        const file = event.dataTransfer.files?.[0];
        if (file) void upload(file);
      }}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-6 text-center transition-colors",
        dragging ? "border-primary bg-primary/5" : "border-border bg-muted/40",
        className,
      )}
    >
      <span className="grid size-10 place-items-center rounded-full bg-card">
        {isUploading ? (
          <Loader2 className="size-4 animate-spin text-primary" />
        ) : (
          <CloudUpload className="size-4 text-muted-foreground" />
        )}
      </span>
      <p className="text-[13px] font-medium">
        {isUploading ? `Mengunggah... ${progress}%` : label}
      </p>

      {isUploading ? (
        <div className="h-1.5 w-40 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
          event.target.value = "";
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
      >
        Pilih file
      </Button>
    </div>
  );
}
