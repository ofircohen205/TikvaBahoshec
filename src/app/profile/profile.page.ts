import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firebase/firestore/firestore.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  adminLoginAuth: boolean = false;

  constructor(
    private firestore: FirestoreService,
    private userAuth: AngularFireAuth
    ) { }

  ngOnInit() {
    this.firestore.checkIfAdmin(this.userAuth.auth.currentUser.uid).subscribe(result => {
      result['admins'].forEach(element => {
        if (element === this.userAuth.auth.currentUser.uid) {
          this.adminLoginAuth = true;
        }
      });
    });
  }

  onclick(e): void {
    console.log(this.adminLoginAuth);
    const AdminElement = document.getElementById('admin');
    const supportRepElement = document.getElementById('supportRep');
    const x = e.target.value;
    if (x === 'admin') {
      if (AdminElement.hidden === true) {
        AdminElement.hidden = false;
        supportRepElement.hidden = true;
      }
    } else {
      if (supportRepElement.hidden === true) {
        AdminElement.hidden = true;
        supportRepElement.hidden = false;
      }
    }
  }

}
