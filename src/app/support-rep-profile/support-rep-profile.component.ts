import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirestoreService } from '../firebase/firestore/firestore.service';
import { GlobalService } from '../global/global.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { first } from 'rxjs/operators';


@Component({
  selector: 'app-support-rep-profile',
  templateUrl: './support-rep-profile.component.html',
  styleUrls: ['./support-rep-profile.component.scss']
})

export class SupportRepProfileComponent implements OnInit {
  chatReadyStatus = false;
  openChatList: any = [];
  supportRepOpenChatList: any = [];
  rooms: any[] = [];
  myChats: any [];
  sortArrowStatusTable1: boolean[] = [false, false, false, false] ;
  sortArrowStatusTable2: boolean[] = [false, false] ;
  sortArrowStatusTable3: boolean[] = [false, false, false] ;
  dateStatus = true;
  nameStatus = true;
  stateStatus = true;
  myChatsCopy = [];
  txtMsg = '';
  firstIntrance = false;
  supportRepInShift  ;
  get_Support_Rep_Name_subscribe;
  get_Open_Chat_Rooms_subscribe;
  get_Support_Rep_Open_Chat_Rooms_subscribe;
  get_Own_Chats_subscribe;

  constructor(
    private alertController: AlertController,
    private router: Router,
    private userAuth: AngularFireAuth,
    private firestore: FirestoreService,
    private global: GlobalService
  ) { }


  ngOnInit() {
    this.get_Support_Rep_Name_subscribe = this.firestore.getSupportRepName(this.userAuth.auth.currentUser.uid).subscribe(result1 => {
      this.supportRepInShift = result1['inShift'];
    this.get_Open_Chat_Rooms_subscribe = this.firestore.getOpenChatRooms().subscribe(result2 => {
        this.openChatList = result2;
        this.createTable1(document.getElementById('supRepTBody1'), this.openChatList);

    });
  });
    this. get_Support_Rep_Open_Chat_Rooms_subscribe = this.firestore.getSupportRepOpenChatRooms(this.userAuth.auth.currentUser.uid).subscribe(result => {
      this.supportRepOpenChatList = result;
      this.createTable2(document.getElementById('supRepTBody2'), this.supportRepOpenChatList);
    });

    this.get_Own_Chats_subscribe = this.firestore.getOwnChats(this.userAuth.auth.currentUser.uid).subscribe(result => {
      this.myChats = result;
      this.myChatsCopy = result;
      const scroll = document.getElementById('scrollbar3');
      if (this.myChats.length >= 4) {
        scroll.style.height = '300px';
      } else {
        scroll.style.height = '200px';
      }
  });

  }

  scrollToElement(e): void {
    this.global.scrollToElement(e);
  }

  async  createTable1(tbody, list: any[]) 
  {
    var tbodyChildrens = tbody.childNodes;
    const scrollbar1 = document.getElementById('scrollbar1');
    if (list.length >= 4) {
      scrollbar1.style.height = '300px';
    } else {
      scrollbar1.style.height = '200px';
    }
    this.removeChildren(tbody, 'supRepTBody1');
    let index = 1;
    for (const v of list) {
      const tr = document.createElement('tr');

      const td1 = document.createElement('td');
      td1.style.border = ' 1px solid #ddd';
      td1.style.padding = '8px';
      td1.style.borderCollapse = 'collapse';
      td1.textContent = index.toString();

      const td2 = document.createElement('td');
      td2.style.border = ' 1px solid #ddd';
      td2.style.padding = '8px';
      td2.style.borderCollapse = 'collapse';
      // this.firestore.getSupportRepName(v.SupportRepID)
      td2.textContent = v.ClientName;

      const td3 = document.createElement('td');
      td3.style.border = ' 1px solid #ddd';
      td3.style.padding = '8px';
      td3.style.borderCollapse = 'collapse';
      td3.textContent = new Date(v.timestamp).toLocaleString();

      const td4 = document.createElement('td');
      const name = '';
      td4.style.border = ' 1px solid #ddd';
      td4.style.padding = '8px';
      td4.style.borderCollapse = 'collapse';
      if (v.SupportRepName !== '' && v.SupportRepName != null) {
        td4.textContent = v.SupportRepName;
      } else {
       // console.log('kaka2');
        td4.textContent = '';
      }

      const td5 = document.createElement('td');
      td5.style.border = ' 1px solid #ddd';
      td5.style.padding = '8px';
      td5.style.borderCollapse = 'collapse';
      if (v.occupied === true) {
        td5.textContent = 'בטיפול';
      } else {
        td5.textContent = 'לא בטיפול';
      }

      const button = document.createElement('ion-button');
      const td6 = document.createElement('td');
      td6.appendChild(button);
      td6.id = 'supRepTable1button_' + index;
      td6.style.textAlign = 'center';
      button.innerHTML = 'שיחה מחכה לנציג';
      button.color = 'success';
      if(!this.supportRepInShift){
        button.setAttribute('disabled', 'true');
      }
      if (v.occupied === true) {
        button.setAttribute('disabled', 'true');
        button.innerHTML = 'שיחה בטיפול';
        button.color = 'danger';
      }
      td6.style.color = 'white';
      td6.style.border = ' 1px solid #ddd';
      td6.style.padding = '8px';
      td6.style.borderCollapse = 'collapse';

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      tr.appendChild(td5);
      tr.appendChild(td6);

      tr.id = 'supRepTable1Tr_' + index;
      index++;
      tbody.appendChild(tr);
    }

    var tbodyChildrens = tbody.childNodes;
    for (let i = 0; i < tbody.childNodes.length; i++) {
      tbodyChildrens[i].addEventListener('mouseover', () => this.onmouseover(tbodyChildrens[i]));
      tbodyChildrens[i].addEventListener('mouseout', () => this.onmouseout(tbodyChildrens[i]));
      const trChildren = tbodyChildrens[i].childNodes;
      trChildren[trChildren.length - 1].addEventListener('click', () => this.onclickTable1(tbodyChildrens[i], list, i));
    }
    
    if(!this.firstIntrance){
      this.firstIntrance = true;
      this.sortByDate(this.sortArrowStatusTable1,2,'supportRepDateColTable1',this.openChatList,'table1');
    
    }
  }


