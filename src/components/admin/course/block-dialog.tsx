"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

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
import type { BlockType, ContentBlock } from "@/types";

export const BLOCK_TYPES: { value: BlockType; label: string; hint: string }[] = [
  { value: "HEADING", label: "Heading", hint: "Judul bagian materi" },
  { value: "PARAGRAPH", label: "Paragraph", hint: "Rich text: bold, list, link" },
  { value: "IMAGE", label: "Image", hint: "Gambar pendukung" },
  { value: "DIVIDER", label: "Divider", hint: "Garis pemisah" },
  { value: "VIDEO", label: "Video", hint: "Embed YouTube / Vimeo" },
  { value: "CODE", label: "Code", hint: "Code block + highlight" },
  { value: "CALLOUT", label: "Callout", hint: "Catatan penting" },
  { value: "QUIZ", label: "Quiz", hint: "Buat sendiri atau import JSON" },
];

type Content = Record<string, unknown>;

function defaultsFor(type: BlockType): Content {
  switch (type) {
    case "HEADING":
      return { level: 2, text: "" };
    case "PARAGRAPH":
      return { text: "" };
    case "IMAGE":
      return { url: "", alt: "", caption: "" };
    case "DIVIDER":
      return { style: "solid" };
    case "VIDEO":
      return { url: "", title: "" };
    case "CODE":
      return { language: "javascript", code: "" };
    case "CALLOUT":
      return { variant: "info", text: "" };
    case "QUIZ":
      return { title: "" };
    default:
      return {};
  }
}

export function BlockDialog({
  open,
  onOpenChange,
  block,
  onSubmit,
  isPending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  block?: ContentBlock | null;
  onSubmit: (values: { type: BlockType; content: Content }) => void;
  isPending?: boolean;
}) {
  const isEdit = Boolean(block);
  const [type, setType] = useState<BlockType>("HEADING");
  const [content, setContent] = useState<Content>(defaultsFor("HEADING"));

  useEffect(() => {
    if (!open) return;
    if (block) {
      setType(block.type);
      setContent({ ...defaultsFor(block.type), ...(block.content ?? {}) });
    } else {
      setType("HEADING");
      setContent(defaultsFor("HEADING"));
    }
  }, [open, block]);

  function changeType(next: BlockType) {
    setType(next);
    setContent(defaultsFor(next));
  }

  function set(key: string, value: unknown) {
    setContent((prev) => ({ ...prev, [key]: value }));
  }

  const str = (key: string) => String(content[key] ?? "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg">
            {isEdit ? "Edit Block" : "Tambah Block"}
          </DialogTitle>
          <DialogDescription>
            Pilih tipe block lalu isi kontennya.
          </DialogDescription>
        </DialogHeader>

        <form
          id="block-form"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit({ type, content });
          }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label>Tipe Block</Label>
            <Select
              value={type}
              onValueChange={(value) => changeType(value as BlockType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BLOCK_TYPES.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label} — {item.hint}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {type === "HEADING" ? (
            <>
              <div className="flex flex-col gap-2">
                <Label>Level</Label>
                <Select
                  value={String(content.level ?? 2)}
                  onValueChange={(value) => set("level", Number(value))}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Heading 1</SelectItem>
                    <SelectItem value="2">Heading 2</SelectItem>
                    <SelectItem value="3">Heading 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="block-text">Teks</Label>
                <Input
                  id="block-text"
                  placeholder="Apa itu JSX?"
                  value={str("text")}
                  onChange={(event) => set("text", event.target.value)}
                />
              </div>
            </>
          ) : null}

          {type === "PARAGRAPH" ? (
            <div className="flex flex-col gap-2">
              <Label htmlFor="block-paragraph">Teks</Label>
              <Textarea
                id="block-paragraph"
                rows={5}
                placeholder="Tulis paragraf materi..."
                value={str("text")}
                onChange={(event) => set("text", event.target.value)}
              />
            </div>
          ) : null}

          {type === "IMAGE" ? (
            <>
              <div className="flex flex-col gap-2">
                <Label htmlFor="block-url">URL Gambar</Label>
                <Input
                  id="block-url"
                  placeholder="https://cdn.provoks.id/diagram.png"
                  value={str("url")}
                  onChange={(event) => set("url", event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="block-alt">Alt Text</Label>
                <Input
                  id="block-alt"
                  placeholder="Deskripsi gambar"
                  value={str("alt")}
                  onChange={(event) => set("alt", event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="block-caption">Caption</Label>
                <Input
                  id="block-caption"
                  placeholder="Caption (opsional)"
                  value={str("caption")}
                  onChange={(event) => set("caption", event.target.value)}
                />
              </div>
            </>
          ) : null}

          {type === "DIVIDER" ? (
            <div className="flex flex-col gap-2">
              <Label>Gaya</Label>
              <Select
                value={str("style") || "solid"}
                onValueChange={(value) => set("style", value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : null}

          {type === "VIDEO" ? (
            <>
              <div className="flex flex-col gap-2">
                <Label htmlFor="block-video-url">URL Video</Label>
                <Input
                  id="block-video-url"
                  className="font-mono text-[13px]"
                  placeholder="https://youtube.com/watch?v=xxxx"
                  value={str("url")}
                  onChange={(event) => set("url", event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="block-video-title">Judul Video</Label>
                <Input
                  id="block-video-title"
                  placeholder="Pengenalan JSX (04:32)"
                  value={str("title")}
                  onChange={(event) => set("title", event.target.value)}
                />
              </div>
            </>
          ) : null}

          {type === "CODE" ? (
            <>
              <div className="flex flex-col gap-2">
                <Label htmlFor="block-language">Bahasa</Label>
                <Input
                  id="block-language"
                  placeholder="javascript"
                  value={str("language")}
                  onChange={(event) => set("language", event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="block-code">Kode</Label>
                <Textarea
                  id="block-code"
                  rows={5}
                  className="font-mono text-[13px]"
                  placeholder="const element = <h1>Hello, world!</h1>;"
                  value={str("code")}
                  onChange={(event) => set("code", event.target.value)}
                />
              </div>
            </>
          ) : null}

          {type === "CALLOUT" ? (
            <>
              <div className="flex flex-col gap-2">
                <Label>Varian</Label>
                <Select
                  value={str("variant") || "info"}
                  onValueChange={(value) => set("variant", value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="danger">Danger</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="block-callout">Isi</Label>
                <Textarea
                  id="block-callout"
                  rows={3}
                  placeholder="Selalu gunakan className, bukan class."
                  value={str("text")}
                  onChange={(event) => set("text", event.target.value)}
                />
              </div>
            </>
          ) : null}

          {type === "QUIZ" ? (
            <div className="flex flex-col gap-2">
              <Label htmlFor="block-quiz-title">Judul Kuis</Label>
              <Input
                id="block-quiz-title"
                placeholder="Kuis: Dasar JSX"
                value={str("title")}
                onChange={(event) => set("title", event.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Soal kuis diatur lewat tombol &quot;Kelola Soal&quot; setelah
                block disimpan.
              </p>
            </div>
          ) : null}
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button type="submit" form="block-form" disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            {isEdit ? "Simpan Perubahan" : "Simpan Block"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
