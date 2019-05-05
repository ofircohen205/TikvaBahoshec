import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firebase/firestore/firestore.service';

@Component({
  selector: 'app-support-rep-profile',
  templateUrl: './support-rep-profile.component.html',
  styleUrls: ['./support-rep-profile.component.scss'],
})
export class SupportRepProfileComponent implements OnInit {

  constructor(private firestore: FirestoreService) { }

  ngOnInit() {
     this.firestore.getOpenChatRooms().subscribe(result => {
      console.log(result)
    })
  }



}