  async createTable2(tbody, list: any[]) {
    var tbodyChildrens = tbody.childNodes;
    this.removeChildren(tbody, 'supRepTBody2');
    const scrollbar2 = document.getElementById('scrollbar2');
    if (list.length >= 4) {
      scrollbar2.style.height = '300px';
    } else {
      scrollbar2.style.height = '200px';
    }
    let index = 1;
    for (const v of list) {
      const tr = document.createElement('tr');

      const td1 = document.createElement('td');
      td1.style.border = ' 1px solid #ddd';
      td1.style.padding = '8px';
      td1.style.borderCollapse = 'collapse';
      td1.textContent = index.toString();

      const td2 = document.createElement('td');
      td2.style.border = ' 1px solid #ddd';
      td2.style.padding = '8px';
      td2.style.borderCollapse = 'collapse';
      td2.textContent = v.ClientName;

      const td3 = document.createElement('td');
      td3.style.border = ' 1px solid #ddd';
      td3.style.padding = '8px';
      td3.style.borderCollapse = 'collapse';
      td3.textContent = new Date(v.timestamp).toLocaleString();

      const td4 = document.createElement('td');
      const name = '';
      td4.style.border = ' 1px solid #ddd';
      td4.style.padding = '8px';
      td4.style.borderCollapse = 'collapse';
      if (v.SupportRepName !== '' && v.SupportRepName !== null) {
        td4.textContent = v.SupportRepName;
      } else {
        td4.textContent = 'no support name';
      }

      const td5 = document.createElement('td');
      td5.style.border = ' 1px solid #ddd';
      td5.style.padding = '8px';
      td5.style.borderCollapse = 'collapse';
      if (v.occupied === true) {
        td5.textContent = 'בטיפול';
      } else {
        td5.textContent = 'לא בטיפול';
      }

      const button1 = document.createElement('ion-button');
      const td6 = document.createElement('td');
      td6.appendChild(button1);
      td6.style.textAlign = 'center';
      td6.id = 'supRepTable2button1_' + index;
      button1.innerHTML = 'כנס לשיחה';
      button1.color = 'success';
      td6.style.color = 'white';
      td6.style.border = ' 1px solid #ddd';
      td6.style.padding = '8px';
      td6.style.borderCollapse = 'collapse';

      const button2 = document.createElement('ion-button');
      const td7 = document.createElement('td');
      td7.appendChild(button2);
      td7.style.textAlign = 'center';
      td7.id = 'supRepTable2button2_' + index;
      button2.innerHTML = 'מילוי טופס לקוח';
      button2.color = 'success';
      td7.style.color = 'white';
      td7.style.border = ' 1px solid #ddd';
      td7.style.padding = '8px';
      td7.style.borderCollapse = 'collapse';

      const button3 = document.createElement('ion-button');
      const td8 = document.createElement('td');
      td8.appendChild(button3);
      td8.id = 'supRepTable2button3_' + index;
      td8.style.textAlign = 'center';
      button3.innerHTML = 'סגור שיחה';
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

      tr.id = 'supRepTable2Tr_' + index;
      index++;
      tbody.appendChild(tr);
    }

    var tbodyChildrens = tbody.childNodes;
    for (let i = 0; i < tbody.childNodes.length; i++) {
      tbodyChildrens[i].addEventListener('mouseover', () => this.onmouseover(tbodyChildrens[i]));
      tbodyChildrens[i].addEventListener('mouseout', () => this.onmouseout(tbodyChildrens[i]));
      const trChildren = tbodyChildrens[i].childNodes;
      trChildren[trChildren.length - 1].addEventListener('click', () => this.onclickTable2(tbodyChildrens[i].childNodes[trChildren.length - 1], list, i));
      trChildren[trChildren.length - 2].addEventListener('click', () => this.onclickTable2(tbodyChildrens[i].childNodes[trChildren.length - 2], list, i));
      trChildren[trChildren.length - 3].addEventListener('click', () => this.onclickTable2(tbodyChildrens[i].childNodes[trChildren.length - 3], list, i));
    }

  }

