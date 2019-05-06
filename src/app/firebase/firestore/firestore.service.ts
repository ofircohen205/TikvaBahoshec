import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }

  readonly CHAT_ROOMS_COLLECTION = 'ChatRooms';
  readonly METADATA_COLLECTION = 'Metadata';
  readonly MESSAGES_COLLECTION = 'Messages';

  public createChatRoom(username): Promise<any> {
    return this.firestore.collection(this.CHAT_ROOMS_COLLECTION).add({
      username: username,
      open: true,
      SupportRepID: null
    });
  }

  public getOpenChatRooms(): Observable<any> {
    return this.firestore.collection(this.CHAT_ROOMS_COLLECTION, ref => ref.where('open', '==', true)).valueChanges();
  }

  public getOwnChats(id): Observable<any> {
    // return Promise.resolve({})
    return this.firestore.collection(this.CHAT_ROOMS_COLLECTION, ref => ref.where('SupportRepID', '==', id)).get();
  }

  public getAnonNumber() {
    return this.firestore.collection(this.METADATA_COLLECTION).valueChanges();
  }

  public getChatMessages(id) {
    return this.firestore.collection(this.CHAT_ROOMS_COLLECTION).doc(id).collection(this.MESSAGES_COLLECTION).valueChanges();
  }

}
