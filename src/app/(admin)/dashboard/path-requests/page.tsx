"use client";

import { useState } from "react";
import { Check, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathRequests, useReviewPathRequest } from "@/hooks/use-users";
import type { PathEnrollmentStatus } from "@/types";

const TABS: { value: PathEnrollmentStatus; label: string }[] = [
  { value: "PENDING", label: "Menunggu" },
  { value: "APPROVED", label: "Disetujui" },
  { value: "REJECTED", label: "Ditolak" },
];

function StatusChip({ status }: { status: PathEnrollmentStatus }) {
  const map: Record<PathEnrollmentStatus, string> = {
    APPROVED: "bg-primary/10 text-primary",
    PENDING: "bg-muted text-muted-foreground",
    REJECTED: "bg-destructive/10 text-destructive",
  };
  const label: Record<PathEnrollmentStatus, string> = {
    APPROVED: "Disetujui",
    PENDING: "Menunggu",
    REJECTED: "Ditolak",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${map[status]}`}
    >
      {label[status]}
    </span>
  );
}

export default function PathRequestsPage() {
  const [status, setStatus] = useState<PathEnrollmentStatus>("PENDING");
  const { data, isLoading, isError } = usePathRequests(status);
  const review = useReviewPathRequest();

  const requests = data?.items ?? [];
  const pendingId = review.isPending ? review.variables?.id : undefined;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-12 items-center">
        <div className="flex flex-col gap-0.5">
          <h1 className="font-heading text-[26px] font-bold">Permintaan Path</h1>
          <p className="text-[13px] text-muted-foreground">
            Setujui atau tolak siswa yang ingin masuk ke path tambahan.
          </p>
        </div>
      </div>

      <div className="rounded-[20px] border border-border bg-card p-6">
        <Tabs value={status} onValueChange={(value) => setStatus(value as PathEnrollmentStatus)}>
          <TabsList>
            {TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="mt-4">
          {isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : isError ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Gagal memuat permintaan path.
            </p>
          ) : requests.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Tidak ada permintaan pada kategori ini.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {["SISWA", "NIM", "PATH DITUJU", "CATATAN", "STATUS"].map((head) => (
                    <TableHead
                      key={head}
                      className="text-[11px] font-semibold tracking-wider text-muted-foreground"
                    >
                      {head}
                    </TableHead>
                  ))}
                  <TableHead className="w-32 text-[11px] font-semibold tracking-wider text-muted-foreground">
                    AKSI
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="text-[13px] font-medium">
                      {request.student.name}
                      <span className="block text-xs font-normal text-muted-foreground">
                        {request.student.email}
                      </span>
                    </TableCell>
                    <TableCell className="text-[13px] text-muted-foreground">
                      {request.student.nim ?? "-"}
                    </TableCell>
                    <TableCell className="text-[13px]">
                      {request.path.name}
                      <span className="block text-xs text-muted-foreground">
                        {request.path.isFastTrack ? "Fast Track" : "Reguler"}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[220px] text-[13px] text-muted-foreground">
                      {request.note || "-"}
                    </TableCell>
                    <TableCell>
                      <StatusChip status={request.status} />
                    </TableCell>
                    <TableCell>
                      {request.status === "PENDING" ? (
                        <div className="flex items-center gap-1.5">
                          <Button
                            size="sm"
                            disabled={review.isPending}
                            onClick={() =>
                              review.mutate({ id: request.id, status: "APPROVED" })
                            }
                          >
                            {pendingId === request.id ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Check className="size-3.5" />
                            )}
                            Setujui
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={review.isPending}
                            onClick={() =>
                              review.mutate({ id: request.id, status: "REJECTED" })
                            }
                          >
                            <X className="size-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
