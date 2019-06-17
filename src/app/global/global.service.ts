import { Injectable, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirestoreService } from '../firebase/firestore/firestore.service';

import { AngularFireDatabase } from '@angular/fire/database';


@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  anonymousNumber = 0;

  constructor(
    private alertController: AlertController,
    private userAuth: AngularFireAuth,
    private afiredb: AngularFireDatabase,
    private router: Router,
    private firestore: FirestoreService) {
    this.firestore.getAnonNumber().subscribe(result => this.anonymousNumber = result['nextAnonymous']);
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
            this.firestore.updateAnonNumber(this.anonymousNumber + 1);
          }
          this.userAuth.auth.signInAnonymously().then(result => {
            this.firestore.createClient(data.name).then(result1 => {
              this.firestore.createChatRoom(data.name).then(result2 => {
                this.firestore.updateChatRoomId(result2.id);
                this.firestore.updateChatRoomClientId(result2.id, result1.id);
                this.firestore.updateClientID(result1.id);
                this.router.navigateByUrl('/chat/' + result2.id);
              }).catch((error) => console.log(error));
            });
          }).catch(error => console.log(error));

          this.afiredb.database.ref('/sendmail').remove();
          let connectList = [];
          this.firestore.getInShiftSupportRep().subscribe(result => {
            connectList = result;
            connectList.forEach(x => {
              this.afiredb.database.ref('/sendmail').push({
                emailid: x['email'],
                ClientName: data.name
              });
            });
          });
        }
      }]
    });
    await alert.present();
  }

  async readyForChat() {
    const alert = await this.alertController.create({
      header: 'מוכן לשיחה',
      message: 'עכשיו אתה מוכן ויכול לקבל פניות',
      buttons: ['אוקיי']
    });
    alert.present();
    document.getElementById('readyButton').style.color = 'success';
  }

  scrollToElement(e): void {
    const x = e.target.value;
    const element = document.getElementById(x);
    element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'start'});
  }


  async logout() {
    const alert = await this.alertController.create({
      header: 'התנתק',
      message: 'אתה עומד להתנתק עכשיו',
      buttons: [{
        text: 'המשך',
        handler: () => {
          this.userAuth.auth.signOut().then(() => {
            this.router.navigateByUrl('/login');
          }).catch((error) => console.log(error));
        }
      }, {
        text: 'עדיין לא'
      }]
    });
    alert.present();
  }

  async updatePassword() {
    const alert = await this.alertController.create({
      header: 'עדכן סיסמה',
      message: 'אנא הזן את הסיסמה החדשה',
      inputs: [{
        name: 'password',
        placeholder: 'סיסמה'
      }, {
        name: 'validate-password',
        placeholder: 'וידוא סיסמה'
      }],
      buttons: [{
        text: 'אישור',
        handler: data => {
          this.userAuth.auth.currentUser.updatePassword(data.password)
          .then(() => console.log('הסיסמה שונתה בהצלחה')).catch(error => console.log(error));
        }
      }, {
        text: 'בטל'
      }]
    });

    alert.present();
  }

  async invalidImage() {
    const alert = await this.alertController.create({
      header: 'קובץ אינו תקין',
      message: 'סוג הקובץ שהעלית איננו תמונה. אנא העלה קובץ מסוג JPG, JPEG, PNG',
      buttons: [{
        text: 'אישור'
      }]
    });

    alert.present();
  }

  openClient(clientId) {
    window.open('/client-profile/' + clientId, '_blank', 'location=yes,height=700,width=1000,scrollbars=yes,status=yes');
  }

}
