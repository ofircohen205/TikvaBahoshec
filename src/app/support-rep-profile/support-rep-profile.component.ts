import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirestoreService } from '../firebase/firestore/firestore.service';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'app-support-rep-profile',
  templateUrl: './support-rep-profile.component.html',
  styleUrls: ['./support-rep-profile.component.scss'],
})
export class SupportRepProfileComponent implements OnInit {

  constructor(
    private alertController: AlertController,
    private router: Router,
    private userAuth: AngularFireAuth,
    private firestore: FirestoreService,
    
    ) { }

  ngOnInit() {}

  async logout() {
    const alert = await this.alertController.create({
      header: 'התנתק',
      message: 'אתה עומד להתנתק עכשיו',
      buttons: ['סלמתאק', 'לא לא']
    });
    alert.present();
  }




  async readyForChat() {
    const alert = await this.alertController.create({
      header: 'מוכן לשיחה',
      message: 'עכשיו אתה מוכן ויכול לקבל פניות',
      buttons: ['אוקיי']
    });
    alert.present();
  }

  scrollToElement(e): void {
    var x = e.target.value
    var element = document.getElementById(x);
    element.scrollIntoView({behavior: "smooth", block: "start", inline: "start"});
   
  }

 


}
