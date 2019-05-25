import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirestoreService } from '../firebase/firestore/firestore.service';
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
  chatId = '';

  clientId = '';
  clientName = '';

  supportRepId = '';
  supportRepName = '';

  client_support_flag: boolean;
  maxParticipants = 2;

  constructor(
    private userAuth: AngularFireAuth,
    private firestore: FirestoreService,
    private activatedRoute: ActivatedRoute) {}

// tslint:disable-next-line: use-life-cycle-interface
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => this.chatId = params.id);
    this.firestore.getChatRoom(this.chatId).subscribe(result => {
      this.clientId = result['ClientID'];
      this.clientName = result['ClientName'];
      this.supportRepId = result['SupportRepID'];
      this.supportRepName = result['SupportRepName'];
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

    this.userAuth.user.subscribe(result => {
      if (result === null) {
        this.client_support_flag = true;
      } else {
        this.client_support_flag = false;
      }
    });
  }

  sendMessage(type) {
    if (this.isMessageInvalid()) {
      return;
    }
    if (type === 'username') {
      this.firestore.addChatMessage(this.chatId, this.clientName, this.messageField.value, new Date().getTime());
    } else if (type === 'SupportRepID') {
      this.firestore.addChatMessage(this.chatId, this.supportRepName, this.messageField.value, new Date().getTime());
    }
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
      if (this.client_support_flag) {
        this.sendMessage('username');
      } else {
        this.sendMessage('SupportRepID');
      }
    }
  }

}
