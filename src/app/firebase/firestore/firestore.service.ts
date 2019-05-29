import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Key } from 'protractor';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';



@Injectable({ providedIn: 'root' })
export class FirestoreService {

  constructor( private firestore: AngularFirestore ) { }

  readonly CHAT_ROOMS_COLLECTION = 'ChatRooms';
  readonly CALENDER_COLLECTION = 'Calender';
  readonly CLIENT_COLLECTION = 'Clients';
  readonly METADATA_COLLECTION = 'Metadata';
  readonly MESSAGES_COLLECTION = 'Messages';
  readonly STORIES_COLLECTION = 'Stories';
  readonly SUPPORT_REP_COLLECTION = 'SupportReps';

  // ! CRUD ON EACH COLLECTION - CREATE READ(GET) UPDATE DELETE


  /*****************************/
  /* CHAT COLLECTION FUNCTIONS */
  /*****************************/
  public createChatRoom(username): Promise<any> {
    return this.firestore.collection(this.CHAT_ROOMS_COLLECTION).add({
      open: true,
      occupied: false,
      SupportRepID: null,
      SupportRepName: null,
      ClientID: null,
      ClientName: username,
      ChatRoomId: null,
      timestamp: new Date().getTime()
    });
  }

  public getChatRoom(chatId): Observable<any> {
    return this.firestore.collection(this.CHAT_ROOMS_COLLECTION).doc(chatId).valueChanges();
  }
  public getAllChatRoom(): Observable<any> {
    return this.firestore.collection(this.CHAT_ROOMS_COLLECTION).valueChanges();
  }

  public getOpenChatRooms(): Observable<any> {
    return this.firestore.collection(this.CHAT_ROOMS_COLLECTION, ref => ref.where('open', '==', true)).valueChanges();
  }

  public updateChatRooms(chatRoomId, supportRepName, supportRepId): void {
    const chatRoomData = {
      occupied : true,
      SupportRepName : supportRepName,
      SupportRepID : supportRepId
    };
    this.firestore.collection(this.CHAT_ROOMS_COLLECTION).doc(chatRoomId).update(chatRoomData);
  }

  public updateChatRoomOpenField(chatRoomId, openStatus): void {
    const chatRoomData = {
      open : openStatus
    };
    this.firestore.collection(this.CHAT_ROOMS_COLLECTION).doc(chatRoomId).update(chatRoomData);
  }

  public getSupportRepOpenChatRooms(supportRepId): Observable<any> {
// tslint:disable-next-line: max-line-length
    return this.firestore.collection(this.CHAT_ROOMS_COLLECTION, ref => ref.where('open', '==', true).where('SupportRepID', '==', supportRepId)).valueChanges();
  }

  public getOwnChats(supportRepId): Observable<any> {
    return this.firestore.collection(this.CHAT_ROOMS_COLLECTION, ref => ref.where('SupportRepID', '==', supportRepId)).valueChanges();
  }

  public getChatMessages(chatId): Observable<any> {
    return this.firestore.collection(this.CHAT_ROOMS_COLLECTION).doc(chatId).collection(this.MESSAGES_COLLECTION).valueChanges();
  }

  public addChatMessage(chatId, id, fullName, content, timestamp): void {
    this.firestore.collection(this.CHAT_ROOMS_COLLECTION).doc(chatId).collection(this.MESSAGES_COLLECTION).add({
      from: fullName,
      content,
      timestamp,
      id
    });
  }

  public updateChatClientId(chatId, ClientID): void {
    this.firestore.collection(this.CHAT_ROOMS_COLLECTION).doc(chatId).update({ ClientID });
  }

  public updateChatRoomId(chatId): void {
    this.firestore.collection(this.CHAT_ROOMS_COLLECTION).doc(chatId).update({ ChatRoomId: chatId });
  }

  public updateChatSupportRepId(chatId, SupportRepID): void {
    this.firestore.collection(this.CHAT_ROOMS_COLLECTION).doc(chatId).update({ SupportRepID });
  }


  /*******************************/
  /* CLIENT COLLECTION FUNCTIONS */
  /*******************************/
  public createClient(first_name): Promise<any> {
    return this.firestore.collection(this.CLIENT_COLLECTION).add({
      first_name,
      last_name: null,
      address: null,
      age: null,
      cellphone: null,
      phone_num: null,
      email: null,
      gender: null,
      brief: null,
      comments: null,
      ClientID: null
    });
  }

  public getClients(): Observable<any> {
    return this.firestore.collection(this.CLIENT_COLLECTION).stateChanges();
  }

  public getClientDetails(clientId): Observable<any> {
    return this.firestore.collection(this.CLIENT_COLLECTION).doc(clientId).valueChanges();
  }

  public updateClientDetails(clientId, first_name, last_name, address, age, cellphone, phone_num, email, gender, brief, comments) {
    const client_data = {
      first_name,
      last_name,
      address,
      age,
      cellphone,
      phone_num,
      email,
      gender,
      brief,
      comments
    };
    this.firestore.collection(this.CLIENT_COLLECTION).doc(clientId).update(client_data);
  }

