
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { notes as initialNotes, type Note } from "@/lib/data";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { format } from 'date-fns';
import { MainNav } from "@/components/main-nav";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);

  useEffect(() => {
    const deletedNoteId = sessionStorage.getItem('deletedNoteId');
    if (deletedNoteId) {
      setNotes(prevNotes => prevNotes.filter(note => note.id !== deletedNoteId));
      sessionStorage.removeItem('deletedNoteId');
    }
  }, []);


  return (
    <div className="grid gap-6 md:grid-cols-[180px_1fr]">
       <aside>
        <MainNav />
      </aside>
      <div className="animate-in fade-in duration-500">
        <div className="flex items-center justify-between space-y-2 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Notes</h1>
            <p className="text-muted-foreground">Here's a list of your notes.</p>
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
                <div
                  className="prose dark:prose-invert prose-sm text-muted-foreground line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: note.content }}
                />
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
    </div>
  );
}
