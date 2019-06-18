import { Component, OnInit, ViewChild, ApplicationRef, OnDestroy } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirestoreService } from '../firebase/firestore/firestore.service';
import { GlobalService } from '../global/global.service';
import { FormGroup, FormControl } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
// tslint:disable-next-line: max-line-length
import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService, QuickToolbarService } from '@syncfusion/ej2-angular-richtexteditor';
import { Observable } from 'rxjs';
import { finalize, findIndex, timestamp, filter } from 'rxjs/operators';
import { forEach } from '@angular/router/src/utils/collection';
import { createElement } from '@syncfusion/ej2-base';
import { Location } from '@angular/common';
import { ValueAccessor } from '@ionic/angular/dist/directives/control-value-accessors/value-accessor';
import { getName } from 'ionicons/dist/types/icon/utils';
import * as firebase from 'firebase';
import { text, element } from '@angular/core/src/render3';
import { Title } from '@angular/platform-browser';
import { StoryComponent } from '../story/story.component';



@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss'],

  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService, QuickToolbarService],
})


export class AdminProfileComponent implements OnInit, OnDestroy {

  constructor(
    private alertController: AlertController,
    private router: Router,
    private userAuth: AngularFireAuth,
    private firestore: FirestoreService,
    private location: Location,
    private afs: AngularFireStorage,
    private global: GlobalService,
    private appRef: ApplicationRef
  ) { }

  // Subscribe variables
  support_rep_list_subscribe;
  all_chat_room_subscribe;
  image_array_subscribe;
  association_subscribe;
  events_subscribe;
  stories_subscribe;


  // Variables
  chatRoomHistory: any[] = [];
  imageUrls: string[] = [];
  list: any[] = [];
  storiesArray: any = [];
  file: File;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  supportRepList: any[] = [];
  chatRoomList: any[] = [];
  clientList: any[] = [];
  txtMsg = '';
  filterText = '';
  supportRepHistory: any[] = [];
  sortArrowStatusTable: boolean[] = [true, true, true, true];

  @ViewChild('eventitle') event_title;
  @ViewChild('eventDate') event_date;
  event_filter = '';
  event_content: string = null;
  is_new_event_flag: boolean;
  eventsArray: any[] = [];
  event_to_change: any;
  association_info: string;
  template_value: string;

  @ViewChild('title') title;
  story_filter = '';
  story_search = '';
  private curr_story_edit_id: string;
  // variables for the text editor
  // tslint:disable-next-line: member-ordering
  public value =
    `<br/>
  כתוב על המקרה שלך כאן`;

  public tools: object = {
    items: ['Undo', 'Redo', '|',
      'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
      /*'SubScript', 'SuperScript', '|',
      'LowerCase', 'UpperCase', '|',*/
      'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
      'Indent', 'Outdent', '|', 'CreateLink', 'CreateTable',
      'Image', '|', 'ClearFormat', /* 'Print',*/ 'SourceCode', '|', 'FullScreen']
  };
  public quickTools: object = {
    image: [
      'Replace', 'Align', 'Caption', 'Remove', 'InsertLink', '-', 'Display', 'AltText', 'Dimension']
  };

  ngOnInit() {
    this.support_rep_list_subscribe = this.firestore.getSupportRepNameList().subscribe(result => {
      this.supportRepList = result;
      this.initSupportSelectList();
    });
    this.all_chat_room_subscribe = this.firestore.getAllChatRoom().subscribe(result1 => {
      this.chatRoomList = result1;
      this.createHistoryTable();
    });
    this.image_array_subscribe = this.firestore.getImageArray().subscribe(res => {
      this.imageUrls = res.images;
    });

    this.association_subscribe = this.firestore.getAssociationInfo().subscribe(result => {
      this.association_info = result.info;
    });

    this.events_subscribe = this.firestore.getEvents().subscribe(result => {
      this.eventsArray = result;
    });

    this.manageStories();
    this.manageSupportReps();
  }


