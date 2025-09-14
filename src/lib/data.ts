import type { Note } from "@/lib/schemas/note";
import type { Subscription } from "@/lib/schemas/subscription";
import type { User } from "@/lib/schemas/user";

export const notes: Note[] = [
  {
    id: "1",
    title: "Project Phoenix Kick-off",
    content: "Team meeting notes for the new project launch. Key discussion points included budget allocation, timeline, and initial resource assignment. Q1 goals are to finalize the MVP scope and complete the technical design document. Marketing to start user research next week.",
    createdAt: "2023-10-26T10:00:00Z",
    updatedAt: "2023-10-26T11:30:00Z",
  },
  {
    id: "2",
    title: "Q4 Marketing Strategy",
    content: "Brainstorming session for Q4 campaigns. Focus on social media engagement and influencer partnerships. We will run a holiday promotion in December. Content calendar needs to be finalized by EOW. A/B testing on ad copy to start Monday.",
    createdAt: "2023-10-25T14:00:00Z",
    updatedAt: "2023-10-25T15:00:00Z",
  },
  {
    id: "3",
    title: "API Design Review",
    content: "Technical review of the new public API. Discussed authentication methods (OAuth 2.0), rate limiting, and endpoint structure. The consensus is to use JWT for stateless authentication. Documentation will be generated using Swagger/OpenAPI. Next step is to build a prototype.",
    createdAt: "2023-10-24T11:00:00Z",
    updatedAt: "2023-10-24T12:00:00Z",
  },
  {
    id: "4",
    title: "Client Onboarding Checklist",
    content: "A step-by-step guide for onboarding new clients. 1. Send welcome email. 2. Schedule kick-off call. 3. Set up their account and provide credentials. 4. Conduct a training session. 5. Follow up after one week to ensure satisfaction.",
    createdAt: "2023-10-23T09:00:00Z",
    updatedAt: "2023-10-23T09:30:00Z",
  },
];

export const user: User = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
};

export const subscription: Subscription = {
  plan: 'Free',
  noteCount: 4,
  noteLimit: 100,
  userCount: 3,
  userLimit: 5,
  billing_period_ends: "2024-12-31",
};
