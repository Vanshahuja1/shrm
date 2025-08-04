export type Email = {
  _id?: number;
  type?: "member_crud" | "increment" | "decrement" | "penalty" | "general";
  recipient?: string;
  sender?: string;
  subject?: string;
senderId?: string; // ID of the sender
  recipientId?: string; // ID of the recipient
  senderName?: string; // Name of the sender
  recipientName?: string; // Name of the recipient
  message?: string;
  sentAt?: string;
  status?: "sent" | "pending" | "failed" | "draft";
  isRead?: boolean;
  isStarred?: boolean;
  attachments?: string[];
  recipientEmail?: string; // Optional for "other" recipient
};
