import { Component, OnInit, ViewChild } from '@angular/core';
import { FirestoreService } from '../firebase/firestore/firestore.service';
import { GlobalService } from '../global/global.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private firestore: FirestoreService,
    private global: GlobalService,
    private location: Location
  ) {  }

  ngOnInit() { }

  userDetails() {
    this.global.userDetails();
  }


  onclick(e): void {
    const tar = e.target.value;
    const storyElement = document.getElementById('story');
    const mainElement = document.getElementById('main');
    const calenderElement = document.getElementById('calender');
    const titleElement = document.getElementById('title-header');
    if (tar === 'story') {
      if (storyElement.hidden === true) {
        storyElement.hidden = false;
        calenderElement.hidden = true;
        mainElement.hidden = true;
        this.location.go('/story');
        titleElement.textContent = 'תקווה בחושך - סיפורים';
      }
    } else if (tar === 'home') {
      if (mainElement.hidden === true) {
        storyElement.hidden = true;
        calenderElement.hidden = true;
        mainElement.hidden = false;
        this.location.go('/home');
        titleElement.textContent = 'תקווה בחושך';
      }
    } else if (tar === 'calender') {
        storyElement.hidden = true;
        calenderElement.hidden = false;
        mainElement.hidden = true;
        this.location.go('/calender');
        titleElement.textContent = 'תקווה בחושך - אירועים';
    }
  }

}
