import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
var FirestoreService = /** @class */ (function () {
    function FirestoreService(firestore) {
        this.firestore = firestore;
        this.CHAT_ROOMS_COLLECTION = 'ChatRooms';
        this.CALENDER_COLLECTION = 'Calender';
        this.CLIENT_COLLECTION = 'Clients';
        this.METADATA_COLLECTION = 'Metadata';
        this.MESSAGES_COLLECTION = 'Messages';
        this.STORIES_COLLECTION = 'Stories';
        this.SUPPORT_REP_COLLECTION = 'SupportReps';
    }
    // ! CRUD ON EACH COLLECTION - CREATE READ(GET) UPDATE DELETE
    /* CHAT COLLECTION FUNCTIONS */
    FirestoreService.prototype.createChatRoom = function (username) {
        return this.firestore.collection(this.CHAT_ROOMS_COLLECTION).add({
            open: true,
            occupied: false,
            SupportRepID: null,
            ClientID: null,
            timestamp: new Date().getTime()
        });
    };
    FirestoreService.prototype.getChatRoom = function (chatId) {
        return this.firestore.collection(this.CHAT_ROOMS_COLLECTION).doc(chatId).valueChanges();
    };
    FirestoreService.prototype.getOpenChatRooms = function () {
        return this.firestore.collection(this.CHAT_ROOMS_COLLECTION, function (ref) { return ref.where('open', '==', true); }).valueChanges();
    };
    FirestoreService.prototype.getOwnChats = function (supportRepId) {
        return this.firestore.collection(this.CHAT_ROOMS_COLLECTION, function (ref) { return ref.where('SupportRepID', '==', supportRepId); }).get();
    };
    FirestoreService.prototype.getChatMessages = function (chatId) {
        return this.firestore.collection(this.CHAT_ROOMS_COLLECTION).doc(chatId).collection(this.MESSAGES_COLLECTION).valueChanges();
    };
    FirestoreService.prototype.addChatMessage = function (chatId, fullName, content, timestamp) {
        this.firestore.collection(this.CHAT_ROOMS_COLLECTION).doc(chatId).collection(this.MESSAGES_COLLECTION).add({
            from: fullName,
            content: content,
            timestamp: timestamp
        });
    };
    FirestoreService.prototype.updateClientId = function (chatId, ClientID) {
        this.firestore.collection(this.CHAT_ROOMS_COLLECTION).doc(chatId).update({ ClientID: ClientID });
    };
    FirestoreService.prototype.updateSupportRepId = function (chatId, SupportRepID) {
        this.firestore.collection(this.CHAT_ROOMS_COLLECTION).doc(chatId).update({ SupportRepID: SupportRepID });
    };
    /* CLIENT COLLECTION FUNCTIONS */
    FirestoreService.prototype.createClient = function (username) {
        return this.firestore.collection(this.CLIENT_COLLECTION).add({
            username: username,
            location: null,
            description: null
        });
    };
    FirestoreService.prototype.getUserName = function (clientId) {
        return this.firestore.collection(this.CLIENT_COLLECTION).doc(clientId).valueChanges();
    };
    FirestoreService.prototype.getClients = function () {
        return this.firestore.collection(this.CLIENT_COLLECTION).valueChanges();
    };
    FirestoreService.prototype.updateClientName = function (chatId, username) {
        this.firestore.collection(this.CLIENT_COLLECTION).doc(chatId).update({ username: username });
    };
    FirestoreService.prototype.updateClientLocation = function (chatId, location) {
        this.firestore.collection(this.CLIENT_COLLECTION).doc(chatId).update({ location: location });
    };
    FirestoreService.prototype.updateClientDescription = function (chatId, description) {
        this.firestore.collection(this.CLIENT_COLLECTION).doc(chatId).update({ description: description });
    };
    /* SUPPORT REP COLLECTION FUNCTIONS */
    FirestoreService.prototype.createSupportRep = function (name, email, phone) {
        this.firestore.collection(this.SUPPORT_REP_COLLECTION).add({
            email: email,
            name: name,
            phone: phone,
            connectionTime: null
        });
    };
    FirestoreService.prototype.editSupportRep = function (SupportRepId, name, email, phone) {
        this.firestore.collection(this.SUPPORT_REP_COLLECTION).doc(SupportRepId).update({
            email: email,
            name: name,
            phone: phone
        });
    };
    FirestoreService.prototype.getSupportRepName = function (supportRepId) {
        return this.firestore.collection(this.SUPPORT_REP_COLLECTION).doc(supportRepId).valueChanges();
    };
    FirestoreService.prototype.getSupportRepNameList = function () {
        return this.firestore.collection(this.SUPPORT_REP_COLLECTION).valueChanges();
    };
    FirestoreService.prototype.getSupportRepIdList = function () {
        return this.firestore.collection(this.SUPPORT_REP_COLLECTION).stateChanges();
    };
    /* CALENDER COLLECTION FUNCTIONS */
    FirestoreService.prototype.createEvent = function (title, date, description) {
        this.firestore.collection(this.CALENDER_COLLECTION).add({ title: title, date: date, description: description });
    };
    FirestoreService.prototype.getEvents = function () {
        return this.firestore.collection(this.CALENDER_COLLECTION).valueChanges();
    };
    FirestoreService.prototype.removeEvent = function (eventId) {
        this.firestore.collection(this.CALENDER_COLLECTION).doc(eventId).delete();
    };
    /* STORIES COLLECTION FUNCTIONS */
    FirestoreService.prototype.createStory = function (date, description) {
        this.firestore.collection(this.STORIES_COLLECTION).add({ date: date, description: description, approved: false });
    };
    FirestoreService.prototype.getStories = function () {
        return this.firestore.collection(this.STORIES_COLLECTION).valueChanges();
    };
    FirestoreService.prototype.removeStory = function (storyId) {
        this.firestore.collection(this.STORIES_COLLECTION).doc(storyId).delete();
    };
    /* METADATA COLLECTION FUNCTIONS */
    FirestoreService.prototype.getAnonNumber = function () {
        return this.firestore.collection(this.METADATA_COLLECTION).valueChanges();
    };
    FirestoreService.prototype.updateAnonNumber = function (number) {
    };
    FirestoreService.prototype.checkIfAdmin = function (supportRepId) {
        return this.firestore.collection(this.METADATA_COLLECTION).doc('metadata').valueChanges();
    };
    FirestoreService.prototype.getAboutAssociation = function () {
        return this.firestore.collection(this.METADATA_COLLECTION).doc('metadata').valueChanges();
    };
    FirestoreService.prototype.updateAboutAssociation = function (aboutAssociation) {
        this.firestore.collection(this.METADATA_COLLECTION).doc('metadata').update({ aboutAssociation: aboutAssociation });
    };
    FirestoreService = tslib_1.__decorate([
        Injectable({ providedIn: 'root' }),
        tslib_1.__metadata("design:paramtypes", [AngularFirestore])
    ], FirestoreService);
    return FirestoreService;
}());
export { FirestoreService };
//# sourceMappingURL=firestore.service.js.map