  initSupportSelectList() {
    var selectElement = document.getElementById('historySupportSelect');
    this.supportRepList.forEach(supportRep => {
      if (supportRep !== undefined) {
        var selection = document.createElement('ion-select-option');
        selection.value = supportRep['first_name'] + ' ' + supportRep['last_name'] ;
        selection.textContent = supportRep['first_name'] + ' ' + supportRep['last_name'] ;
        selectElement.appendChild(selection);
      }
    });
  }


  createHistoryTable() {
    var toDate = (<HTMLInputElement>document.getElementById('historyToDate1')).value;
    var fromDate = (<HTMLInputElement>document.getElementById('historyFromDate2')).value;
    var statusSelect: any = (<HTMLInputElement>document.getElementById('historyStatusSelect')).value;
    var supportRepSelect = (<HTMLInputElement>document.getElementById('historySupportSelect')).value;
    var clientName = (<HTMLInputElement>document.getElementById('historyClientName')).value;
    var chatRoomList: any[];
    var body = document.getElementById('historyBodyTable');
    this.removeChildren(body, 'historyBodyTable');
    var dateFrom;
    var dateTo;

    if (fromDate !== '') {
      dateFrom = new Date(fromDate).toLocaleDateString();
    } else {
      dateFrom = '';
    }

    if (toDate !== '') {
      dateTo = new Date(toDate).toLocaleDateString();
    } else {
      dateTo = '';
    }
    var compareStatus;
    var compareSupport;
    var index = 1;

    index = 1;
    for (let chatRoom of this.chatRoomList) {
      var tr = document.createElement('tr');
      if (chatRoom !== undefined) {
        var date = new Date(chatRoom['timestamp']).toLocaleDateString();
        for (let v of statusSelect) {
          if ((v === 'בטיפול' && chatRoom['occupied'] === true) || (v === 'לא בטיפול' && chatRoom['occupied'] === false)) {
            compareStatus = true;
            break;
          } else {
            compareStatus = false;
          }
        }
        for (let v of supportRepSelect) {
          if (v === chatRoom['SupportRepName']) {
            compareSupport = true;
            break;
          } else {
            compareSupport = false;
          }
        }

        if ((date >= dateFrom || dateFrom === '') && (date <= dateTo || dateTo === '') &&
          (compareStatus || statusSelect.length === 0) && (compareSupport || supportRepSelect.length === 0) &&
          (chatRoom['ClientName'].search(clientName) != -1 || clientName === '')) {

          var td1 = document.createElement('td');
          td1.style.border = ' 1px solid #ddd';
          td1.style.padding = '8px';
          td1.style.borderCollapse = 'collapse';
          td1.textContent = index.toString();

          var td2 = document.createElement('td');
          td2.style.border = ' 1px solid #ddd';
          td2.style.padding = '8px';
          td2.style.borderCollapse = 'collapse';
          td2.textContent = chatRoom.ClientName;

          var td3 = document.createElement('td');
          td3.style.border = ' 1px solid #ddd';
          td3.style.padding = '8px';
          td3.style.borderCollapse = 'collapse';
          td3.textContent = new Date(chatRoom.timestamp).toLocaleString();

          var td4 = document.createElement('td');
          var name = '';
          td4.style.border = ' 1px solid #ddd';
          td4.style.padding = '8px';
          td4.style.borderCollapse = 'collapse';
          if (chatRoom.SupportRepName !== '' && chatRoom.SupportRepName != null) {
            td4.textContent = chatRoom.SupportRepName;
          } else {
            td4.textContent = 'no support name';
          }

          var td5 = document.createElement('td');
          td5.style.border = ' 1px solid #ddd';
          td5.style.padding = '8px';
          td5.style.borderCollapse = 'collapse';
          if (chatRoom.occupied === true) {
            td5.textContent = 'בטיפול';
          } else {
            td5.textContent = 'לא בטיפול';
          }

          var button1 = document.createElement('ion-button');
          var td6 = document.createElement('td');
          td6.appendChild(button1);
          td6.id = 'adminHistoryTablebutton1_' + index;
          button1.innerHTML = 'כנס לטופס לקוח';
          button1.color = 'success';
          td6.style.color = 'white';
          td6.style.border = ' 1px solid #ddd';
          td6.style.padding = '8px';
          td6.style.borderCollapse = 'collapse';

          var button2 = document.createElement('ion-button');
          var td7 = document.createElement('td');
          td7.appendChild(button2);
          td7.id = 'adminHistoryTablebutton2_' + index;
          button2.innerHTML = 'כנס לחדר';
          button2.color = 'success';
          td7.style.color = 'white';
          td7.style.border = ' 1px solid #ddd';
          td7.style.padding = '8px';
          td7.style.borderCollapse = 'collapse';

          var button3 = document.createElement('ion-button');
          var td8 = document.createElement('td');
          td8.appendChild(button3);
          td8.id = 'adminHistoryTablebutton3_' + index;
          button3.innerHTML = 'הורד שיחה';
          button3.color = 'success';
          td8.style.color = 'white';
          td8.style.border = ' 1px solid #ddd';
          td8.style.padding = '8px';
          td8.style.borderCollapse = 'collapse';

          tr.appendChild(td1);
          tr.appendChild(td2);
          tr.appendChild(td3);
          tr.appendChild(td4);
          tr.appendChild(td5);
          tr.appendChild(td6);
          tr.appendChild(td7);
          tr.appendChild(td8);

          tr.id = 'adminHistoryTableTr_' + index;
          index++;
          body.appendChild(tr);
        }
      }
    }
    var tbodyChildrens = body.childNodes;
    for (let i = 0; i < body.childNodes.length; i++) {
      tbodyChildrens[i].addEventListener('mouseover', () => this.onmouseover(tbodyChildrens[i]));
      tbodyChildrens[i].addEventListener('mouseout', () => this.onmouseout(tbodyChildrens[i]));
      var trChildren = tbodyChildrens[i].childNodes;
      // tslint:disable-next-line: max-line-length
      trChildren[trChildren.length - 1].addEventListener('click', () => this.onclickAdminHistoryTable(tbodyChildrens[i].childNodes[trChildren.length - 1], i));
      // tslint:disable-next-line: max-line-length
      trChildren[trChildren.length - 2].addEventListener('click', () => this.onclickAdminHistoryTable(tbodyChildrens[i].childNodes[trChildren.length - 2], i));
      // tslint:disable-next-line: max-line-length
      trChildren[trChildren.length - 3].addEventListener('click', () => this.onclickAdminHistoryTable(tbodyChildrens[i].childNodes[trChildren.length - 3], i));
    }
  }

