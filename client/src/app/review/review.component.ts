import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../_services/review.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css'],
})
export class ReviewComponent implements OnInit {
  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.reviewService
      .checkIfReviewExist('', 'Hm65Z9e43MayHiHMOuFT35iYD0D3')
      .subscribe((e) => console.log(e));
  }
}
