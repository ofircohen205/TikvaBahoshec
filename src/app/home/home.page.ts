import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirestoreService } from '../firebase/firestore/firestore.service';
import { GlobalService } from '../global/global.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('story') story;
  @ViewChild('main') main;

  constructor(
    private alertController: AlertController,
    private userAuth: AngularFireAuth,
    private router: Router,
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
    if (tar === 'story') {
      if (storyElement.hidden === true) {
        storyElement.hidden = false;
        calenderElement.hidden = true;
        mainElement.hidden = true;
        this.location.go('/story');
      }
    } else if (tar === 'home') {
      if (mainElement.hidden === true) {
        storyElement.hidden = true;
        calenderElement.hidden = true;
        mainElement.hidden = false;
        this.location.go('/home');
      }
    } else if (tar === 'calender') {
        storyElement.hidden = true;
        calenderElement.hidden = false;
        mainElement.hidden = true;
        this.location.go('/calender');
    }
  }

}