  onmouseover(e) {
    e.style.background = '#ddd';
  }
  onmouseout(e) {
    e.style.background = 'white';
  }

  onclickTable1(e, list, index) {
    if (e.childNodes[e.childNodes.length - 2].textContent === 'לא בטיפול' && this.supportRepInShift) {
      this.firestore.getSupportRepName(this.userAuth.auth.currentUser.uid).subscribe(result => {
// tslint:disable-next-line: max-line-length
      this.firestore.updateChatRooms(list[index]['ChatRoomId'], result['first_name'] + result['last_name'], this.userAuth.auth.currentUser.uid);
      const id = this.userAuth.auth.currentUser.uid
// tslint:disable-next-line: max-line-length
       window.open('/chat/' + list[index]['ChatRoomId'] + '?supportRepId=' + this.userAuth.auth.currentUser.uid, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
      });
    }
  }

  onclickTable2(e, list, index) {
    if (e['id'] === 'supRepTable2button3_' + (index + 1)) {
      if (confirm('האם את/ה בטוח/ה רוצה לסגור את השיחה')) {
        this.firestore.updateChatRoomOpenField( list[index]['ChatRoomId'], false);
      }
    }
    if (e['id'] === 'supRepTable2button2_' + (index + 1)) {
      this.openClient(list[index]['ClientID']);
    }
    if (e['id'] === 'supRepTable2button1_' + (index + 1)) {
      window.open('/chat/' + list[index]['ChatRoomId'] + '?supportRepId=' + this.userAuth.auth.currentUser.uid, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
    }
   }

  async removeChildren(tbody, tbodyId) {
    const size = tbody.childNodes.length;
    const tbody1 = document.getElementById(tbodyId);
    while (tbody1.firstChild) {
      tbody1.removeChild(tbody1.firstChild);
    }
  }

  sortByDate(dateStatus, index, id, list, table) {
    const nameBtn = (<HTMLButtonElement>document.getElementById(id));
    if (dateStatus[index] === true) {
      list.sort((a, b) => (a.timestamp >= b.timestamp) ? 1 : -1);
      dateStatus[index] = false;
      nameBtn.innerHTML = '&#8657;שעת פתיחת חדר';
    } else {
      list.sort((a, b) => (a.timestamp <= b.timestamp) ? 1 : -1);
      dateStatus[index] = true;
      nameBtn.innerHTML = '&#8659;שעת פתיחת חדר';
    }
    if (table === 'table1') {
      this.createTable1(document.getElementById('supRepTBody1'), this.openChatList);
    }
    if (table === 'table2') {
      this.createTable2(document.getElementById('supRepTBody2'), this.supportRepOpenChatList);
    }
  }


sortByClient(nameStatus, index, id, list, table) {
  const nameBtn = (<HTMLButtonElement>document.getElementById(id));
    if (nameStatus[index] === true) {
      list.sort((a, b) => (a.ClientName >= b.ClientName) ? 1 : -1);
      nameStatus[index] = false;
      nameBtn.innerHTML = '&#8657; שם הלקוח';
    } else {
      list.sort((a, b) => (a.ClientName <= b.ClientName) ? 1 : -1);
    nameStatus[index] = true;
    nameBtn.innerHTML = '&#8659; שם הלקוח';
    }
    if (table === 'table1') {
      this.createTable1(document.getElementById('supRepTBody1'), this.openChatList);
    }
    if (table === 'table2') {
      this.createTable2(document.getElementById('supRepTBody2'), this.supportRepOpenChatList);
    }
}

  sortBySupportRep(nameStatus, index, id, list, table) {
    const nameBtn = (<HTMLButtonElement>document.getElementById(id));
    if (nameStatus[index] === true) {
      list.sort((a, b) => (a.SupportRepName >= b.SupportRepName) ? 1 : -1);
      nameStatus[index] = false;
      nameBtn.innerHTML = '&#8657; שם הנציג בשיחה';
    } else {
      list.sort((a, b) => (a.SupportRepName <= b.SupportRepName) ? 1 : -1);
      nameStatus[index] = true;
      nameBtn.innerHTML = '&#8659; שם הנציג בשיחה';
    }
    if (table === 'table1') {
      this.createTable1(document.getElementById('supRepTBody1'), this.openChatList);
    }
    if (table === 'table2') {
      this.createTable2(document.getElementById('supRepTBody2'), this.supportRepOpenChatList);
    }
  }


sortByOpenRoomState(stateStatus, index, id, list, table) {
  const stateBtn = (<HTMLButtonElement>document.getElementById(id));
      if (stateStatus[index] === true) {
      list.sort((a, b) => a.open - b.open);
      stateStatus[index] = false;
      stateBtn.innerHTML = '&#8657; מצב החדר';
    } else {
      list.sort((a, b) => b.open - a.open);
      stateStatus[index] = true;
      stateBtn.innerHTML = '&#8659; מצב החדר';
    }
    if (table === 'table1') {
      this.createTable1(document.getElementById('supRepTBody1'), this.openChatList);
    }
    if (table === 'table2') {
      this.createTable2(document.getElementById('supRepTBody2'), this.supportRepOpenChatList);
    }
  }


  sortByOccupiedState(stateStatus, index, id, list, table) {
    const stateBtn = (<HTMLButtonElement>document.getElementById(id));
    if (stateStatus[index] === true) {
      list.sort((a, b) => a.occupied - b.occupied);
      stateStatus[index] = false;
      stateBtn.innerHTML = '&#8657; מצב החדר';
    } else {
      list.sort((a, b) => b.occupied - a.occupied);
      stateStatus[index] = true;
      stateBtn.innerHTML = '&#8659; מצב החדר';
    }
    if (table === 'table1') {
      this.createTable1(document.getElementById('supRepTBody1'), this.openChatList);
    }
    if (table === 'table2') {
      this.createTable2(document.getElementById('supRepTBody2'), this.supportRepOpenChatList);
    }
  }


  wakeUpDate() {
    const dateFrom = (<HTMLInputElement>document.getElementById('Cdate1')).value;
    const dateTo = document.getElementById('Cdate2');
    (<HTMLInputElement>(dateTo)).value = '';
    dateTo.setAttribute('min', dateFrom);
  }


  clearFields() {
    const name = (<HTMLInputElement>document.getElementById('Cname'));
    const dateFrom =  (<HTMLInputElement>document.getElementById('Cdate1'));
    const dateTo =  (<HTMLInputElement>document.getElementById('Cdate2'));

    name.value = '';
    dateFrom.value = '';
    dateTo.value = '';
    this.myChats = Object.assign([], this.myChatsCopy);
  }


  searchChat() {
    this.myChats = Object.assign([], this.myChatsCopy);
    const name = (<HTMLInputElement>document.getElementById('Cname')).value;
    let date1 =  (<HTMLInputElement>document.getElementById('Cdate1')).value;
    let date2 =  (<HTMLInputElement>document.getElementById('Cdate2')).value;

    if (date1 === '') {
      date1 = '1/1/2018';
    }

    if (date2 === '') {
      date2 = Date().toString();
    }

    const dateFrom = new Date(date1);
    const dateTo = new Date(date2);

    dateTo.setHours(dateTo.getHours() + 21);
    dateFrom.setHours(dateFrom.getHours() - 3);

    this.myChats = [];
    this.myChatsCopy.forEach(a => {
      if (a.ClientName.search(name) !== -1) {
        const clientDate = new Date(a.timestamp);
        if (clientDate >= dateFrom && clientDate <= dateTo) {
          this.myChats.push(a);
        }
      }
    });
  }

  openRoom(roomId) {
    window.open('/chat/' + roomId + '?supportRepId=' + this.userAuth.auth.currentUser.uid, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
  }

  openClient(clientId){
    window.open('/client-profile/' + clientId, '_blank', 'location=yes,height=700,width=1000,scrollbars=yes,status=yes');
  }

  downloadChatMsg(roomId) {
    this.firestore.getChatMessages(roomId).subscribe(result => {
      result.forEach(msg => {
        this.txtMsg += 'From:' + msg.from + ' Time:' + new Date(msg.timestamp);
        this.txtMsg += '\n<' + msg.content + '>\n\n';
      });
      console.log('startDownload');
      const link = document.createElement('a');
      link.download = 'Chat:' + roomId + '.txt';
      const blob = new Blob([this.txtMsg], {type: 'text/plain'});
      link.href = window.URL.createObjectURL(blob);
      link.click();
    });
  }

  ngOnDestroy() {
    this.get_Support_Rep_Name_subscribe.unsubscribe();
    this.get_Open_Chat_Rooms_subscribe.unsubscribe();
    this.get_Support_Rep_Open_Chat_Rooms_subscribe.unsubscribe();
    this.get_Open_Chat_Rooms_subscribe.unsubscribe();
  }
}
