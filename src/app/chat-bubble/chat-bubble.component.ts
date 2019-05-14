import { Component, OnInit, Input } from '@angular/core';
import { FirestoreService } from '../firebase/firestore/firestore.service';

@Component({
  selector: 'app-chat-bubble',
  templateUrl: './chat-bubble.component.html',
  styleUrls: ['./chat-bubble.component.scss'],
})
export class ChatBubbleComponent implements OnInit {

  @Input() data;
  @Input() fromClient;
  @Input() fromSupportRep;
  messageTime;
  flag = true;

  constructor(private firestore: FirestoreService) { }

  ngOnInit() {
    this.messageTime = new Date(this.data['timestamp']).toLocaleTimeString();
    console.log(this.data);
    console.log(this.fromClient);
    console.log(this.fromSupportRep);
  }

}
