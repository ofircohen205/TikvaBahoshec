import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Key } from 'protractor';

@Injectable({ providedIn: 'root' })
export class FirestoreService {

  readonly CHAT_ROOMS_COLLECTION = 'ChatRooms';
  readonly METADATA_COLLECTION = 'Metadata';
  readonly MESSAGES_COLLECTION = 'Messages';
  readonly SUPPORT_REP_COLLECTION = 'SupportReps';

  constructor(private firestore: AngularFirestore) { }

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

  public getOwnChats(supportRepId): Observable<any> {
    return this.firestore.collection(this.CHAT_ROOMS_COLLECTION, ref => ref.where('SupportRepID', '==', supportRepId)).get();
  }

  public getAnonNumber() {
    return this.firestore.collection(this.METADATA_COLLECTION).valueChanges();
  }

  public getChatMessages(chatId) {
    return this.firestore.collection(this.CHAT_ROOMS_COLLECTION).doc(chatId).collection(this.MESSAGES_COLLECTION).valueChanges();
  }

  public addChatMessage(chatId, fullName, content, timestamp) {
    this.firestore.collection(this.CHAT_ROOMS_COLLECTION).doc(chatId).collection(this.MESSAGES_COLLECTION).add({
      from: fullName,
      content,
      timestamp
    });
  }

  public getUserName(chatId) {
    return this.firestore.collection(this.CHAT_ROOMS_COLLECTION).doc(chatId).valueChanges();
  }

  public getSupportRepName(supportRepId) {
    return this.firestore.collection(this.SUPPORT_REP_COLLECTION).doc(supportRepId).valueChanges();
  }

  public addSupportRep(name,email){
    this.firestore.collection(this.SUPPORT_REP_COLLECTION).add({
      email: email,
      name: name,

    })
  }

  public checkIfAdmin(supportRepId) {
    return this.firestore.collection(this.METADATA_COLLECTION).doc('metadata').valueChanges();
  }

}
