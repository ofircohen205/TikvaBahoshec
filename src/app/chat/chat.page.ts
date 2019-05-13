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

  clientName = '';
  supportRepName = '';
  chatId = '';
  supportRepId = '';
  clientId = '';
  maxParticipants = 2;

  constructor(
    private userAuth: AngularFireAuth,
    private firestore: FirestoreService,
    private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.firestore.getSupportRepList().subscribe(results => console.log(results));
    this.activatedRoute.params.subscribe(params => this.chatId = params.id);
    this.firestore.getUserName(this.chatId).subscribe(result => this.clientName = result['username']);
    this.firestore.createClient(this.clientName);
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
    // this.firestore.getSupportRepList().subscribe(results => {
    //   results.forEach(result => console.log(result['name']));
    // });
    this.userAuth.user.subscribe(result => {
      console.log(result);
    });
  }

  afterUserInside(type) {
    if (type === 'username') {
      this.firestore.getUserName(this.chatId).subscribe(result => this.clientName = result[type]);
    } else if (type === 'SupportRepID') {
      this.firestore.getSupportRepName(this.supportRepId).subscribe(result => this.supportRepName = result['name']);
    }
  }

  sendMessage(type) {
    if (this.isMessageInvalid()) {
      return;
    }
    let fullName = '';
    if (type === 'username') {
      fullName = this.clientName;
    } else if (type === 'SupportRepID') {
      fullName = this.supportRepName;
    }
    this.firestore.addChatMessage(this.chatId, fullName, this.messageField.value, new Date().getTime());
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
      //this.sendMessage();
    }
  }

}
