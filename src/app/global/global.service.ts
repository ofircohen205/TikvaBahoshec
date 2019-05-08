import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirestoreService } from '../firebase/firestore/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  anonymousNumber = -1;

  constructor(
    private alertController: AlertController,
    private userAuth: AngularFireAuth,
    private router: Router,
    private firestore: FirestoreService
    ) { }

// tslint:disable-next-line: use-life-cycle-interface
  ngOnInit() {
    this.firestore.getAnonNumber().subscribe(result => this.anonymousNumber = result[0]['nextAnonymous']);
  }

  async userDetails() {
    const alert = await this.alertController.create({
      header: 'הכנס שם',
      message: 'הזן את שמך. אם אינך מעוניין לחץ על כפתור המשך',
      inputs: [{
        name: 'name',
        placeholder: 'שם'
      }],
      buttons: [{
        text: 'המשך',
        handler: data => {
          if (data.name === '') {
            data.name = 'אנונימי' + this.anonymousNumber;
          }
          this.firestore.createChatRoom(data.name).then(result => {
            this.router.navigateByUrl('/chat?id=' + result['id']);
          }).catch((error) => console.log(error));
        }
      }]
    });

    await alert.present();
  }
}
