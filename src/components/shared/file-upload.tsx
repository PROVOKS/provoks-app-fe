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
  const [dragging, setDragging] = useState(false);

  async function upload(file: File) {
    setIsUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const { data } = await api.post<ApiEnvelope<UploadedFile>>(
        "/uploads",
        form,
      );
      toast.success(`"${file.name}" berhasil diunggah`);
      onUploaded(data.data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload gagal");
    } finally {
      setIsUploading(false);
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
        {isUploading ? "Mengunggah..." : label}
      </p>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}

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
