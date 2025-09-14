"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import type { Note } from "@/lib/data";
import { summarizeNote } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

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
      const result = await summarizeNote({ noteContent: content });
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
    // In a real app, you would save the note to the database.
    // For a new note, you might redirect to the new note's page.
    toast({
        title: isNewNote ? "Note Created!" : "Note Saved!",
        description: `Your note has been successfully ${isNewNote ? 'created' : 'saved'}.`,
    });
    if (isNewNote) {
        // In a real app, you would get the new ID from the database
        const newId = Math.random().toString(36).substring(2, 9);
        router.push(`/dashboard/notes/${newId}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isNewNote ? "Create New Note" : "Edit Note"}</CardTitle>
        <CardDescription>
          {isNewNote ? "Fill out the details for your new note." : "Make changes to your note and get an AI summary."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title" />
        </div>
        <div className="space-y-2">
          <Label>Content</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[400px]"
                  placeholder="Start writing your note here... You can use Markdown!"
              />
              <div className="prose min-h-[400px] w-full rounded-md border border-input p-4 bg-muted/20">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || "Nothing to preview..."}</ReactMarkdown>
              </div>
          </div>
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