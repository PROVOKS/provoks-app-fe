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
import { useJoinPath } from "@/hooks/use-learning";

export function JoinPathDialog({
  open,
  onOpenChange,
  pathName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pathName?: string;
}) {
  const join = useJoinPath();
  const [code, setCode] = useState("");

  useEffect(() => {
    if (open) setCode("");
  }, [open]);

  function submit() {
    const value = code.trim();
    if (!value) return;
    join.mutate(value, { onSuccess: () => onOpenChange(false) });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="grid-rows-[auto_minmax(0,1fr)_auto] sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg">Masukkan kode akses</DialogTitle>
          <DialogDescription>
            {pathName
              ? `Kode untuk bergabung ke path "${pathName}".`
              : "Masukkan kode yang diberikan admin atau instruktur."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="join-path-form"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
          className="flex flex-col gap-2"
        >
          <Label htmlFor="join-code">Kode</Label>
          <Input
            id="join-code"
            value={code}
            autoFocus
            autoComplete="off"
            spellCheck={false}
            placeholder="mis. WEBDEV-7K3M9Q"
            className="font-mono tracking-wider uppercase"
            onChange={(event) => setCode(event.target.value.toUpperCase())}
          />
          <p className="text-xs text-muted-foreground">
            Kode tidak peka huruf besar/kecil. Hubungi admin kalau kode tidak berlaku.
          </p>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button
            type="submit"
            form="join-path-form"
            disabled={join.isPending || !code.trim()}
          >
            {join.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Gabung
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