  async removeChildren(tbody, tbodyId) {
    var size = tbody.childNodes.length;
    var tbody1 = document.getElementById(tbodyId);
    while (tbody1.firstChild) {
      tbody1.removeChild(tbody1.firstChild);
    }
  }

  sortByDate(dateStatus, index, id, list, table) {
    var nameBtn = (<HTMLButtonElement>document.getElementById(id));
    if (dateStatus[index] === true) {
      list.sort((a, b) => (a.timestamp >= b.timestamp) ? 1 : -1)
      dateStatus[index] = false;
      nameBtn.innerHTML = '&#8657;שעת פתיחת חדר';
    } else {
      list.sort((a, b) => (a.timestamp <= b.timestamp) ? 1 : -1);
      dateStatus[index] = true;
      nameBtn.innerHTML = '&#8659;שעת פתיחת חדר';

    }

    if (table === 'historyTable') {
      this.createHistoryTable();
    }
  }


  sortByClient(nameStatus, index, id, list, table) {
    var nameBtn = (<HTMLButtonElement>document.getElementById(id));
    if (nameStatus[index] == true) {
      list.sort((a, b) => (a.ClientName >= b.ClientName) ? 1 : -1);
      nameStatus[index] = false;
      nameBtn.innerHTML = '&#8657; שם הלקוח'
    } else {
      list.sort((a, b) => (a.ClientName <= b.ClientName) ? 1 : -1)
      nameStatus[index] = true;
      nameBtn.innerHTML = '&#8659; שם הלקוח'
    }

    if (table === 'historyTable') {
      this.createHistoryTable();
    }

  }

