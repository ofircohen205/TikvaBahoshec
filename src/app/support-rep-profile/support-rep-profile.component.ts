import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirestoreService } from '../firebase/firestore/firestore.service';
import { element } from '@angular/core/src/render3';
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

  constructor(
    private alertController: AlertController,
    private router: Router,
    private userAuth: AngularFireAuth,
    private firestore: FirestoreService,
    private global: GlobalService


  ) {

  }

  ngOnInit() {
    this.firestore.getOpenChatRooms().subscribe(result => {
      result.forEach(element => {
        this.openChatList.push(element);
      });
      this.createTable1(document.getElementById("supRepTBody1"), this.openChatList,'supRepTableTr_');
      
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

  createTable1(tbody, list: any[],idName) {
    var index = 1;
    for (let v of list) {
      var tr = document.createElement('tr');

      var td1 = document.createElement('td');
      td1.style.border = ' 1px solid #ddd'
      td1.style.padding = '8px';
      td1.style.borderCollapse = 'collapse';
      //td1.textContent = v.timestamp;

      var td2 = document.createElement('td');
      td2.style.border = ' 1px solid #ddd'
      td2.style.padding = '8px';
      td2.style.borderCollapse = 'collapse';
      if(v.occupied==true){
        td2.textContent = 'תפוס';
      }
      else{
        td2.textContent = 'לא תפוס';
      }

      var td3 = document.createElement('td');
      td3.style.border = ' 1px solid #ddd'
      td3.style.padding = '8px';
      td3.style.borderCollapse = 'collapse';
      td3.textContent = new Date(v.timestamp).toLocaleString();

      var td4 = document.createElement('td');
      td4.style.border = ' 1px solid #ddd'
      td4.style.padding = '8px';
      td4.style.borderCollapse = 'collapse';
      // this.firestore.getSupportRepName(v.SupportRepID)
      td4.textContent = "talk to ofir";

      var td5 = document.createElement('td');
      td5.style.border = ' 1px solid #ddd'
      td5.style.padding = '8px';
      td5.style.borderCollapse = 'collapse';
      td5.textContent = index.toString();
      

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      tr.appendChild(td5);

      tr.id = idName + index;
      index++;
      tbody.appendChild(tr);
    }
    var c = tbody.childNodes;
    for(let i = 0; i < tbody.childNodes.length; i++){
      c[i].addEventListener('mouseover', () => this.onmouseover(c[i]));
      c[i].addEventListener('mouseout', () => this.onmouseout(c[i]));
    }

  }

  onmouseover(e){
    e.style.background = '#ddd';
  }
  onmouseout(e){
    e.style.background = 'white';
  }






}
