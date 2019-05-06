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

  constructor(
    private userAuth: AngularFireAuth,
    private db: AngularFirestore,
    private firestore: FirestoreService) {}

  ngOnInit(): void {
    this.firestore.getChatMessages('EYriSNCYjTlQAVD9VXCZ').subscribe(result => {
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
      this.afterUserInside();
    });

    // this.db.collection('messages').valueChanges().subscribe(
    //  result => {
    //    result.sort((m1, m2) => {
    //       if (m1['timestamp'] > m2['timestamp']) {
    //         return 1;
    //       } else {
    //         return -1;
    //       }
    //    });
    //    if (this.messages.length <= 0) {
    //      this.messages = result;
    //      this.scrollToBottom();
    //    } else {
    //     this.messages.push(result[result.length - 1]);
    //    }
    //  });
  }

  afterUserInside() {
    this.db.collection('users').doc(this.userAuth.auth.currentUser.uid)
      .get().subscribe(result => {
        this.fullName = result.data().fullName;
      });
  }

  sendMessage() {
    if (this.isMessageInvalid()) {
      return;
    }
    this.db.collection('messages').add({
      from: this.fullName,
      content: this.messageField.value,
      timestamp: new Date().getTime()
    });
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
