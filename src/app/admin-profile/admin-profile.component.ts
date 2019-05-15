import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirestoreService } from '../firebase/firestore/firestore.service';
import { GlobalService } from '../global/global.service';




@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss'],
})


export class AdminProfileComponent implements OnInit {
    divToShow = '';
    list = [];

  constructor(
    private alertController: AlertController,
    private router: Router,
    private userAuth: AngularFireAuth,
    private firestore: FirestoreService,
    private global: GlobalService
  ) { }
    
  ngOnInit() {

   this.firestore.getSupportRepNameList().subscribe(result => {
      result.forEach(ele => {
        this.list.push(ele);
      });
    });
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'התנתק',
      message: 'אתה עומד להתנתק עכשיו',
      buttons: [{
        text: 'המשך',
        handler: () => {
          this.userAuth.auth.signOut().then(() => {
            this.router.navigateByUrl('/home');
          }).catch((error) => console.log(error));
        }
      }, {
        text: 'עדיין לא'
      }]
    });
    alert.present();
  }

  async addSupport() {
    const alert = await this.alertController.create({
      header: 'הוספת נציג חדש',
      inputs: [
        {
          name: 'username',
          placeholder: 'שם הנציג'
        },
        {
          name: 'email',
          placeholder: 'אימייל'
        },
        {
          name: 'password',
          placeholder: 'סיסמא'
        },
        {
          name: 'phone',
          placeholder: 'טלפון'
        },
      ],
      buttons: [{
        text: 'בטל'
      },
      {
        text: 'הוסף',
        handler: data => { this.firestore.createSupportRep(data.username, data.email); }
      }]
    });
    alert.present();
  }

  readyForChat() {
    this.global.readyForChat();
  }

  scrollToElement(e): void {
    this.global.scrollToElement(e.target.value);
  }

  onClick(e): void {
    const targetId = e.target.id;
    console.log(targetId);
    const manageSupportReps = document.getElementById('Manage-SupportReps');
    const manageClientStories = document.getElementById('Manage-Client-Stories');
    const manageGallery = document.getElementById('Manage-Gallery');
    const editAssociationInfo = document.getElementById('Edit-Association-Info');
    const viewHistoryChat = document.getElementById('View-History-Chat');
    const manageClients = document.getElementById('Manage-Clients');
    const editEvents = document.getElementById('Edit-Events');

    // const calenderElement = document.getElementById('calender');
    if (targetId === 'ShowSupportRep') {
      manageSupportReps.hidden = false;
      manageClientStories.hidden = true;
      manageGallery.hidden = true;
      editAssociationInfo.hidden = true;
      viewHistoryChat.hidden = true;
      manageClients.hidden = true;
      editEvents.hidden = true;
    }
    else if (targetId === 'ShowClient') {
      manageSupportReps.hidden = true;
      manageClientStories.hidden = true;
      manageGallery.hidden = true;
      editAssociationInfo.hidden = true;
      viewHistoryChat.hidden = true;
      manageClients.hidden = false;
      editEvents.hidden = true;
    }
    else if (targetId === 'EditEvents') {
      manageSupportReps.hidden = true;
      manageClientStories.hidden = true;
      manageGallery.hidden = true;
      editAssociationInfo.hidden = true;
      viewHistoryChat.hidden = true;
      manageClients.hidden = true;
      editEvents.hidden = false;
    }
    else if (targetId === 'ViewHistoryChat') {
      manageSupportReps.hidden = true;
      manageClientStories.hidden = true;
      manageGallery.hidden = true;
      editAssociationInfo.hidden = true;
      viewHistoryChat.hidden = false;
      manageClients.hidden = true;
      editEvents.hidden = true;
    }
    else if (targetId === 'EditAssociationInfo') {
      manageSupportReps.hidden = true;
      manageClientStories.hidden = true;
      manageGallery.hidden = true;
      editAssociationInfo.hidden = false;
      viewHistoryChat.hidden = true;
      manageClients.hidden = true;
      editEvents.hidden = true;
    }
    else if (targetId === 'ManageGallery') {
      manageSupportReps.hidden = true;
      manageClientStories.hidden = true;
      manageGallery.hidden = false;
      editAssociationInfo.hidden = true;
      viewHistoryChat.hidden = true;
      manageClients.hidden = true;
      editEvents.hidden = true;
    }
    else {    //targetId === ManageClientStories
      manageSupportReps.hidden = true;
      manageClientStories.hidden = false;
      manageGallery.hidden = true;
      editAssociationInfo.hidden = true;
      viewHistoryChat.hidden = true;
      manageClients.hidden = true;
      editEvents.hidden = true;
    }
  }

}


