import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirestoreService } from '../firebase/firestore/firestore.service';
import { GlobalService } from '../global/global.service';
import { FormGroup, FormControl } from '@angular/forms';

import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService, QuickToolbarService } from '@syncfusion/ej2-angular-richtexteditor';


@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss'],

  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService, QuickToolbarService],
})


export class AdminProfileComponent implements OnInit {
  list = [];
  storiesArray: any = [];


  constructor(
    private alertController: AlertController,
    private router: Router,
    private userAuth: AngularFireAuth,
    private firestore: FirestoreService,
    private global: GlobalService
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

/*******************************************AdminProfile components performance******************************************************/
  //shows the component of the selected button
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
      this.manageStories();
    }
  }

  /*******************************************Stories Management*******************************************************************/
  manageStories() {
    this.firestore.getStoriesId().subscribe(results => {
      results.forEach(result => {
        const id = result.payload.doc.id;
        const data = result.payload.doc.data();
        const timestampDate = data['date']['seconds'];   //save the date as timestamp
        const stringDate = new Date(timestampDate * 1000).toDateString();  //save the date as a regular date form
        //const approval = data['approved'];

        this.storiesArray.push({stringDate, id, ...data });
        console.log(this.storiesArray);
      });

      this.storiesArray.sort((s1, s2) => {
        if (s1['date']['seconds'] > s2['date']['seconds']) {
          return 1;
        } else {
          return -1;
        }
      });
    });

  }

  //variables for the text editor
  public value: string =
  `<br/>
  כתוב על המקרה שלך כאן`

  public tools: object = {
    items: ['Undo', 'Redo', '|',
      'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
      /*'SubScript', 'SuperScript', '|',
      'LowerCase', 'UpperCase', '|',*/
      'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
      'Indent', 'Outdent', '|', 'CreateLink', 'CreateTable',
      'Image', '|', 'ClearFormat',/* 'Print',*/ 'SourceCode', '|', 'FullScreen']
  };
  public quickTools: object = {
    image: [
      'Replace', 'Align', 'Caption', 'Remove', 'InsertLink', '-', 'Display', 'AltText', 'Dimension']
  };


  editStory(story) {
    document.getElementById('save-edit').hidden = false;
    document.getElementById('defaultRTE').hidden = false;
    document.getElementById('defaultRTE').className = story.id;
    for (let i = 0; i < this.storiesArray.length; i++) {
      if (story.id === this.storiesArray[i].id)
      {
        this.value = this.storiesArray[i].description;  //edit the story
      }
    }
  }

//delete the story from firebase and from the array of stories
  deleteStory(story){
    for (let i = 0; i < this.storiesArray.length; i++) {
        if (story.id === this.storiesArray[i].id){
          for (let j = i+1; j < this.storiesArray.length; j++) {  //the remove from the array doesn't work well
              this.storiesArray[j-1] = this.storiesArray[j];
              this.storiesArray[j] = null;
          }
          this.firestore.removeStory(this.storiesArray[i].id);
        }
    }
  }

  //to confirm the story can be uploaded to the website
  confirmStory(story) {
    for (let i = 0; i < this.storiesArray.length; i++) {
      if (story.id === this.storiesArray[i].id){
        this.storiesArray[i].approved = true;
        this.firestore.confirmStory(this.storiesArray[i].id, true);
      }
    } 
  }

  //after the story was edited, we save the changes in it
  acceptStoryChange() {
    let storyId = document.getElementById('defaultRTE').className, areEquals : number;
    for (let i = 0; i < this.storiesArray.length; i++) {
      areEquals = this.strcmp(storyId, i);
      if (areEquals === 0){
        this.storiesArray[i].description = this.value;
        this.firestore.editStory(this.storiesArray[i].id, this.value);
        break;
      }
    }
    alert("יש ללחוץ בטבלה על הכפתור 'אשר' עבור העדות הרצויה");
    document.getElementById('defaultRTE').hidden = true;
    document.getElementById('save-edit').hidden = true;
  }

  //compare 2 strings
  private strcmp(storyId, i){         
    for (let j=0,n=20; j < n; j++){
      if (storyId.toString().charAt(j) !== this.storiesArray[i].id.toString().charAt(j))
        return -1;
    }
    return 0;
  }
/*********************************************************************************************************************************/

}
