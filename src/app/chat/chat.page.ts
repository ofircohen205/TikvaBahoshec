import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  AngularFirestore
} from '@angular/fire/firestore';
import {
  AngularFireAuth
} from '@angular/fire/auth';
import {
  FirestoreService
} from '../firebase/firestore/firestore.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage {

  @ViewChild('messageField') messageField;
  @ViewChild('mainContent') mainContent;
  messages = [];
  fullName = '';
  chatId = '';

  constructor(
    private userAuth: AngularFireAuth,
    private db: AngularFirestore,
    private firestore: FirestoreService,
    private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.chatId = params.id;
    });
    this.firestore.getChatMessages(this.chatId).subscribe(result => {
      result.sort((m1, m2) => {
        if (m1['timestamp'] > m2['timestamp']) {
          return 1;
        } else {
          return -1;
        }
      });
      if (this.messages.length <= 0) {
        this.messages = result;
        this.scrollToBottom();
      } else {
        this.messages.push(result[result.length - 1]);
      }
    });
    this.userAuth.user.subscribe(() => {
      this.afterUserInside('username');
    });
  }

  afterUserInside(type) {
    if(type === 'username') {
      this.firestore.getUserName(this.chatId).subscribe(result => this.fullName = result[type]);
    } else if (type === 'SupportRepID') {
      this.firestore.getSupportRepName('kvTVBN4aD8OW66wZErgc').subscribe(result => this.fullName = result['name']);
    }
  }

  sendMessage() {
    if (this.isMessageInvalid()) {
      return;
    }
    this.firestore.addChatMessage(this.chatId, this.fullName, this.messageField.value, new Date().getTime());
    this.messageField.value = '';
    this.scrollToBottom();
  }

  isMessageInvalid(): boolean {
    return this.messageField == null || this.messageField.value == null || this.messageField.value.length <= 0;
  }

  scrollToBottom() {
    setTimeout(() => {
      this.mainContent.scrollToBottom(700);
    }, 120);
  }

  onKeyUp(data) {
    const ENTER_KET_CODE = 13;
    if (data.keyCode === ENTER_KET_CODE) {
      this.sendMessage();
    }
  }

}
