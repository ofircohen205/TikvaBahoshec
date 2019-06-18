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
  newMessages = [];
  firstTimeInChat = false;
  chatId = '';

  clientId = '';
  clientName = '';

  supportRepId = '';
  supportRepName = '';

  client_support_flag: boolean;
  is_written = false;

  constructor(
    private userAuth: AngularFireAuth,
    private firestore: FirestoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
      const url = new URL(window.location.href);
      const parameter = url.searchParams.get('supportRepId');
      if (parameter === null) {
        this.client_support_flag = true;
      } else if (parameter !== null) {
        this.client_support_flag = false;
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
      this.is_written = result['written'];
    });

    this.chat_message_subscribe = this.firestore.getChatMessages(this.chatId).subscribe(result => {
      this.newMessages = [];
      result.sort((m1, m2) => {
        if (m1['timestamp'] > m2['timestamp']) {
          return 1;
        } else {
          return -1;
        }
      });
       this.getNewMassages(result);
       var chat = document.getElementById('chatLogoImage');
       if(this.messages.length >= 8){
         chat.style.height = 'auto';
       }
        this.scrollToBottom();
        if (this.messages.length === 1) {
          this.firestore.updateIsWritten(this.chatId, true);
        }
    });

    window.onbeforeunload = () => this.ngOnDestroy();
  }

  getNewMassages(result){
    for(let i = 0; i < result.length; i++)
    {
      var inMessage = false;
      if(this.messages.length === 0){
        this.newMessages.push(result[i]);
        this.messages.push(result[i]);
       }else {
        for(let j =0 ; j<this.messages.length;j++)
        {
          if(this.compareChatMessages(result[i],this.messages[j])){
           inMessage = true;
            break;
        }
      }
      if(!inMessage){
         this.newMessages.push(result[i]);
         this.messages.push(result[i]);
      }

    }
    }
  }

  compareChatMessages(element1,element2){
    if(element1.id === element2.id  
      && element1.timestamp === element2.timestamp 
      && element1.content === element2.content
      && element1.from === element2.from){
        return true;
      }
      else{
        return false;
      }
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
    // this.scrollToBottom();
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

  beforeSendMessage() {
    if (this.client_support_flag) {
      this.sendMessage('username');
    } else {
      this.sendMessage('SupportRepID');
    }
  }

  ngOnDestroy() {
    this.params_subscribe.unsubscribe();
    this.chat_room_subscribe.unsubscribe();
    this.chat_message_subscribe.unsubscribe();
    if (this.userAuth.auth.currentUser.isAnonymous) {
      this.userAuth.auth.signOut();
      this.userAuth.auth.currentUser.delete();
    }
  }

}
