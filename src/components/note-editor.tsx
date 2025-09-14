
"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, Trash2 } from "lucide-react";
import type { Note } from "@/lib/data";
import { summarizeNote } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { TiptapEditor } from "@/components/tiptap-editor";

interface NoteEditorProps {
  note: Note;
}

export function NoteEditor({ note }: NoteEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const { toast } = useToast();
  const isNewNote = note.id === "new";

  const handleSummarize = async () => {
    if (!content) {
      toast({
        variant: "destructive",
        title: "Content Required",
        description: "Please write some content before summarizing.",
      });
      return;
    }
    setIsSummarizing(true);
    setSummary(null);
    try {
      const plainTextContent = content.replace(/<[^>]*>?/gm, ' ');
      const result = await summarizeNote({ noteContent: plainTextContent });
      setSummary(result.summary);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Summarization Failed",
        description: "Could not generate summary. Please try again.",
      });
    } finally {
      setIsSummarizing(false);
    }
  };
  
  const handleSave = () => {
    toast({
        title: isNewNote ? "Note Created!" : "Note Saved!",
        description: `Your note has been successfully ${isNewNote ? 'created' : 'saved'}.`,
    });
    if (isNewNote) {
        const newId = Math.random().toString(36).substring(2, 9);
        router.push(`/dashboard/notes/${newId}`);
    }
  };
  
  const handleDelete = () => {
    // In a real app, this would be an API call.
    // Here, we'll use session storage to let the dashboard know.
    sessionStorage.setItem('deletedNoteId', note.id);
    toast({
        title: "Note Deleted",
        description: "Your note has been successfully deleted.",
    });
    router.push("/dashboard");
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
            <CardTitle>{isNewNote ? "Create New Note" : "Edit Note"}</CardTitle>
            <CardDescription>
            {isNewNote ? "Fill out the details for your new note." : "Make changes to your note and get an AI summary."}
            </CardDescription>
        </div>
        {!isNewNote && (
           <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                    <Trash2 />
                    <span className="sr-only">Delete Note</span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    note and remove your data from our servers.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title" />
        </div>
        <div className="space-y-2">
          <Label>Content</Label>
          <TiptapEditor
            content={content}
            onChange={handleContentChange}
            placeholder="Start writing your note here..."
          />
        </div>

        {summary && (
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertTitle>AI Summary</AlertTitle>
            <AlertDescription>{summary}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="justify-between">
        <Button onClick={handleSummarize} variant="secondary" disabled={isSummarizing || !content}>
          {isSummarizing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Summarize with AI
        </Button>
        <Button onClick={handleSave} disabled={!title || !content}>{isNewNote ? "Create Note" : "Save Changes"}</Button>
      </CardFooter>
    </Card>
  );
}
