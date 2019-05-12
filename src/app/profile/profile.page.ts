import { Component, OnInit, ViewChild } from '@angular/core';
import { FirestoreService } from '../firebase/firestore/firestore.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  adminLoginAuth = false;
  @ViewChild('admin') admin;
  @ViewChild('supportRep') supportRep;
  @ViewChild('toolbarHeader') toolbarHeader;

  constructor(
    private firestore: FirestoreService,
    private userAuth: AngularFireAuth,
    private location: Location
    ) {}

  ngOnInit() {
    // const adminElement = document.getElementById('admin');
    // const supportRepElement = document.getElementById('supportRep');
    // const toolbarHeaderElement = document.getElementById('toolbarHeader');
    this.firestore.checkIfAdmin(this.userAuth.auth.currentUser.uid).subscribe(result => {
      result['admins'].some(element => {
        if (element === this.userAuth.auth.currentUser.uid) {
          this.adminLoginAuth = true;
          this.toolbarHeader.hidden = false;
          this.admin.hidden = true;
          this.supportRep.hidden = false;
        } else {
          this.toolbarHeader.hidden = true;
          this.admin.hidden = true ;
          this.supportRep.hidden = false;
        }
      });
    });
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

}
