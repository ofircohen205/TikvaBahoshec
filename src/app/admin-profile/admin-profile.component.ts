import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { element } from '@angular/core/src/render3';




@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss'],
})


export class AdminProfileComponent implements OnInit {
    divToShow =""
    

  constructor(
    private alertController: AlertController,
    private router: Router,
    private userAuth: AngularFireAuth
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
