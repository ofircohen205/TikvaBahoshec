import * as tslib_1 from "tslib";
import { Component, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirestoreService } from '../firebase/firestore/firestore.service';
import { ActivatedRoute } from '@angular/router';
var ChatPage = /** @class */ (function () {
    function ChatPage(userAuth, firestore, activatedRoute) {
        this.userAuth = userAuth;
        this.firestore = firestore;
        this.activatedRoute = activatedRoute;
        this.messages = [];
        this.chatId = '';
        this.clientId = '';
        this.clientName = '';
        this.supportRepId = '';
        this.supportRepName = '';
        this.maxParticipants = 2;
    }
    ChatPage.prototype.ngOnInit = function () {
        var _this = this;
        this.activatedRoute.params.subscribe(function (params) { return _this.chatId = params.id; });
        this.firestore.getChatRoom(this.chatId).subscribe(function (result) {
            _this.clientId = result['ClientID'];
            _this.firestore.getUserName(_this.clientId).subscribe(function (item) { return _this.clientName = item['username']; });
            _this.supportRepId = result['SupportRepID'];
            _this.firestore.getSupportRepName(_this.supportRepId).subscribe(function (item) { return _this.supportRepName = item['name']; });
        });
        this.firestore.getChatMessages(this.chatId).subscribe(function (result) {
            result.sort(function (m1, m2) {
                if (m1['timestamp'] > m2['timestamp']) {
                    return 1;
                }
                else {
                    return -1;
                }
            });
            if (_this.messages.length <= 0) {
                _this.messages = result;
                _this.scrollToBottom();
            }
            else {
                _this.messages.push(result[result.length - 1]);
            }
        });
        this.userAuth.user.subscribe(function (result) {
            if (result === null) {
                _this.client_support_flag = true;
            }
            else {
                _this.client_support_flag = false;
            }
        });
    };
    ChatPage.prototype.afterUserInside = function (type) {
        var _this = this;
        if (type === this.client_support_flag) {
            this.firestore.getUserName(this.clientId).subscribe(function (result) { return _this.clientName = result['username']; });
        }
        else {
            this.firestore.getSupportRepName(this.supportRepId).subscribe(function (result) { return _this.supportRepName = result['name']; });
        }
    };
    ChatPage.prototype.sendMessage = function (type) {
        if (this.isMessageInvalid()) {
            return;
        }
        var fullName = '';
        if (type === 'username') {
            fullName = this.clientName;
        }
        else if (type === 'SupportRepID') {
            fullName = this.supportRepName;
        }
        this.firestore.addChatMessage(this.chatId, fullName, this.messageField.value, new Date().getTime());
        this.messageField.value = '';
        this.scrollToBottom();
    };
    ChatPage.prototype.isMessageInvalid = function () {
        return this.messageField == null || this.messageField.value == null || this.messageField.value.length <= 0;
    };
    ChatPage.prototype.scrollToBottom = function () {
        var _this = this;
        setTimeout(function () {
            _this.mainContent.scrollToBottom(700);
        }, 120);
    };
    ChatPage.prototype.onKeyUp = function (data) {
        this.afterUserInside(this.client_support_flag);
        var ENTER_KET_CODE = 13;
        if (data.keyCode === ENTER_KET_CODE) {
            setTimeout(function () { return console.log('sending message'); }, 700);
            if (this.client_support_flag) {
                this.sendMessage('username');
            }
            else {
                this.sendMessage('SupportRepID');
            }
        }
    };
    tslib_1.__decorate([
        ViewChild('messageField'),
        tslib_1.__metadata("design:type", Object)
    ], ChatPage.prototype, "messageField", void 0);
    tslib_1.__decorate([
        ViewChild('mainContent'),
        tslib_1.__metadata("design:type", Object)
    ], ChatPage.prototype, "mainContent", void 0);
    ChatPage = tslib_1.__decorate([
        Component({
            selector: 'app-chat',
            templateUrl: './chat.page.html',
            styleUrls: ['./chat.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [AngularFireAuth,
            FirestoreService,
            ActivatedRoute])
    ], ChatPage);
    return ChatPage;
}());
export { ChatPage };
//# sourceMappingURL=chat.page.js.map