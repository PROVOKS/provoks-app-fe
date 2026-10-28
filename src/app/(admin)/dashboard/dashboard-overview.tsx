"use client";

import {
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Clock,
  Route,
  Tags,
  UserCheck,
  Users,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/hooks/use-stats";
import { cn } from "@/lib/utils";

const numberFormat = new Intl.NumberFormat("id-ID");

function formatMinutes(total: number) {
  if (total <= 0) return "0 menit";
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (hours === 0) return `${minutes} menit`;
  return minutes === 0 ? `${hours} jam` : `${hours} jam ${minutes} menit`;
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="gap-3 rounded-2xl p-4.5">
      <CardHeader className="flex-row items-center justify-between p-0">
        <CardTitle className="text-[13px] font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <span className="grid size-8 place-items-center rounded-[10px] bg-muted">
          <Icon className="size-4 text-muted-foreground" />
        </span>
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5 p-0">
        <p className="font-heading text-[30px] leading-none font-bold">{value}</p>
        {hint ? <div className="text-xs text-muted-foreground">{hint}</div> : null}
      </CardContent>
    </Card>
  );
}

/** Kartu untuk entitas yang belum ada di backend. */
function ComingSoonCard({
  label,
  icon: Icon,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="gap-3 rounded-2xl border-dashed p-4.5 shadow-none">
      <CardHeader className="flex-row items-center justify-between p-0">
        <CardTitle className="text-[13px] font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <span className="grid size-8 place-items-center rounded-[10px] bg-muted/60">
          <Icon className="size-4 text-muted-foreground/60" />
        </span>
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5 p-0">
        <p className="font-heading text-[22px] leading-none font-semibold text-muted-foreground/70">
          Coming soon
        </p>
        <p className="text-xs text-muted-foreground">Belum tersedia di sistem.</p>
      </CardContent>
    </Card>
  );
}

export function DashboardOverview() {
  const { data, isLoading, isError } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-12 w-40" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-[120px] rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-[18px] xl:grid-cols-[minmax(0,1fr)_320px]">
          <Skeleton className="h-[280px] rounded-2xl" />
          <Skeleton className="h-[280px] rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="font-heading text-[26px] font-bold">Dashboard</h1>
        <Card className="rounded-2xl p-10 text-center text-sm text-muted-foreground">
          Gagal memuat statistik. Pastikan backend berjalan.
        </Card>
      </div>
    );
  }

  const chartMax = Math.max(1, ...data.enrollmentsPerMonth.map((item) => item.count));
  const totalRecent = data.enrollmentsPerMonth.reduce(
    (total, item) => total + item.count,
    0,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-0.5">
        <h1 className="font-heading text-[26px] font-bold">Dashboard</h1>
        <p className="text-[13px] text-muted-foreground">
          Ringkasan data asli dari sistem.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active Students"
          value={numberFormat.format(data.students)}
          hint={`${numberFormat.format(data.instructors)} instruktur · ${numberFormat.format(data.admins)} admin`}
          icon={Users}
        />
        <StatCard
          label="Active Courses"
          value={numberFormat.format(data.courses)}
          hint={`${numberFormat.format(data.publishedCourses)} published`}
          icon={BookOpen}
        />
        <StatCard
          label="Completion Rate"
          value={`${data.completionRate}%`}
          hint={`dari ${numberFormat.format(data.enrollments)} enrollment`}
          icon={CheckCircle2}
        />
        {data.assignments === null ? (
          <ComingSoonCard label="Assignments" icon={ClipboardList} />
        ) : (
          <StatCard
            label="Assignments"
            value={numberFormat.format(data.assignments)}
            icon={ClipboardList}
          />
        )}
      </div>

      <div className="grid grid-cols-1 items-start gap-[18px] xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="rounded-2xl p-5">
          <CardHeader className="p-0">
            <CardTitle className="font-heading text-[15px] font-semibold">
              Enrollment 12 Bulan Terakhir
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 p-0 pt-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="font-heading text-[32px] leading-none font-bold">
                  {numberFormat.format(totalRecent)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  total enrollment baru
                </p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p className="flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  {formatMinutes(data.learningMinutes)} belajar
                </p>
              </div>
            </div>

            {totalRecent === 0 ? (
              <div className="flex h-[150px] items-center justify-center rounded-xl bg-muted/40 text-[13px] text-muted-foreground">
                Belum ada enrollment pada 12 bulan terakhir.
              </div>
            ) : (
              <div className="flex h-[150px] items-end gap-1.5 sm:gap-2">
                {data.enrollmentsPerMonth.map((item) => (
                  <div
                    key={item.month}
                    className="group flex h-full flex-1 flex-col items-center justify-end gap-1.5"
                    title={`${item.month}: ${item.count} enrollment`}
                  >
                    <div
                      className={cn(
                        "w-full rounded-md transition-colors",
                        item.count > 0 ? "bg-primary" : "bg-muted",
                      )}
                      style={{
                        height: `${Math.max(4, (item.count / chartMax) * 100)}%`,
                      }}
                    />
                    <span className="hidden text-[10px] text-muted-foreground sm:block">
                      {item.month.slice(5)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl p-5">
          <CardHeader className="p-0">
            <CardTitle className="font-heading text-[15px] font-semibold">
              Konten & Permintaan
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 p-0 pt-4">
            {[
              { label: "Path", value: data.paths, icon: Route },
              { label: "Tag", value: data.tags, icon: Tags },
              {
                label: "Permintaan path menunggu",
                value: data.pendingPathRequests,
                icon: UserCheck,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2.5"
              >
                <span className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  <item.icon className="size-4" />
                  {item.label}
                </span>
                <span className="font-heading text-[15px] font-semibold">
                  {numberFormat.format(item.value)}
                </span>
              </div>
            ))}

            <div className="mt-1 flex flex-col gap-1 rounded-xl border border-dashed px-3 py-2.5">
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground">
                SERTIFIKAT & PEMBAYARAN
              </span>
              <span className="text-[13px] text-muted-foreground/70">
                Coming soon
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
