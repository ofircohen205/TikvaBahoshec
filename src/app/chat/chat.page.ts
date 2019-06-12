import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirestoreService } from '../firebase/firestore/firestore.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, OnDestroy {

  @ViewChild('messageField') messageField;
  @ViewChild('mainContent') mainContent;

  // Subscribe Variables
  params_subscribe;
  chat_room_subscribe;
  chat_message_subscribe;

  messages = [];
  chatId = '';

  clientId = '';
  clientName = '';

  supportRepId = '';
  supportRepName = '';

  client_support_flag: boolean;
  num_of_entries = 0;

  constructor(
    private userAuth: AngularFireAuth,
    private firestore: FirestoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
      var url = new URL(window.location.href);
      var parameter = url.searchParams.get("supportRepId");
      if(parameter !== null){
        this.client_support_flag = true;
      } else if (this.userAuth.auth.currentUser.isAnonymous) {
        this.client_support_flag = true;
      } else {
        this.client_support_flag = false;
      }
      this.params_subscribe = this.activatedRoute.params.subscribe(params => this.chatId = params.id);
    }

// tslint:disable-next-line: use-life-cycle-interface
  ngOnInit(): void {
    this.chat_room_subscribe = this.firestore.getChatRoom(this.chatId).subscribe(result => {
      this.clientId = result['ClientID'];
      this.clientName = result['ClientName'];
      this.supportRepId = result['SupportRepID'];
      this.supportRepName = result['SupportRepName'];
      if (result['numOfEntries'] === 2) {
        this.router.navigateByUrl('/');
      }
    });

    this.chat_message_subscribe = this.firestore.getChatMessages(this.chatId).subscribe(result => {
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
  }

  sendMessage(type) {
    if (this.isMessageInvalid()) {
      return;
    }
    if (type === 'username') {
      this.firestore.addChatMessage(this.chatId, this.clientId, this.clientName, this.messageField.value, new Date().getTime());
    } else if (type === 'SupportRepID') {
      this.firestore.addChatMessage(this.chatId, this.supportRepId, this.supportRepName, this.messageField.value, new Date().getTime());
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
    const ENTER_KEY_CODE = 13;
    if (data.keyCode === ENTER_KEY_CODE) {
      if (this.client_support_flag) {
        this.sendMessage('username');
      } else {
        this.sendMessage('SupportRepID');
      }
    }
  }

  ngOnDestroy() {
    this.firestore.removeClient(this.clientId);
    this.params_subscribe.unsubscribe();
    this.chat_room_subscribe.unsubscribe();
    this.chat_message_subscribe.unsubscribe();
  }

}
