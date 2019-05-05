import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss'],
})
export class AdminProfileComponent implements OnInit {

  constructor(private alertController:AlertController) { }

  ngOnInit() {}

  async logout(){
    let alert = await this.alertController.create({
      header: 'התנתק',
      message: 'אתה עומד להתנתק עכשיו',
      buttons: ['סלמתאק','לא לא']
      
    });
    alert.present();



  }
  async readyForChat(){
    let alert = await this.alertController.create({
      header: 'מוכן לשיחה',
      message: "עכשיו אתה מוכן ויכול לקבל פניות",
      buttons: ['אוקיי']
      
    });
    alert.present();



  }


  ManageSupportRep(){
    


  }


  Manage_SupportRep(){
    

  }  

}
