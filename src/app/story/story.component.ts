import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firebase/firestore/firestore.service';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss'],
})
export class StoryComponent implements OnInit {

  stories = [];

  constructor(
    private firestore: FirestoreService
  ) { }

  ngOnInit() {
    this.firestore.getStories().subscribe(result => {
      result.forEach(element => {
        if (element['approved']) {
          this.stories.push(element);
         }
      });
    });
  }

}
