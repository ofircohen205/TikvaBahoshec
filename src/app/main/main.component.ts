import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirestoreService } from '../firebase/firestore/firestore.service';
import { GlobalService } from '../global/global.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {

  association_info: string;
  association_info_subscribe;

  constructor(
    private alertController: AlertController,
    private userAuth: AngularFireAuth,
    private router: Router,
    private firestore: FirestoreService,
    private global: GlobalService
  ) { }

  ngOnInit() {

    // Get the Association info from firebase and inject it to the main's HTML
    this.association_info_subscribe = this.firestore.getAssociationInfo().subscribe(results => {
      this.association_info = results.info;
      document.getElementById('association-info').innerHTML = this.association_info;
    });
  }

  userDetails() {
    this.global.userDetails();
  }

  moveToJgive() {
        window.open('https://www.jgive.com/new/he/ils/donation-targets/3670?currency=ILS&utm_campaign=Leave_no_Child_in_the_Dark&utm_source=mail');
  }

  sendToFacebook() {
    window.open('https://www.facebook.com/tikvabachoshech/');
  }


  ngOnDestroy() { 
    this.association_info_subscribe.unsubscribe();
  }
}
