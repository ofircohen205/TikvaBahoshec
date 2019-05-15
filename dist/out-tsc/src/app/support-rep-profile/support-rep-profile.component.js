import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirestoreService } from '../firebase/firestore/firestore.service';
import { GlobalService } from '../global/global.service';
var SupportRepProfileComponent = /** @class */ (function () {
    function SupportRepProfileComponent(alertController, router, userAuth, firestore, global) {
        this.alertController = alertController;
        this.router = router;
        this.userAuth = userAuth;
        this.firestore = firestore;
        this.global = global;
        this.chatReadyStatus = false;
        this.openChatList = [];
        this.openChatListInitialize = [];
    }
    SupportRepProfileComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.firestore.getOpenChatRooms().subscribe(function (result) {
            result.forEach(function (element) {
                _this.openChatList.push(element);
            });
            // this.initOpenChats(this.openChatList);
            _this.createTable1(document.getElementById("supReptable1"), _this.openChatList);
        });
    };
    SupportRepProfileComponent.prototype.logout = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: 'התנתק',
                            message: 'אתה עומד להתנתק עכשיו',
                            buttons: ['סלמתאק', 'לא לא']
                        })];
                    case 1:
                        alert = _a.sent();
                        alert.present();
                        return [2 /*return*/];
                }
            });
        });
    };
    SupportRepProfileComponent.prototype.readyForChat = function () {
        this.global.readyForChat();
    };
    SupportRepProfileComponent.prototype.scrollToElement = function (e) {
        this.global.scrollToElement(e);
    };
    SupportRepProfileComponent.prototype.readyForChatColor = function (e) {
    };
    SupportRepProfileComponent.prototype.initOpenChats = function (list) {
        for (var i = 0; i < list.length; i++) {
            this.openChatListInitialize[i] = [list[i]];
        }
    };
    SupportRepProfileComponent.prototype.createTable1 = function (table, list) {
        console.log(table);
        console.log(document.getElementById('tables'));
        var index = 1;
        var tbody = document.createElement('tbody');
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var v = list_1[_i];
            var tr = document.createElement('tr');
            var td1 = document.createElement('td');
            td1.style.border = ' 1px solid #ddd';
            td1.style.padding = '8px';
            td1.style.borderCollapse = 'collapse';
            //td1.textContent = v.timestamp;
            var td2 = document.createElement('td');
            td2.style.border = ' 1px solid #ddd';
            td2.style.padding = '8px';
            td2.style.borderCollapse = 'collapse';
            td2.textContent = v.occupied;
            var td3 = document.createElement('td');
            td3.style.border = ' 1px solid #ddd';
            td3.style.padding = '8px';
            td3.style.borderCollapse = 'collapse';
            td3.textContent = v.timestamp;
            var td4 = document.createElement('td');
            td4.style.border = ' 1px solid #ddd';
            td4.style.padding = '8px';
            td4.style.borderCollapse = 'collapse';
            // this.firestore.getSupportRepName(v.SupportRepID)
            td4.textContent = "talk to ofir";
            var td5 = document.createElement('td');
            td5.style.border = ' 1px solid #ddd';
            td5.style.padding = '8px';
            td5.style.borderCollapse = 'collapse';
            td5.textContent = index.toString();
            index++;
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tr.appendChild(td5);
            td1.onmouseover = function () {
                td1.style.background = '#ddd';
            };
            tr.onmouseout = function () {
                tr.style.background = '#f2f2f2';
            };
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
    };
    SupportRepProfileComponent = tslib_1.__decorate([
        Component({
            selector: 'app-support-rep-profile',
            templateUrl: './support-rep-profile.component.html',
            styleUrls: ['./support-rep-profile.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [AlertController,
            Router,
            AngularFireAuth,
            FirestoreService,
            GlobalService])
    ], SupportRepProfileComponent);
    return SupportRepProfileComponent;
}());
export { SupportRepProfileComponent };
//# sourceMappingURL=support-rep-profile.component.js.map