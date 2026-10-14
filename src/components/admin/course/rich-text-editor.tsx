"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Check,
  Code,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
        },
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "tiptap-editor rich-text",
      },
    },
    onUpdate: ({ editor: instance }) => onChange(instance.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="min-h-32 rounded-xl border border-border bg-muted/30" />
    );
  }

  const buttonClass = (active: boolean) =>
    cn(
      "grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted",
      active && "bg-muted text-foreground",
    );

  function openLink() {
    const current = editor?.getAttributes("link").href as string | undefined;
    setLinkUrl(current ?? "https://");
    setLinkOpen(true);
  }

  function applyLink() {
    const href = linkUrl.trim();
    if (!editor) return;
    if (!href || href === "https://") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href })
        .run();
    }
    setLinkOpen(false);
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/30 p-2">
        <button
          type="button"
          className={buttonClass(editor.isActive("bold"))}
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
          title="Bold"
        >
          <Bold className="size-4" />
        </button>
        <button
          type="button"
          className={buttonClass(editor.isActive("italic"))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
          title="Italic"
        >
          <Italic className="size-4" />
        </button>
        <button
          type="button"
          className={buttonClass(editor.isActive("underline"))}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          aria-label="Underline"
          title="Underline"
        >
          <UnderlineIcon className="size-4" />
        </button>
        <button
          type="button"
          className={buttonClass(editor.isActive("strike"))}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          aria-label="Strikethrough"
          title="Strikethrough"
        >
          <Strikethrough className="size-4" />
        </button>

        <span className="mx-1 h-5 w-px bg-border" />

        <button
          type="button"
          className={buttonClass(editor.isActive("heading", { level: 2 }))}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          aria-label="Heading 2"
          title="Heading 2"
        >
          <Heading2 className="size-4" />
        </button>
        <button
          type="button"
          className={buttonClass(editor.isActive("heading", { level: 3 }))}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          aria-label="Heading 3"
          title="Heading 3"
        >
          <Heading3 className="size-4" />
        </button>

        <span className="mx-1 h-5 w-px bg-border" />

        <button
          type="button"
          className={buttonClass(editor.isActive("bulletList"))}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Bullet list"
          title="Bullet list"
        >
          <List className="size-4" />
        </button>
        <button
          type="button"
          className={buttonClass(editor.isActive("orderedList"))}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Numbered list"
          title="Numbered list"
        >
          <ListOrdered className="size-4" />
        </button>
        <button
          type="button"
          className={buttonClass(editor.isActive("blockquote"))}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          aria-label="Quote"
          title="Quote"
        >
          <Quote className="size-4" />
        </button>
        <button
          type="button"
          className={buttonClass(editor.isActive("code"))}
          onClick={() => editor.chain().focus().toggleCode().run()}
          aria-label="Inline code"
          title="Inline code"
        >
          <Code className="size-4" />
        </button>
        <button
          type="button"
          className={buttonClass(editor.isActive("link") || linkOpen)}
          onClick={openLink}
          aria-label="Link"
          title="Tambah / ubah tautan"
        >
          <LinkIcon className="size-4" />
        </button>

        <span className="mx-1 h-5 w-px bg-border" />

        <button
          type="button"
          className={buttonClass(false)}
          onClick={() => editor.chain().focus().undo().run()}
          aria-label="Undo"
          title="Undo"
        >
          <Undo2 className="size-4" />
        </button>
        <button
          type="button"
          className={buttonClass(false)}
          onClick={() => editor.chain().focus().redo().run()}
          aria-label="Redo"
          title="Redo"
        >
          <Redo2 className="size-4" />
        </button>
      </div>

      {linkOpen ? (
        <div className="flex items-center gap-2 border-b border-border bg-muted/20 p-2">
          <Input
            autoFocus
            value={linkUrl}
            placeholder="https://contoh.com"
            className="h-8 flex-1 text-[13px]"
            onChange={(event) => setLinkUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                applyLink();
              }
              if (event.key === "Escape") setLinkOpen(false);
            }}
          />
          <Button type="button" size="sm" onClick={applyLink}>
            <Check className="size-3.5" />
            Terapkan
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              editor.chain().focus().extendMarkRange("link").unsetLink().run();
              setLinkOpen(false);
            }}
          >
            <X className="size-3.5" />
            Hapus
          </Button>
        </div>
      ) : null}

      <div className="p-3.5">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
