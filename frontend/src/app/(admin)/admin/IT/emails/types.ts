export type Email = {
  _id: number;
  type: "member_crud" | "increment" | "decrement" | "penalty" | "general";
  recipient: string;
  sender: string;
  subject: string;
  message: string;
  sentAt: string;
  status: "sent" | "pending" | "failed" | "draft";
  isRead: boolean;
  isStarred: boolean;
  attachments?: string[];
};
