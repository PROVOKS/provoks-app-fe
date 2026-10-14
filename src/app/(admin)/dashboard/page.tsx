import { BookOpen, CheckCircle2, ClipboardList, TrendingDown, TrendingUp, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STATS = [
  { label: "Active Students", value: "2,847", delta: "+12.5%", up: true, icon: Users },
  { label: "Active Courses", value: "128", delta: "+4.2%", up: true, icon: BookOpen },
  { label: "Completion Rate", value: "86%", delta: "-2.1%", up: false, icon: CheckCircle2 },
  { label: "Assignments", value: "342", delta: "+8.4%", up: true, icon: ClipboardList },
];

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-12 items-center justify-between">
        <h1 className="font-heading text-[26px] font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <Card key={stat.label} className="gap-3 rounded-2xl p-4.5">
            <CardHeader className="flex-row items-center justify-between p-0">
              <CardTitle className="text-[13px] font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <span className="grid size-8 place-items-center rounded-[10px] bg-muted">
                <stat.icon className="size-4 text-muted-foreground" />
              </span>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5 p-0">
              <p className="font-heading text-[30px] leading-none font-bold">
                {stat.value}
              </p>
              <p className="flex items-center gap-1.5 text-xs">
                {stat.up ? (
                  <TrendingUp className="size-3.5 text-success" />
                ) : (
                  <TrendingDown className="size-3.5 text-destructive" />
                )}
                <span
                  className={
                    stat.up
                      ? "font-semibold text-success"
                      : "font-semibold text-destructive"
                  }
                >
                  {stat.delta}
                </span>
                <span className="text-muted-foreground">vs bulan lalu</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-[700px_1fr] gap-[18px]">
        <Card className="rounded-2xl p-5">
          <CardHeader className="p-0">
            <CardTitle className="font-heading text-[15px] font-semibold">
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 p-0 pt-4">
            <div>
              <p className="font-heading text-[32px] leading-none font-bold">
                1,248 jam
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                <span className="font-semibold text-success">+24.4%</span> vs
                periode lalu
              </p>
            </div>
            <div className="flex h-[150px] items-end gap-2">
              {[54, 72, 63, 90, 78, 110, 96, 132, 118, 104, 88, 72].map(
                (h, i) => (
                  <div
                    key={i}
                    style={{ height: h }}
                    className={
                      i === 7
                        ? "w-11 rounded-md bg-primary"
                        : "w-11 rounded-md bg-muted"
                    }
                  />
                ),
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl p-5">
          <CardHeader className="p-0">
            <CardTitle className="font-heading text-[15px] font-semibold">
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 p-0 pt-4">
            <p className="font-heading text-[38px] leading-none font-bold text-secondary">
              68%
            </p>
            <p className="text-[13px] text-muted-foreground">
              Target 80% - masih kurang 12%.
            </p>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[68%] rounded-full bg-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
