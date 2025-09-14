export type Subscription = {
  plan: 'Free' | 'Pro';
  noteCount: number;
  noteLimit: number;
  userCount: number;
  userLimit: number;
  billing_period_ends: string;
};