  sortBySupportRep(nameStatus, index, id, list, table) {
    var nameBtn = (<HTMLButtonElement>document.getElementById(id));
    if (nameStatus[index] == true) {
      list.sort((a, b) => (a.SupportRepName >= b.SupportRepName) ? 1 : -1)
      nameStatus[index] = false
      nameBtn.innerHTML = '&#8657; שם הנציג בשיחה'
    } else {
      list.sort((a, b) => (a.SupportRepName <= b.SupportRepName) ? 1 : -1)
      nameStatus[index] = true;
      nameBtn.innerHTML = '&#8659; שם הנציג בשיחה'
    }

    if (table === 'historyTable') {
      this.createHistoryTable();
    }

  }


  sortByOpenRoomState(stateStatus, index, id, list, table) {
    var stateBtn = (<HTMLButtonElement>document.getElementById(id));
    if (stateStatus[index] === true) {
      list.sort((a, b) => a.open - b.open)
      stateStatus[index] = false;
      stateBtn.innerHTML = '&#8657; מצב החדר'
    } else {
      list.sort((a, b) => b.open - a.open)
      stateStatus[index] = true;
      stateBtn.innerHTML = '&#8659; מצב החדר';
    }

    if (table === 'historyTable') {
      this.createHistoryTable();
    }

  }


  sortByOccupiedState(stateStatus, index, id, list, table) {
    var stateBtn = (<HTMLButtonElement>document.getElementById(id));
    if (stateStatus[index] === true) {
      list.sort((a, b) => a.occupied - b.occupied)
      stateStatus[index] = false;
      stateBtn.innerHTML = '&#8657; מצב החדר'
    } else {
      list.sort((a, b) => b.occupied - a.occupied)
      stateStatus[index] = true;
      stateBtn.innerHTML = '&#8659; מצב החדר';
    }

    if (table === 'historyTable') {
      this.createHistoryTable();
    }

  }

  resetHistoryTableFileds() {
    var toDate = document.getElementById('historyToDate1');
    var fromDate = document.getElementById('historyFromDate2');
    var statusSelect: any = document.getElementById('historyStatusSelect');
    var supportRepSelect = document.getElementById('historySupportSelect');
    var clientName = document.getElementById('historyClientName');
    (<HTMLInputElement>(toDate)).value = '';
    (<HTMLInputElement>(fromDate)).value = '';
    (<HTMLInputElement>(statusSelect)).value = '';
    (<HTMLInputElement>(supportRepSelect)).value = '';
    (<HTMLInputElement>(clientName)).value = '';
  }

  adminHistoryLimitMinDate() {
    var dateFrom = (<HTMLInputElement>document.getElementById('historyFromDate2')).value;
    var dateTo = document.getElementById('historyToDate1');
    dateTo.setAttribute("min", dateFrom);
  }
  adminHistoryLimitMaxDate() {
    var dateTo = (<HTMLInputElement>document.getElementById('historyToDate1')).value;
    var dateFrom = document.getElementById('historyFromDate2');
    dateFrom.setAttribute("max", dateTo);
  }

