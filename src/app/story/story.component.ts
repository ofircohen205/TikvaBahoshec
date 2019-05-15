import { Component, OnInit, ViewChild } from '@angular/core';
import { FirestoreService } from '../firebase/firestore/firestore.service';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss'],
})
export class StoryComponent implements OnInit {

  @ViewChild('title') title;
  @ViewChild('description') description;
  stories = [];

  constructor(
    private firestore: FirestoreService
  ) { }

  ngOnInit() {
    this.firestore.getStories().subscribe(result => {
      result.sort((s1, s2) => {
        if (s1['timestamp'] > s2['timestamp']) {
          return 1;
        } else {
          return -1;
        }
      });
      if (this.stories.length <= 0) {
        this.stories = result;
      } else {
        this.stories.push(result[result.length - 1]);
      }
    });
  }

  sendStory() {
    this.firestore.createStory(this.title.value, this.description.value);
  }

}
