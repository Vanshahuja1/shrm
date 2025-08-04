export type Email = {
  _id?: number;
  type?: "member_crud" | "increment" | "decrement" | "penalty" | "general";
  recipient?: string;
  senderId?: string;
  recipientId?: string;
  senderName?: string;
  recipientName?: string;
  sender?: string;
  subject?: string;
  message?: string;
  sentAt?: string;
  status?: "sent" | "pending" | "failed" | "draft";
  isRead?: boolean;
  isStarred?: boolean;
  attachments?: string[];
  recipientEmail?: string; // Optional for "other" recipient
};
