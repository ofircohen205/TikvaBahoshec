import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { FirestoreService } from '../firebase/firestore/firestore.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild('email') emailField;
  @ViewChild('password') passField;
  loadingRef = null;
  chatRoom = [];

  constructor(
    // firebase.auth() in Firebase documentation is userAuth
    private userAuth: AngularFireAuth,
    private loadingController: LoadingController,
    private router: Router,
    private alertController: AlertController,
    private firestore: FirestoreService
  ) { }

  ngOnInit() {
    const today = new Date().getTime();
    const yesterdayDate = today - 1000 * 60 * 60 * 24;
    this.firestore.destroyEmptyChatRooms(yesterdayDate);
  }

  onKeyUp(data) {
    const ENTER_KEY_CODE = 13;
    if (data.keyCode === ENTER_KEY_CODE) {
      this.login();
    }
  }

  // This function logs the support rep into the system
 async login() {
    this.loadingRef = await this.loadingController.create({ message: '...אנא המתן', });
    await this.loadingRef.present();

    const email = this.emailField.value;
    const password = this.passField.value;

    this.userAuth.auth.signInWithEmailAndPassword(email, password)
    .then(result => {
      this.loadingRef.dismiss();
      this.router.navigateByUrl('/profile');
    })
    .catch(async (error) => {
      this.loadingRef.dismiss();
      const errorMSG = await this.alertController.create({
        message: 'שם משתמש ו/או סיסמה אינם נכונים. אנא הזן שנית',
        buttons: ['OK'] ,
      });
      await errorMSG.present();
    });
  }

  async forgotPassword() {
    const alert = await this.alertController.create({
      header: 'איפוס סיסמה',
      message: 'הזן דוא"ל לקבלת הודעה על שינוי סיסמה',
      inputs: [{
        name: 'email',
        placeholder: 'email'
      }],
      buttons: [{
        text: 'שלח',
        handler: data => {
          this.userAuth.auth.sendPasswordResetEmail(data.email).then(() => {
          }).catch(async (error) => {
            const errorMSG = await this.alertController.create({
              message: 'אימייל זה אינו קיים. אנא הזן אימייל קיים',
              buttons: ['OK'] ,
            });
            await errorMSG.present();
          });
        }
      }]
    });

    await alert.present();
  }

  async presentLoading() {
    this.loadingRef = await this.loadingController.create({ message: 'אנא המתן...', });
    await this.loadingRef.present();
  }

 async dismissLoading() {
   await this.loadingRef.dismiss();
  }

}