  onclickAdminHistoryTable(e, index) {
    if (e['id'] === 'adminHistoryTablebutton3_' + (index + 1)) {
      console.log('hi');
      // this.downloadChatMsg(this.chatRoomList[index]['ChatRoomId']);
    }
    if (e['id'] === 'adminHistoryTablebutton2_' + (index + 1)) {
      console.log('hi');
      // tslint:disable-next-line: max-line-length
      // window.open('/chat/' + this.chatRoomList[index]['ChatRoomId'], '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
    }
    if (e['id'] === 'adminHistoryTablebutton1_' + (index + 1)) {
      // tslint:disable-next-line: max-line-length
      window.open('/client-profile/' + this.chatRoomList[index]['ClientID'], '_blank', 'location=yes,height=700,width=1000,scrollbars=yes,status=yes');
    }
  }

  downloadChatMsg(roomId) {
    this.firestore.getChatMessages(roomId).subscribe(result => {
      result.forEach(msg => {
        this.txtMsg += "From:" + msg.from + " Time:" + new Date(msg.timestamp)
        this.txtMsg += "\n<" + msg.content + ">\n\n"
      })
      console.log('startDownload')
      var link = document.createElement('a');
      link.download = 'Chat:' + roomId + '.txt';
      var blob = new Blob([this.txtMsg], { type: 'text/plain' });
      link.href = window.URL.createObjectURL(blob);
      link.click();
    });
  }

  onmouseover(e) {
    e.style.background = '#ddd';
  }
  onmouseout(e) {
    e.style.background = 'white';
  }

  logout() {
    this.global.logout();
  }


  manageSupportReps() {
    this.firestore.getSupportRepIdList().subscribe(result => {
      result.forEach(ele => {
        const data = ele.payload.doc.data();
        const id = ele.payload.doc.id;
        data.SupportRepID = id;
        if (ele.payload.type === 'added') {
          this.list.push(data);
        } else if (ele.payload.type === 'modified') {
          const index = this.list.findIndex(item => item.SupportRepID === id);
          // Replace the item by index.
          this.list.splice(index, 1, data);
        } else {
          this.list.slice(this.list.indexOf(id), 1);
        }
        // console.log(result);
      });
    });
  }

  showHistory(x) {
    document.getElementById('chat-list').hidden = false;
    this.firestore.getAllChatRoom().subscribe(res => {
      this.supportRepHistory = res.filter(ele => ele.SupportRepID === x.SupportRepID);
    });
    document.getElementById('histTable').scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }

  addSupport() {
    window.open('/support-rep/', '_blank', 'location=yes,height=700,width=1000,scrollbars=yes,status=yes');
  }

  editSupport(x) {
    window.open('/support-rep/' + x['SupportRepID'], '_blank', 'location=yes,height=700,width=1000,scrollbars=yes,status=yes');

  }

  async deleteSupport(x) {
    const alert = await this.alertController.create({
      header: 'אישור מחיקה',
      message: `האם את/ה בטוח/ה שברצונך למחוק את הנציג/ה?`,
      buttons: [
        { text: 'חזור' },
        {
          text: 'מחק',
          handler: () => {
            this.firestore.removeSupportRep(x.SupportRepID);
            this.list.splice(this.list.indexOf(x), 1);
          }
        }]
    });
    alert.present();
  }


