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

  aboutAssociation = '';
  anonymousNumber = -1;

  constructor(
    private alertController: AlertController,
    private userAuth: AngularFireAuth,
    private router: Router,
    private firestore: FirestoreService,
    private global: GlobalService
    ) { }

  ngOnInit() {
    this.firestore.getAnonNumber().subscribe(result => this.anonymousNumber = result['nextAnonymous']);
    this.firestore.getAboutAssociation().subscribe(result => this.aboutAssociation = result['aboutAssociation']);
  }

  userDetails() {
    this.global.userDetails();
  }

}
