import { notes } from "@/lib/data";
import { notFound } from "next/navigation";
import { NoteEditor } from "@/components/note-editor";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function NotePage({ params }: { params: { id: string } }) {
  const note = notes.find((n) => n.id === params.id);

  if (!note) {
    notFound();
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                <BreadcrumbLink asChild>
                    <Link href="/dashboard">Notes</Link>
                </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                <BreadcrumbPage>{note.title}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
      <NoteEditor note={note} />
    </div>
  );
}
