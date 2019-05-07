import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirestoreService } from '../firebase/firestore/firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private alertController: AlertController,
    private userAuth: AngularFireAuth,
    private router: Router,
    private firestore: FirestoreService
  ) { }

  ngOnInit() {
    // alert('Page started');
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
          if(data.name === '') {
            let num = 1;
            this.firestore.getAnonNumber().subscribe(result => num = result[0]['nextAnonymous']);
            data.name = 'אנונימי' + num;
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
