import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Detail Kursus" };
export const instant = false;

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <nav className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <Link href="/courses" className="hover:text-foreground">
            Manajemen Kursus
          </Link>
          <span>›</span>
          <span className="font-semibold text-foreground">Course #{id}</span>
        </nav>

        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3.5">
            <span className="size-14 rounded-2xl border border-border bg-secondary/25" />
            <h1 className="font-heading text-2xl font-bold">Detail Course</h1>
          </div>
          <div className="flex items-center gap-2.5">
            <Button variant="outline">Preview</Button>
            <Button variant="outline">Pengaturan Kursus</Button>
            <Button>Publikasikan</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[420px_1fr] items-start gap-[18px]">
        <Card className="rounded-[20px] p-5">
          <CardContent className="flex flex-col gap-3.5 p-0">
            <p className="font-heading text-[15px] font-semibold">
              Struktur Konten
            </p>
            <div className="h-px bg-border" />
            <p className="py-10 text-center text-sm text-muted-foreground">
              Belum ada course part. Tambah part untuk menyusun silabus.
            </p>
            <Button variant="outline">Tambah Part</Button>
          </CardContent>
        </Card>

        <Card className="rounded-[20px] p-6">
          <CardContent className="flex flex-col gap-4 p-0">
            <div className="flex items-center justify-between">
              <p className="font-heading text-[15px] font-semibold">
                Content Blocks
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Silabus belum dipilih</Badge>
                <Button variant="outline" size="sm">
                  Tambah block
                </Button>
              </div>
            </div>
            <div className="h-px bg-border" />
            <p className="py-16 text-center text-sm text-muted-foreground">
              Pilih silabus part di kiri untuk mulai menulis konten.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
