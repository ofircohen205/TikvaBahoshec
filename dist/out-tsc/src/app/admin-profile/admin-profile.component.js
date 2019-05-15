import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirestoreService } from '../firebase/firestore/firestore.service';
import { GlobalService } from '../global/global.service';
var AdminProfileComponent = /** @class */ (function () {
    function AdminProfileComponent(alertController, router, userAuth, firestore, global) {
        this.alertController = alertController;
        this.router = router;
        this.userAuth = userAuth;
        this.firestore = firestore;
        this.global = global;
        this.divToShow = '';
        this.list = [];
        this.results = [];
    }
    AdminProfileComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.firestore.getSupportRepIdList().subscribe(function (results) {
            results.forEach(function (result) {
                var supportRepId = result.payload.doc.id;
                // this.results.push(result.payload.doc.id);
                _this.firestore.getSupportRepName(supportRepId).subscribe(function (item) { return console.log(item); });
            });
        });
        this.firestore.getSupportRepNameList().subscribe(function (result) {
            result.forEach(function (ele) {
                _this.list.push(ele);
            });
        });
        console.log(this.results);
        console.log(this.list);
    };
    AdminProfileComponent.prototype.logout = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: 'התנתק',
                            message: 'אתה עומד להתנתק עכשיו',
                            buttons: [{
                                    text: 'המשך',
                                    handler: function () {
                                        _this.userAuth.auth.signOut().then(function () {
                                            _this.router.navigateByUrl('/home');
                                        }).catch(function (error) { return console.log(error); });
                                    }
                                }, {
                                    text: 'עדיין לא'
                                }]
                        })];
                    case 1:
                        alert = _a.sent();
                        alert.present();
                        return [2 /*return*/];
                }
            });
        });
    };
    AdminProfileComponent.prototype.addSupport = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: 'הוספת נציג חדש',
                            inputs: [
                                {
                                    name: 'username',
                                    placeholder: 'שם הנציג'
                                },
                                {
                                    name: 'email',
                                    placeholder: 'אימייל'
                                },
                                {
                                    name: 'password',
                                    placeholder: 'סיסמא'
                                },
                                {
                                    name: 'phone',
                                    placeholder: 'טלפון'
                                },
                            ],
                            buttons: [{
                                    text: 'בטל'
                                },
                                {
                                    text: 'הוסף',
                                    handler: function (data) { _this.firestore.createSupportRep(data.username, data.email, data.phone); }
                                }]
                        })];
                    case 1:
                        alert = _a.sent();
                        alert.present();
                        return [2 /*return*/];
                }
            });
        });
    };
    AdminProfileComponent.prototype.editSupportRep = function (x) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: 'ערוך נציג',
                            inputs: [
                                {
                                    name: 'username',
                                    placeholder: x.name
                                },
                                {
                                    name: 'email',
                                    placeholder: x.email
                                },
                                {
                                    name: 'phone',
                                    placeholder: x.phone
                                },
                            ],
                            buttons: [{
                                    text: 'בטל'
                                },
                                {
                                    text: 'שמור שינויים',
                                    handler: function (data) {
                                        console.log("doneee");
                                    }
                                }]
                        })];
                    case 1:
                        alert = _a.sent();
                        alert.present();
                        return [2 /*return*/];
                }
            });
        });
    };
    AdminProfileComponent.prototype.removeSupportRep = function (x) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: 'אישור מחיקה',
                            message: "\u05D4\u05D0\u05DD \u05D0\u05EA/\u05D4 \u05D1\u05D8\u05D5\u05D7/\u05D4 \u05E9\u05D1\u05E8\u05E6\u05D5\u05E0\u05DA \u05DC\u05DE\u05D7\u05D5\u05E7 \u05D0\u05EA \u05D4\u05E0\u05E6\u05D9\u05D2/\u05D4?",
                            buttons: [
                                { text: 'חזור' },
                                { text: 'מחק', handler: function () {
                                        console.log("-----------");
                                        console.log(x);
                                    }
                                }
                            ]
                        })];
                    case 1:
                        alert = _a.sent();
                        alert.present();
                        return [2 /*return*/];
                }
            });
        });
    };
    AdminProfileComponent.prototype.readyForChat = function () {
        this.global.readyForChat();
    };
    AdminProfileComponent.prototype.scrollToElement = function (e) {
        this.global.scrollToElement(e.target.value);
    };
    AdminProfileComponent.prototype.onClick = function (e) {
        var targetId = e.target.id;
        console.log(targetId);
        var manageSupportReps = document.getElementById('Manage-SupportReps');
        var manageClientStories = document.getElementById('Manage-Client-Stories');
        var manageGallery = document.getElementById('Manage-Gallery');
        var editAssociationInfo = document.getElementById('Edit-Association-Info');
        var viewHistoryChat = document.getElementById('View-History-Chat');
        var manageClients = document.getElementById('Manage-Clients');
        var editEvents = document.getElementById('Edit-Events');
        // const calenderElement = document.getElementById('calender');
        if (targetId === 'ShowSupportRep') {
            manageSupportReps.hidden = false;
            manageClientStories.hidden = true;
            manageGallery.hidden = true;
            editAssociationInfo.hidden = true;
            viewHistoryChat.hidden = true;
            manageClients.hidden = true;
            editEvents.hidden = true;
        }
        else if (targetId === 'ShowClient') {
            manageSupportReps.hidden = true;
            manageClientStories.hidden = true;
            manageGallery.hidden = true;
            editAssociationInfo.hidden = true;
            viewHistoryChat.hidden = true;
            manageClients.hidden = false;
            editEvents.hidden = true;
        }
        else if (targetId === 'EditEvents') {
            manageSupportReps.hidden = true;
            manageClientStories.hidden = true;
            manageGallery.hidden = true;
            editAssociationInfo.hidden = true;
            viewHistoryChat.hidden = true;
            manageClients.hidden = true;
            editEvents.hidden = false;
        }
        else if (targetId === 'ViewHistoryChat') {
            manageSupportReps.hidden = true;
            manageClientStories.hidden = true;
            manageGallery.hidden = true;
            editAssociationInfo.hidden = true;
            viewHistoryChat.hidden = false;
            manageClients.hidden = true;
            editEvents.hidden = true;
        }
        else if (targetId === 'EditAssociationInfo') {
            manageSupportReps.hidden = true;
            manageClientStories.hidden = true;
            manageGallery.hidden = true;
            editAssociationInfo.hidden = false;
            viewHistoryChat.hidden = true;
            manageClients.hidden = true;
            editEvents.hidden = true;
        }
        else if (targetId === 'ManageGallery') {
            manageSupportReps.hidden = true;
            manageClientStories.hidden = true;
            manageGallery.hidden = false;
            editAssociationInfo.hidden = true;
            viewHistoryChat.hidden = true;
            manageClients.hidden = true;
            editEvents.hidden = true;
        }
        else { //targetId === ManageClientStories
            manageSupportReps.hidden = true;
            manageClientStories.hidden = false;
            manageGallery.hidden = true;
            editAssociationInfo.hidden = true;
            viewHistoryChat.hidden = true;
            manageClients.hidden = true;
            editEvents.hidden = true;
        }
    };
    AdminProfileComponent = tslib_1.__decorate([
        Component({
            selector: 'app-admin-profile',
            templateUrl: './admin-profile.component.html',
            styleUrls: ['./admin-profile.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [AlertController,
            Router,
            AngularFireAuth,
            FirestoreService,
            GlobalService])
    ], AdminProfileComponent);
    return AdminProfileComponent;
}());
export { AdminProfileComponent };
//# sourceMappingURL=admin-profile.component.js.map