  public updateClientName(chatId, first_name): void {
    this.firestore.collection(this.CLIENT_COLLECTION).doc(chatId).update({ first_name });
  }

  public updateClientID(chatId): void {
    this.firestore.collection(this.CLIENT_COLLECTION).doc(chatId).update({ ClientID: chatId });
  }


  /************************************/
  /* SUPPORT REP COLLECTION FUNCTIONS */
  /************************************/
  public createSupportRep(uid, name, email, phone): void {
    this.firestore.collection(this.SUPPORT_REP_COLLECTION).add({
      email,
      name,
      phone,
      inShift: false,
      SupportRepID: uid,
      connectionTime: null,
    });
  }


  public getSupportRepName(supportRepId): Observable<any> {
    return this.firestore.collection(this.SUPPORT_REP_COLLECTION).doc(supportRepId).valueChanges();
  }

  public getSupportRepNameList(): Observable<any> {
    return this.firestore.collection(this.SUPPORT_REP_COLLECTION).valueChanges();
  }

  public getSupportRepIdList(): Observable<any> {
    return this.firestore.collection(this.SUPPORT_REP_COLLECTION).stateChanges();
  }

  public updateSupportRepDetails(SupportRepID, name, email, phone): void {
    this.firestore.collection(this.SUPPORT_REP_COLLECTION).doc(SupportRepID).update({ SupportRepID, name, email, phone });
  }

  public updateSupportRepEmail(SupportRepID, email): void {
    this.firestore.collection(this.SUPPORT_REP_COLLECTION).doc(SupportRepID).update({ email });
  }

  public updateSupportRepName(SupportRepID, name): void {
    this.firestore.collection(this.SUPPORT_REP_COLLECTION).doc(SupportRepID).update({ name });
  }

  public updateSupportRepPhone(SupportRepID, phone): void {
    this.firestore.collection(this.SUPPORT_REP_COLLECTION).doc(SupportRepID).update({ phone });
  }

  public updateSupportRepID(SupportRepID): void {
    this.firestore.collection(this.SUPPORT_REP_COLLECTION).doc(SupportRepID).update({ SupportRepID });
  }

  public updateSupportRepInShift(supportRepId, inShift): void {
    const supportRepData = {
      inShift : inShift
    };
    this.firestore.collection(this.SUPPORT_REP_COLLECTION).doc(supportRepId).update(supportRepData);
  }

  public removeSupportRep(supportRepId): void {
     this.firestore.collection(this.SUPPORT_REP_COLLECTION).doc(supportRepId).delete();
  }


  /*********************************/
  /* CALENDER COLLECTION FUNCTIONS */
  /*********************************/
  public createEvent(title, date, description): void {
    this.firestore.collection(this.CALENDER_COLLECTION).add({ title, date, description });
  }

  public getEvents(): Observable<any> {
    return this.firestore.collection(this.CALENDER_COLLECTION).valueChanges();
  }

  public removeEvent(eventId): void {
    this.firestore.collection(this.CALENDER_COLLECTION).doc(eventId).delete();
  }


  /********************************/
  /* STORIES COLLECTION FUNCTIONS */
  /********************************/
  public createStory(title, description): void {
    this.firestore.collection(this.STORIES_COLLECTION).add({
      title,
      description,
      date: new Date(),
      approved: false
    });
  }

  public getStories(): Observable<any> {
    return this.firestore.collection(this.STORIES_COLLECTION).valueChanges();
  }

  public getStoriesId(): Observable<any> {
    return this.firestore.collection(this.STORIES_COLLECTION).stateChanges();
  }

  public removeStory(storyId): void {
    this.firestore.collection(this.STORIES_COLLECTION).doc(storyId).delete();
  }

  public editStory(storyId, description) {
    this.firestore.collection(this.STORIES_COLLECTION).doc(storyId).update({description});
  }

  public editStoryTitle(storyId, title) {
    this.firestore.collection(this.STORIES_COLLECTION).doc(storyId).update({title});
  }

  public confirmStory(storyId, approved) {
    this.firestore.collection(this.STORIES_COLLECTION).doc(storyId).update({approved});
  }

  /*********************************/
  /* METADATA COLLECTION FUNCTIONS */
  /*********************************/
  public getAnonNumber(): Observable<any> {
    return this.firestore.collection(this.METADATA_COLLECTION).doc('metadata').valueChanges();
  }

  public updateAnonNumber(nextAnonymous): void {
    this.firestore.collection(this.METADATA_COLLECTION).doc('metadata').update({ nextAnonymous });
  }

  public checkIfAdmin(supportRepId): Observable<any> {
    return this.firestore.collection(this.METADATA_COLLECTION).doc('metadata').valueChanges();
  }

  public getImageArray(): Observable<any> {
    return this.firestore.collection(this.METADATA_COLLECTION).doc('metadata').valueChanges();
  }

  public updateImageArray(images): void {
    this.firestore.collection(this.METADATA_COLLECTION).doc('metadata').update({ images });
  }

  public getAssociationInfo(): Observable<any> {
    return this.firestore.collection(this.METADATA_COLLECTION).doc('metadata').valueChanges();
  }

}
