import { Component, OnInit, Input } from '@angular/core';
import { FirestoreService } from '../firebase/firestore/firestore.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-chat-bubble',
  templateUrl: './chat-bubble.component.html',
  styleUrls: ['./chat-bubble.component.scss'],
})
export class ChatBubbleComponent implements OnInit {

  @Input()  data;
  @Input() clientName;
  @Input() supportRepName;
  messageTime;
  flag;

  constructor(private firestore: FirestoreService,private userAuth: AngularFireAuth) { }

  ngOnInit() {
    this.messageTime = new Date(this.data['timestamp']).toLocaleTimeString();
    const url = new URL(window.location.href);
    const parameter = url.searchParams.get('supportRepId');

    if (this.userAuth.auth.currentUser.email !== null || parameter !== null) {
      if (this.clientName === this.data.from) {
        this.flag = false;
      } else {
        this.flag = true;
      }
    } else {
      if (this.clientName === this.data.from) {
        this.flag = true;
      } else {
        this.flag = false;
      }
    }
  }

}
