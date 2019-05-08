import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Key } from 'protractor';

@Injectable({ providedIn: 'root' })
export class FirestoreService {

  readonly CHAT_ROOMS_COLLECTION = 'ChatRooms';
  readonly CALENDER_COLLECTION = 'Calender';
  readonly METADATA_COLLECTION = 'Metadata';
  readonly MESSAGES_COLLECTION = 'Messages';
  readonly STORIES_COLLECTION = 'Stories';
  readonly SUPPORT_REP_COLLECTION = 'SupportReps';

  constructor(private firestore: AngularFirestore) { }

  /* CHAT COLLECTION FUNCTIONS */
  public createChatRoom(username): Promise<any> {
    return this.firestore.collection(this.CHAT_ROOMS_COLLECTION).add({
      username,
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

  public getChatMessages(chatId): Observable<any> {
    return this.firestore.collection(this.CHAT_ROOMS_COLLECTION).doc(chatId).collection(this.MESSAGES_COLLECTION).valueChanges();
  }

  public addChatMessage(chatId, fullName, content, timestamp): void {
    this.firestore.collection(this.CHAT_ROOMS_COLLECTION).doc(chatId).collection(this.MESSAGES_COLLECTION).add({
      from: fullName,
      content,
      timestamp
    });
  }

  public getUserName(chatId): Observable<any> {
    return this.firestore.collection(this.CHAT_ROOMS_COLLECTION).doc(chatId).valueChanges();
  }


  /* SUPPORT REP COLLECTION FUNCTIONS */
  public getSupportRepName(supportRepId): Observable<any> {
    return this.firestore.collection(this.SUPPORT_REP_COLLECTION).doc(supportRepId).valueChanges();
  }

  public addSupportRep(name, email): void {
    this.firestore.collection(this.SUPPORT_REP_COLLECTION).add({ email, name });
  }


  /* CALENDER COLLECTION FUNCTIONS */


  /* STORIES COLLECTION FUNCTIONS */
  public getStories() {
    return this.firestore.collection(this.STORIES_COLLECTION).valueChanges();
  }

  public addStory(date, description) {
    this.firestore.collection(this.STORIES_COLLECTION).add({ date, description, approved: false });
  }

  /* METADATA COLLECTION FUNCTIONS */
  public getAnonNumber(): Observable<any> {
    return this.firestore.collection(this.METADATA_COLLECTION).valueChanges();
  }

  public updateAnonNumber(number) {

  }

  public checkIfAdmin(supportRepId): Observable<any> {
    return this.firestore.collection(this.METADATA_COLLECTION).doc('metadata').valueChanges();
  }
}
