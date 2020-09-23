import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { REVIEWS } from '../constants/collections';
import { IReview } from '../_model/review';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  trainerId: string;
  constructor(private af: AngularFireAuth, private db: AngularFirestore) {
    this.af.authState.subscribe((trainer) => {
      if (trainer) this.trainerId = trainer.uid;
      console.log('this.trainerId', this.trainerId);
    });
  }
  getReviews(trainerId: string) {
    if (!trainerId) return;
    return this.db.collection(REVIEWS).doc(trainerId).get();
  }
  addReview(review: IReview, receiverId: string) {}
  checkIfReviewExist(senderId: string, receiverId: string) {
    return this.db.collection(REVIEWS).doc(receiverId).get();
  }
}
