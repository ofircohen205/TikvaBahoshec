import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirestoreService } from '../firebase/firestore/firestore.service';
import { GlobalService } from '../global/global.service';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss'],
})


export class AdminProfileComponent implements OnInit {
    divToShow = '';
    list: any[] = [];
    file: File;
    uploadPercent: Observable<number>;
    downloadURL: Observable<string>;
 
    constructor(
    private alertController: AlertController,
    private router: Router,
    private userAuth: AngularFireAuth,
    private firestore: FirestoreService,
    private afStorage: AngularFireStorage,
    private global: GlobalService,
  ) { }

  ngOnInit() {
    this.list = [];
    this.firestore.getSupportRepIdList().subscribe(result => {
      result.forEach(ele => {
      const data = ele.payload.doc.data();
      const id = ele.payload.doc.id;
      if (ele.payload.type === 'added') {
      this.list.push({id, ...data}) ;
      } else if (ele.payload.type === 'modified') {
        const index = this.list.findIndex(item => item.id === id);

        // Replace the item by index.
        this.list.splice(index, 1, {id, ...data});
      } else {
        this.list.slice(this.list.indexOf(id), 1);
      }
       });

     });

    }

    addFile(event) {
      this.file = event.target.files[0];
      console.log(this.file);
    }


    uploadFile(){
      const filePath = 'images/' + this.file.name;
      const task = this.afStorage.upload(filePath, this.file);
      console.log(task);

      // observe percentage changes
      this.uploadPercent = task.percentageChanges();
      // get notified when the download URL is available
      task.snapshotChanges().pipe(
          finalize(() => console.log(this.file.name + "uploaded successfully") )
       )
      .subscribe()
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
        text: 'חזור'
      },
      {
        text: 'הוסף',
        handler: data => { this.firestore.createSupportRep(data.username, data.email, data.phone); }
      }]
    });
    alert.present();
  }

  async editSupport(x) {
    const alert = await this.alertController.create({
      header: 'הוספת נציג חדש',
      inputs: [
        {
          name: 'username',
          placeholder: x.name
        },
        {
          name: 'email',
          placeholder: x.email
        },

        {
          name: 'phone',
          placeholder: x.phone
        },
      ],
      buttons: [{
        text: 'חזור'
      },
      {
        text: 'שמור שינויים',
        handler: data => { this.firestore.updateSupportRep(x.id, data.username, data.email, data.phone); }
      }]
    });
    alert.present();
  }

  async deleteSupport(x) {
    const alert = await this.alertController.create({
      header: 'אישור מחיקה',
      message: `האם את/ה בטוח/ה שברצונך למחוק את הנציג/ה?`,
      buttons: [
        { text: 'חזור'},
        {
           text: 'מחק',
         handler: () => {
           this.firestore.removeSupportRep(x.id);
           this.list.splice(this.list.indexOf(x), 1); }
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
    } else if (targetId === 'ShowClient') {
      manageSupportReps.hidden = true;
      manageClientStories.hidden = true;
      manageGallery.hidden = true;
      editAssociationInfo.hidden = true;
      viewHistoryChat.hidden = true;
      manageClients.hidden = false;
      editEvents.hidden = true;
    } else if (targetId === 'EditEvents') {
      manageSupportReps.hidden = true;
      manageClientStories.hidden = true;
      manageGallery.hidden = true;
      editAssociationInfo.hidden = true;
      viewHistoryChat.hidden = true;
      manageClients.hidden = true;
      editEvents.hidden = false;
    } else if (targetId === 'ViewHistoryChat') {
      manageSupportReps.hidden = true;
      manageClientStories.hidden = true;
      manageGallery.hidden = true;
      editAssociationInfo.hidden = true;
      viewHistoryChat.hidden = false;
      manageClients.hidden = true;
      editEvents.hidden = true;
    } else if (targetId === 'EditAssociationInfo') {
      manageSupportReps.hidden = true;
      manageClientStories.hidden = true;
      manageGallery.hidden = true;
      editAssociationInfo.hidden = false;
      viewHistoryChat.hidden = true;
      manageClients.hidden = true;
      editEvents.hidden = true;
    } else if (targetId === 'ManageGallery') {
      manageSupportReps.hidden = true;
      manageClientStories.hidden = true;
      manageGallery.hidden = false;
      editAssociationInfo.hidden = true;
      viewHistoryChat.hidden = true;
      manageClients.hidden = true;
      editEvents.hidden = true;
    } else {    // targetId === ManageClientStories
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


