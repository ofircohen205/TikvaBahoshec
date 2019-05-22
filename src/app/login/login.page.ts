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
 async login() {
    this.loadingRef = await this.loadingController.create({ message: '...אנא המתן', });
    await this.loadingRef.present();

    const email = this.emailField.value;
    const password = this.passField.value;
    // ! check if email and password aren't 'undefined'
    
    this.userAuth.auth.signInWithEmailAndPassword(email, password)
    .then(result => {
      this.loadingRef.dismiss()
      this.router.navigateByUrl('/profile');
    })
    .catch(async (error) => {
      this.loadingRef.dismiss();
      var errorMSG = await this.alertController.create({ 
        message:'User name or Password are incorrect, Please try again',
      buttons:['OK'] ,
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

 async dismissLoading() {
   await this.loadingRef.dismiss();
   
  }

  

}
