import { Component, OnInit, Input } from '@angular/core';
import { FirestoreService } from '../firebase/firestore/firestore.service';

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

  constructor(private firestore: FirestoreService) { }

  ngOnInit() {
    this.messageTime = new Date(this.data['timestamp']).toLocaleTimeString();
    if (this.clientName === this.data.from) {
      this.flag = true;
    } else {
      this.flag = false;
    }
  }

}
