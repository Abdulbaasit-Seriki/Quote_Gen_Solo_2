/**
 * Sender can ONLY be a user
 * Receiver can ONLY be a trainer
 */
export interface IReview {
  receiverId: string;
  senderId: string;
  stars: number;
  created: Date;
  content: string;
}
