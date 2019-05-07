import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  @ViewChild('email') emailField;
  @ViewChild('password') passField;
  loadingRef = null;

  constructor(
    // firebase.auth() in Firebase documentation is userAuth
    private userAuth: AngularFireAuth,
    private loadingController: LoadingController,
    private router: Router,
    private alertController: AlertController,
  ) { }

  // This function logs the support rep into the system
  login() {
    const email = this.emailField.value;
    const password = this.passField.value;
    this.presentLoading();
    this.userAuth.auth.signInWithEmailAndPassword(email, password)
    .then(result => {
      this.dismissLoading();
      this.router.navigateByUrl('/profile');
    })
    .catch((error) => {
      this.dismissLoading();
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
          console.log(data);
          this.userAuth.auth.sendPasswordResetEmail(data.email).then(() => {
          }).catch((error) => {
            console.log(error);
          });
        }
      }]
    });

    await alert.present();
  }

  async presentLoading() {
    this.loadingRef = await this.loadingController.create({ message: '...אנא המתן', });
    await this.loadingRef.present();
  }

  dismissLoading() {
    this.loadingRef.dismiss();
  }


}
