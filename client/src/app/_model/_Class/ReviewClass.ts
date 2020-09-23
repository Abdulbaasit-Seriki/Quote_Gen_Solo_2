import { IReview } from '../_Interface/IReview';
/**
 * Sender can ONLY be a user
 * Receiver can ONLY be a trainer
 * Stars can only between 0-5
 */
export class ReviewClass implements IReview {
  receiverId: string;
  senderId: string;
  stars: number;
  created: Date = new Date();
  content: string;
}
