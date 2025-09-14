"use client";

import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Terminal } from "lucide-react";
import type { Note } from "@/lib/data";
import { summarizeNote } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

interface NoteEditorProps {
  note: Note;
}

export function NoteEditor({ note }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
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
    toast({
        title: "Note Saved!",
        description: "Your changes have been successfully saved.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Note</CardTitle>
        <CardDescription>Make changes to your note and get an AI summary.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[300px]"
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
        <Button onClick={handleSummarize} variant="secondary" disabled={isSummarizing}>
          {isSummarizing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Summarize with AI
        </Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </CardFooter>
    </Card>
  );
}