  /*******************************************AdminProfile components performance******************************************************/
  // shows the component of the selected button
  onClick(e): void {
    const targetId = e.target.id;
    const manageSupportReps = document.getElementById('Manage-SupportReps');
    const manageClientStories = document.getElementById('Manage-Client-Stories');
    const manageGallery = document.getElementById('Manage-Gallery');
    const editAssociationInfo = document.getElementById('Edit-Association-Info');
    const viewHistoryClients = document.getElementById('View-History-Clients');
    const editEvents = document.getElementById('Edit-Events');

    // const calenderElement = document.getElementById('calender');
    if (targetId === 'ShowSupportRep') {
      manageSupportReps.hidden = false;
      manageClientStories.hidden = true;
      manageGallery.hidden = true;
      editAssociationInfo.hidden = true;
      viewHistoryClients.hidden = true;
      editEvents.hidden = true;
      document.getElementById('chat-list').hidden = true;
      // this.manageSupportReps();
    } else if (targetId === 'EditEvents') {
      manageSupportReps.hidden = true;
      manageClientStories.hidden = true;
      manageGallery.hidden = true;
      editAssociationInfo.hidden = true;
      viewHistoryClients.hidden = true;
      editEvents.hidden = false;
    } else if (targetId === 'ViewHistoryClients') {
      manageSupportReps.hidden = true;
      manageClientStories.hidden = true;
      manageGallery.hidden = true;
      editAssociationInfo.hidden = true;
      viewHistoryClients.hidden = false;
      editEvents.hidden = true;
    } else if (targetId === 'EditAssociationInfo') {
      manageSupportReps.hidden = true;
      manageClientStories.hidden = true;
      manageGallery.hidden = true;
      editAssociationInfo.hidden = false;
      viewHistoryClients.hidden = true;
      editEvents.hidden = true;
    } else if (targetId === 'ManageGallery') {
      manageSupportReps.hidden = true;
      manageClientStories.hidden = true;
      manageGallery.hidden = false;
      editAssociationInfo.hidden = true;
      viewHistoryClients.hidden = true;
      editEvents.hidden = true;
    } else {    // targetId === ManageClientStories
      manageSupportReps.hidden = true;
      manageClientStories.hidden = false;
      manageGallery.hidden = true;
      editAssociationInfo.hidden = true;
      viewHistoryClients.hidden = true;
      editEvents.hidden = true;
    }
  }

  /*******************************************Stories Management*******************************************************************/
  manageStories() {
    this.stories_subscribe = this.firestore.getStoriesId().subscribe(results => {
      results.forEach(result => {
        const id = result.payload.doc.id;
        const data = result.payload.doc.data();
        const timestampDate = data['date']['seconds'];   // save the date as timestamp
        const stringDate = new Date(timestampDate * 1000).toDateString();  // save the date as a regular date form
        if (result.payload.type === 'added') {
          this.storiesArray.push({ stringDate, id, ...data });
        } else if (result.payload.type === 'modified') {
          const index = this.storiesArray.findIndex(item => item.id === id);
          // Replace the item in index with the new object.
          this.storiesArray.splice(index, 1, { stringDate, id, ...data });
        } else { // (result.payload.type === 'removed')
          this.storiesArray.slice(this.storiesArray.indexOf(id), 1);
        }
      });

      this.storiesArray.sort((s1, s2) => {
        if (s1.timestampDate > s2.timestampDate) {
          return 1;
        } else {
          return -1;
        }
      });
    });
  }

