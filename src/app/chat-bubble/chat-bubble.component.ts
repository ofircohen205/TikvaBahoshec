import { Component, OnInit, Input } from '@angular/core';
import { FirestoreService } from '../firebase/firestore/firestore.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-chat-bubble',
  templateUrl: './chat-bubble.component.html',
  styleUrls: ['./chat-bubble.component.scss'],
})
export class ChatBubbleComponent implements OnInit {

  @Input() data;
  @Input() clientName;
  @Input() supportRepName;
  messageTime;
  flag;

  constructor(private firestore: FirestoreService,private userAuth: AngularFireAuth) { }

  ngOnInit() {
    this.messageTime = new Date(this.data['timestamp']).toLocaleTimeString();
    var url = new URL(window.location.href);
    var parameter = url.searchParams.get("supportRepId");
    console.log(parameter);
    console.log(this.userAuth.auth.currentUser.email);
    console.log(this.data.from);
    console.log(this.clientName);

    if(this.userAuth.auth.currentUser.email !== null || parameter !== null){
      if (this.clientName === this.data.from) {
        this.flag = false;
      } else {
        this.flag = true;
      }
      console.log("kaka1");
    }
    else{
      if (this.clientName === this.data.from) {
        this.flag = true;
      } else {
        this.flag = false;
      }
      console.log("kaka2");
    }
  }

}
