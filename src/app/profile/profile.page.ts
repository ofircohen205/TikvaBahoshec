import { Component, OnInit, ViewChild } from '@angular/core';
import { FirestoreService } from '../firebase/firestore/firestore.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { GlobalService } from '../global/global.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  adminLoginAuth = false;
  admins :any[] = [];

  constructor(
    private firestore: FirestoreService,
    private userAuth: AngularFireAuth,
    private global: GlobalService,
    private location: Location
    ) {}

  ngOnInit() {
    const adminElement = document.getElementById('admin');
    const supportRepElement = document.getElementById('supportRep');
    const toolbarHeaderElement = document.getElementById('toolbarHeader');
    this.firestore.checkIfAdmin(this.userAuth.auth.currentUser.uid).subscribe(result => {
      console.log(result['admins']);
      for (let admin of result['admins']) {
        console.log(admin);
        if (admin === this.userAuth.auth.currentUser.uid) {
          this.adminLoginAuth = true;
          toolbarHeaderElement.hidden = false;
          adminElement.hidden = true;
          supportRepElement.hidden = false;
        }
      }
    });
    this.firestore.getSupportRepName(this.userAuth.auth.currentUser.uid).subscribe(result =>{
      if(result['inShift']){
        document.getElementById('inShiftButton').textContent = 'במשמרת';
        document.getElementById('inShiftButton').setAttribute('color' , 'success');
      } else {
        document.getElementById('inShiftButton').textContent = 'לא במשמרת';
        document.getElementById('inShiftButton').setAttribute('color' , 'danger');
      }
  });
    }

    logout(){
      this.global.logout();
    }

  onclick(e): void {
    const tar = e.target.value;
    const adminElement = document.getElementById('admin');
    const supportRepElement = document.getElementById('supportRep');
    if (tar === 'admin') {
      if (adminElement.hidden === true) {
        adminElement.hidden = false;
        supportRepElement.hidden = true;
      }
    } else {
      if (supportRepElement.hidden === true) {
        adminElement.hidden = true;
        supportRepElement.hidden = false;
      }
    }
  }
  async inShift() {
    var readyButton = document.getElementById('inShiftButton');
    if(readyButton.getAttribute('color') === 'danger'){
      if(confirm('האם את/ה בטוח/ה רוצה להיכנס למשמרת')){
      readyButton.setAttribute('color', 'success');
      readyButton.textContent = 'במשמרת';
      this.firestore.updateSupportRepInShift(this.userAuth.auth.currentUser.uid, true);
      }
    } else {
      if(confirm('האם את/ה בטוח/ה רוצה לצאת ממשמרת')){
      readyButton.setAttribute('color', 'danger');
      readyButton.textContent = 'לא במשמרת';
      this.firestore.updateSupportRepInShift(this.userAuth.auth.currentUser.uid, false);

      }
    }
  }

}
