import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firebase/firestore/firestore.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  adminLoginAuth = false ;

  constructor(
    private firestore: FirestoreService,
    private userAuth: AngularFireAuth
    ) {}

  ngOnInit() {
    const adminElement = document.getElementById('admin');
    const supportRepElement = document.getElementById('supportRep');
    const toolbarHeaderElement = document.getElementById('toolbarHeader');
    this.firestore.checkIfAdmin(this.userAuth.auth.currentUser.uid).subscribe(result => {
      result['admins'].some(element => {
        if (element === this.userAuth.auth.currentUser.uid) {
          this.adminLoginAuth = true;
          toolbarHeaderElement.hidden = false;
          adminElement.hidden = true ;
          supportRepElement.hidden = false;
        } else{
          toolbarHeaderElement.hidden = true;
          adminElement.hidden = true ;
          supportRepElement.hidden = false;
        }
      });
    });
    }

  onclick(e): void {
    const x = e.target.value;
    const adminElement = document.getElementById('admin');
    const supportRepElement = document.getElementById('supportRep');
    if (x === 'admin') {
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

}
