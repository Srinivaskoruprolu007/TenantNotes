"use server";

import {
  summarizeNote as summarizeNoteFlow,
  type SummarizeNoteInput,
} from "@/ai/flows/summarize-note";

export async function summarizeNote(input: SummarizeNoteInput) {
  // Here you could add extra logic, like checking user permissions,
  // logging the request, or handling errors before calling the flow.
  try {
    const result = await summarizeNoteFlow(input);
    return result;
  } catch (error) {
    console.error("Error summarizing note:", error);
    // You can re-throw the error or return a specific error structure
    throw new Error("Failed to summarize the note. Please try again.");
  }
}
