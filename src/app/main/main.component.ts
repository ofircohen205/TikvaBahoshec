import { Component, OnInit } from '@angular/core';
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
export class MainComponent implements OnInit {

  association_info: string;

  constructor(
    private alertController: AlertController,
    private userAuth: AngularFireAuth,
    private router: Router,
    private firestore: FirestoreService,
    private global: GlobalService
  ) { }

  ngOnInit() {

    // Get the Association info from firebase and inject it to the main's HTML
    this.firestore.getAssociationInfo().subscribe(results => {
      this.association_info = results.info;
      document.getElementById('association-info').innerHTML = this.association_info;
    });
  }

  userDetails() {
    this.global.userDetails();
  }

  moveToJgive() {
    // tslint:disable-next-line: max-line-length
        window.open('https://www.jgive.com/new/he/ils/donation-targets/3670?currency=ILS&utm_campaign=Leave_no_Child_in_the_Dark&utm_source=mail');
  }

  sendToFacebook() {
    window.open('https://www.facebook.com/tikvabachoshech/');
  }

}
