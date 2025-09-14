import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { notes } from "@/lib/data";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { format } from 'date-fns';

export default function DashboardPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between space-y-2 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Your Notes</h2>
          <p className="text-muted-foreground">Here&apos;s a list of your notes.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/dashboard/notes/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Note
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <Card key={note.id} className="flex flex-col transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="hover:text-primary transition-colors">
                <Link href={`/dashboard/notes/${note.id}`}>{note.title}</Link>
              </CardTitle>
              <CardDescription>
                {format(new Date(note.updatedAt), "MMMM d, yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {note.content}
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="secondary" className="w-full">
                <Link href={`/dashboard/notes/${note.id}`}>View Note</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}