  // edit the story. replace the old content of the story with the new content
  editStory(story) {
    document.getElementById('editor').hidden = false;
    document.getElementById('template-editor').hidden = true;
    this.curr_story_edit_id = story.id;
    for (let i = 0; i < this.storiesArray.length; i++) {
      if (this.strcmp(story.id, i) === 0) {
        this.value = this.storiesArray[i].description;  // edit the story
        this.title.value = this.storiesArray[i].title;

        document.getElementById('editor').scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });

        break;
      }
    }
  }

  editTemplate() {
    document.getElementById('template-editor').hidden = false;
    document.getElementById('editor').hidden = true;
    this.firestore.getStoryTemplate().subscribe(result => {
      this.template_value = result.storyTemplate;
    });
  
    document.getElementById('template-editor').scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }

  async acceptTemplateChange() {
    document.getElementById('template-editor').hidden = true;
    this.firestore.updateStoryTemplate(this.template_value);

    const alert = await this.alertController.create({
      message: 'שינוי הטמפלייט בוצע בהצלחה!',
      buttons: ['המשך']
    });
    alert.present();
  }

  // delete the story from firebase and from the array of stories
  async deleteStory(story) {
    const alert = await this.alertController.create({
      header: 'אישור מחיקה',
      message: `האם את/ה בטוח/ה שברצונך למחוק את העדות?`,
      buttons: [
        { text: 'חזור' },
        {
          text: 'מחק',
          handler: () => {
            this.firestore.removeStory(story.id);
            this.storiesArray.splice(this.storiesArray.indexOf(story), 1);
            document.getElementById('editor').hidden = true;
          }
        }]
    });
    alert.present();
  }


  // to confirm the story can be uploaded to the website
  async confirmStory(story) {
    const alert = await this.alertController.create({
      header: 'אישור עדות',
      message: `האם את/ה בטוח/ה שברצונך לאשר את העדות? שים לב כי אישור העדות יעלה אותה אוטומטית לאתר`,
      buttons: [
        { text: 'חזור' },
        {
          text: 'אשר',
          handler: () => {
            for (let i = 0; i < this.storiesArray.length; i++) {
              if (this.strcmp(story.id, i) === 0) {
                this.storiesArray[i].approved = true;
                this.firestore.confirmStory(this.storiesArray[i].id, true);
              }
            }
          }
        }]
    });
    alert.present();
  }

  // after the story was edited, we save the changes in it
  async acceptStoryChange() {
    const storyId = this.curr_story_edit_id;
    let areEquals: number;
    for (let i = 0; i < this.storiesArray.length; i++) {
      areEquals = this.strcmp(storyId, i);
      if (areEquals === 0) {
        this.storiesArray[i].description = this.value;
        this.firestore.editStory(this.storiesArray[i].id, this.value);
        this.storiesArray[i].title = this.title.value;
        this.firestore.editStoryTitle(this.storiesArray[i].id, this.title.value);
        this.curr_story_edit_id = null;
        break;
      }
    }
    const alert = await this.alertController.create({
      message: 'יש ללחוץ "אשר" עבור העדות הרצויה, במידה והעדות עדיין לא אושרה',
      buttons: ['המשך']
    });
    alert.present();
    document.getElementById('editor').hidden = true;
  }

  // compare 2 strings
  private strcmp(storyId, i) {
    for (let j = 0, n = 20; j < n; j++) {
      if (storyId.toString().charAt(j) !== this.storiesArray[i].id.toString().charAt(j)) {
        return -1;
      }
    }
    return 0;
  }


  /*********************************************************************************************************************************/

  /*******************************************Gallery Management*******************************************************************/

  deleteFile(img) {
    const storageRef = this.afs.storage.refFromURL(img);
    storageRef.delete().then(() => {
      this.imageUrls.splice(this.imageUrls.indexOf(img), 1);
      this.firestore.updateImageArray(this.imageUrls);
    }
    );
  }

  addFile(event) {
    this.file = event.target.files[0];
    const fileName = this.file.name;
// tslint:disable-next-line: max-line-length
    if (!(fileName.includes('.jpg') || fileName.includes('.jpeg') || fileName.includes('.png') || fileName.includes('.JPG') || fileName.includes('.JPEG') || fileName.includes('.PNG'))) {
      this.global.invalidImage();
      return;
  }
  const filePath = 'assets/images/' + fileName;
    const task = this.afs.upload(filePath, this.file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    task.snapshotChanges().pipe(finalize(() => {
      this.getFile(filePath);
    })).subscribe();
}

  uploadFile() {
    const fileName = this.file.name;
    // tslint:disable-next-line: max-line-length
    if (!(fileName.includes('.jpg') || fileName.includes('.jpeg') || fileName.includes('.png') || fileName.includes('.JPG') || fileName.includes('.JPEG') || fileName.includes('.PNG'))) {
      this.global.invalidImage();
      return;
    }
    const filePath = 'assets/images/' + fileName;
    const task = this.afs.upload(filePath, this.file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    task.snapshotChanges().pipe(finalize(() => {
      this.getFile(filePath);
    })).subscribe();

  }

  getFile(filePath) {
    const storageRef = this.afs.ref(filePath);
    storageRef.getDownloadURL().subscribe(res => {
      this.imageUrls.push(res);
      this.firestore.updateImageArray(this.imageUrls);
    });
  }


  /*************************************************************************************************************************************/

  /**********************************************Association-Info Management************************************************************/

  async saveInfoEdit() {
    const alert = await this.alertController.create({
      header: 'אישור עריכת אודות העמותה',
      message: `האם את/ה בטוח/ה שברצונך לאשר את עריכת אודות העמותה? דע/י כי אישור העריכה יעדכן את האודות אוטומטית באתר`,
      buttons: [
        { text: 'חזור' },
        {
          text: 'אשר',
          handler: () => {
            this.firestore.updateAssociationInfo(this.association_info);
          }
        }]
    });
    alert.present();
  }

  /*************************************************************************************************************************************/
  /************************************************Events Management********************************************************************/

  addEventDetails() {
    document.getElementById('events-input').hidden = false;
    this.event_title.value = null;
    this.event_date.value = null;
    this.event_content = null;
    this.is_new_event_flag = true;
    document.getElementById('events-input').scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }


  async saveEvent() {
    if (this.is_new_event_flag === true) {
      this.firestore.createEvent(this.event_title.value, this.event_date.value, this.event_content);
      const alert = await this.alertController.create({
        message: 'האירוע נוסף בהצלחה',
        buttons: ['המשך']
      });
      alert.present();
    } else {  // this.is_new_event_flag === false
      this.firestore.editEvent(this.event_to_change.id, this.event_title.value, this.event_date.value, this.event_content);
      const alert = await this.alertController.create({
        message: 'האירוע שונה בהצלחה',
        buttons: ['המשך']
      });
      alert.present();
    }
  }


  editEvent(event) {
    document.getElementById('events-input').hidden = false;
    this.event_title.value = event.title;
    this.event_date.value = event.date;
    this.event_content = event.description;
    this.is_new_event_flag = false;
    this.event_to_change = event;
    document.getElementById('events-input').scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }


  async deleteEvent(event) {
    const alert = await this.alertController.create({
      header: 'אישור מחיקה',
      message: `האם את/ה בטוח/ה שברצונך למחוק את האירוע?`,
      buttons: [
        { text: 'חזור' },
        {
          text: 'מחק',
          handler: () => {
            this.firestore.removeEvent(event.id);
            document.getElementById('events-input').hidden = true;
          }
        }]
    });
    alert.present();
  }

  // async searchEvent() {
  //   let line = -1;
  //   for (let i = 0; i < this.eventsArray.length; i++) {
  //     if (this.eventsArray[i].title === this.event_search) {
  //       line = i; // line in the table
  //       document.getElementById(this.eventsArray[line].id).scrollIntoView({
  //         behavior: 'smooth',
  //         block: 'center'
  //       });

  //       document.getElementById(this.eventsArray[line].id).style.background = '#ffd78e';

  //       // after marking the needed line' paint the background back to it's normal color
  //       let background;
  //       if (line % 2 === 0) {
  //         background = 'white';
  //       } else {
  //         background = '#f2f2f2';
  //       }

  //       setTimeout(() => {
  //         document.getElementById(this.eventsArray[line].id).style.background = background;
  //       }, 3000);
  //       break;
  //     }
  //   }
  //   if (line === -1) {
  //     const alert = await this.alertController.create({
  //       message: 'האירוע שחיפשת לא נמצא',
  //       buttons: ['המשך']
  //     });
  //     alert.present();
  //   }
  // }


  ngOnDestroy() {
    this.events_subscribe.unsubscribe();
    this.support_rep_list_subscribe.unsubscribe();
    this.all_chat_room_subscribe.unsubscribe();
    this.image_array_subscribe.unsubscribe();
    this.association_subscribe.unsubscribe();
    this.stories_subscribe.unsubscribe();
  }

} // end of AdminProfileComponent
