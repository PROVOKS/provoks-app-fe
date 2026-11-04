"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, UserMinus, UserPlus, Users } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAddPathMentor,
  usePathMentors,
  useRemovePathMentor,
} from "@/hooks/use-path-mentors";
import { api, type ApiEnvelope } from "@/lib/api-client";
import type { Paginated, Path } from "@/types";

type InstructorOption = {
  id: string;
  name: string;
  email: string;
};

export function PathMentorsDialog({
  open,
  onOpenChange,
  path,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  path: Path | null;
}) {
  const pathId = path?.id ?? null;
  const mentorsQuery = usePathMentors(open ? pathId : null);
  const addMentor = useAddPathMentor();
  const removeMentor = useRemovePathMentor();

  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    if (!open) setSelectedUserId("");
  }, [open]);

  const instructorsQuery = useQuery({
    queryKey: ["users", "instructors", "options"],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<Paginated<InstructorOption>>>(
        "/users",
        { params: { role: "INSTRUCTOR", perPage: 100 } },
      );
      return data.data.items;
    },
    enabled: open,
  });

  const mentors = mentorsQuery.data ?? [];
  const mentorIds = new Set(mentors.map((mentor) => mentor.id));
  const availableInstructors = (instructorsQuery.data ?? []).filter(
    (user) => !mentorIds.has(user.id),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col">
        <DialogHeader>
          <DialogTitle>Kelola Mentor</DialogTitle>
          <DialogDescription>
            {path
              ? `Alokasikan instruktur untuk mengampu path "${path.name}". Mentor bisa mengelola course di path ini.`
              : "Alokasikan instruktur untuk mengampu path ini."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-semibold">
              Mentor terpasang ({mentors.length})
            </p>

            {mentorsQuery.isLoading ? (
              <Skeleton className="h-16 w-full rounded-xl" />
            ) : mentors.length === 0 ? (
              <div className="flex items-center gap-2.5 rounded-xl border border-dashed border-border px-4 py-5 text-[13px] text-muted-foreground">
                <Users className="size-4" />
                Belum ada mentor di path ini.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {mentors.map((mentor) => (
                  <div
                    key={mentor.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border px-3.5 py-2.5"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-[12px] font-bold text-primary">
                        {mentor.name.charAt(0).toUpperCase()}
                      </span>
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-[13px] font-semibold">
                          {mentor.name}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {mentor.email}
                        </span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="shrink-0 text-destructive hover:text-destructive"
                      disabled={removeMentor.isPending}
                      onClick={() =>
                        pathId &&
                        removeMentor.mutate({ pathId, userId: mentor.id })
                      }
                    >
                      <UserMinus className="size-4" />
                      Cabut
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="h-px bg-border" />

          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-semibold">Tambah mentor</p>

            {instructorsQuery.isLoading ? (
              <Skeleton className="h-9 w-full" />
            ) : availableInstructors.length === 0 ? (
              <p className="text-[13px] text-muted-foreground">
                Semua instruktur sudah menjadi mentor di path ini.
              </p>
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row">
                <Select
                  value={selectedUserId}
                  onValueChange={setSelectedUserId}
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Pilih instruktur" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableInstructors.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} — {user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  size="sm"
                  className="h-9 shrink-0"
                  disabled={
                    !selectedUserId ||
                    addMentor.isPending ||
                    !pathId
                  }
                  onClick={() => {
                    if (!pathId || !selectedUserId) return;
                    addMentor.mutate(
                      { pathId, userId: selectedUserId },
                      { onSuccess: () => setSelectedUserId("") },
                    );
                  }}
                >
                  {addMentor.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <UserPlus className="size-4" />
                  )}
                  Tambah
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
