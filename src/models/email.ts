export interface Email {
  from: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
  category?: string;
}
