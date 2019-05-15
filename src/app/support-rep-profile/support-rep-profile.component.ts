import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirestoreService } from '../firebase/firestore/firestore.service';
import { GlobalService } from '../global/global.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

@Component({
  selector: 'app-support-rep-profile',
  templateUrl: './support-rep-profile.component.html',
  styleUrls: ['./support-rep-profile.component.scss'],
})

export class SupportRepProfileComponent implements OnInit {
  chatReadyStatus = false;
  openChatList: any = [];
  openChatListInitialize: any = [];
  rooms: any[] = []
  myChats : any []
<<<<<<< HEAD
  nameStatus = true;
  dateStatus = true;
=======
>>>>>>> 88abdb286b1249126c8eb9b84646dd280fb3ea6c

  constructor(
    private alertController: AlertController,
    private router: Router,
    private userAuth: AngularFireAuth,
    private firestore: FirestoreService,
    private global: GlobalService


  ) {

  }

  ngOnInit() {
    console.log(this.openChatList);

    this.firestore.getOpenChatRooms().subscribe(result => {
        this.openChatList = result;
      console.log(this.openChatList.length);
      console.log(this.rooms);
      this.createTable1(document.getElementById('supRepTBody1'), this.openChatList);

    });

<<<<<<< HEAD
    this.firestore.getOwnChats("ira0qPmuP7PM6A4eexSrLOWyNNX2").subscribe(result => {
=======
    this.firestore.getOwnChats(this.userAuth.auth.currentUser.uid).subscribe(result => {
>>>>>>> 88abdb286b1249126c8eb9b84646dd280fb3ea6c
      this.myChats = result;
   console.log(result);

  });

  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'התנתק',
      message: 'אתה עומד להתנתק עכשיו',
      buttons: ['סלמתאק', 'לא לא']
    });
    alert.present();
  }





  readyForChat() {
    this.global.readyForChat();
  }

  scrollToElement(e): void {
    this.global.scrollToElement(e);
  }

  readyForChatColor(e) {

  }

  createTable1(tbody, list: any[]) {
    var tbodyChildrens = tbody.childNodes;
    this.removeChildren(tbody,tbodyChildrens);
    console.log("end remove");
    var index = 1;
    for (let v of list) {
      var tr = document.createElement('tr');

      var button = document.createElement('ion-button');
      var td1 = document.createElement('td');
      td1.appendChild(button);
      td1.id = 'supRepbutton_' + index;
      button.innerHTML = 'כנס לחדר';
      button.color = "success"

      if(v.occupied === true) {
        button.setAttribute('disabled','true');
      }
      td1.style.color = 'white';
      td1.style.border = ' 1px solid #ddd';
      td1.style.padding = '8px';
      td1.style.borderCollapse = 'collapse';

      var td2 = document.createElement('td');
      td2.style.border = ' 1px solid #ddd';
      td2.style.padding = '8px';
      td2.style.borderCollapse = 'collapse';
      if(v.occupied === true) {
        td2.textContent = 'תפוס';
      } else {
        td2.textContent = 'לא תפוס';
      }

      var td3 = document.createElement('td');
      td3.style.border = ' 1px solid #ddd';
      td3.style.padding = '8px';
      td3.style.borderCollapse = 'collapse';
      td3.textContent = 'Support Rep ID';

      var td4 = document.createElement('td');
      td4.style.border = ' 1px solid #ddd';
      td4.style.padding = '8px';
      td4.style.borderCollapse = 'collapse';
      td4.textContent = new Date(v.timestamp).toLocaleString();

      var td5 = document.createElement('td');
      td5.style.border = ' 1px solid #ddd';
      td5.style.padding = '8px';
      td5.style.borderCollapse = 'collapse';
      // this.firestore.getSupportRepName(v.SupportRepID)
      td5.textContent = 'Client ID';

      var td6 = document.createElement('td');
      td6.style.border = ' 1px solid #ddd';
      td6.style.padding = '8px';
      td6.style.borderCollapse = 'collapse';
      td6.textContent = index.toString();
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      tr.appendChild(td5);
      tr.appendChild(td6);

      tr.id = 'supRepTableTr_' + index; 
      index++;
      tbody.appendChild(tr);
    }
    var tbodyChildrens = tbody.childNodes;
    for(let i = 0; i < tbody.childNodes.length; i++) {
      tbodyChildrens[i].addEventListener('mouseover', () => this.onmouseover(tbodyChildrens[i]));
      tbodyChildrens[i].addEventListener('mouseout', () => this.onmouseout(tbodyChildrens[i]));
      var trChildren = tbodyChildrens[i].childNodes;
      trChildren[0].addEventListener('click', () => this.onclickTable1(tbodyChildrens[i]));
    }

  }

  onmouseover(e) {
    e.style.background = '#ddd';
  }
  onmouseout(e) {
    e.style.background = 'white';
  }

  onclickTable1(e) {
    var child = e.childNodes;
     if(child[0].textContent.localeCompare('כנס')==0){
       console.log('kaka1');
     }else {console.log('kaka2')}
   }

   async removeChildren(tbody,list){
     var size = tbody.childNodes.length;
     var tbody1 = document.getElementById('supRepTBody1');
     console.log(list.length);
     console.log("start remove");
     while (tbody1.firstChild) {
      tbody1.removeChild(tbody1.firstChild);
   }
     console.log(tbody1.childNodes.length);
     console.log(document.getElementById('supRepTBody1'));
    }


    sortByDate(dateStatus){
    if(dateStatus==true){
      this.myChats.sort((a,b)=> (a.timestamp>=b.timestamp)? 1:-1)
      this.dateStatus=false
    }
    else{
      this.myChats.sort((a,b)=> (a.timestamp<=b.timestamp)? 1:-1)
    this.dateStatus=true;
    }
}


sortByName(nameStatus){
    if(nameStatus==true){
      this.myChats.sort((a,b)=> (a.ClientName>=b.ClientName)? 1:-1)
      this.nameStatus=false
    }
    else{
      this.myChats.sort((a,b)=> (a.ClientName<=b.ClientName)? 1:-1)
    this.nameStatus=true;

 }

}

}

