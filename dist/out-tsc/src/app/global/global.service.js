import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirestoreService } from '../firebase/firestore/firestore.service';
var GlobalService = /** @class */ (function () {
    function GlobalService(alertController, userAuth, router, firestore) {
        this.alertController = alertController;
        this.userAuth = userAuth;
        this.router = router;
        this.firestore = firestore;
        this.anonymousNumber = 0;
    }
    // tslint:disable-next-line: use-life-cycle-interface
    GlobalService.prototype.ngOnInit = function () {
        var _this = this;
        this.firestore.getAnonNumber().subscribe(function (result) { return _this.anonymousNumber = result[0]['nextAnonymous']; });
    };
    GlobalService.prototype.userDetails = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: 'הכנס שם',
                            message: 'הזן את שמך. אם אינך מעוניין לחץ על כפתור המשך',
                            inputs: [{
                                    name: 'name',
                                    placeholder: 'שם'
                                }],
                            buttons: [{
                                    text: 'המשך',
                                    handler: function (data) {
                                        if (data.name === '') {
                                            data.name = 'אנונימי' + _this.anonymousNumber;
                                            _this.firestore.updateAnonNumber(_this.anonymousNumber + 1);
                                        }
                                        var clientId;
                                        _this.firestore.createClient(data.name).then(function (result) {
                                            clientId = result.id;
                                        });
                                        _this.firestore.createChatRoom(data.name).then(function (result) {
                                            _this.firestore.updateClientId(result.id, clientId);
                                            _this.router.navigateByUrl('/chat/' + result.id);
                                        }).catch(function (error) { return console.log(error); });
                                    }
                                }]
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GlobalService.prototype.readyForChat = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: 'מוכן לשיחה',
                            message: 'עכשיו אתה מוכן ויכול לקבל פניות',
                            buttons: ['אוקיי']
                        })];
                    case 1:
                        alert = _a.sent();
                        alert.present();
                        document.getElementById('readyButton').style.color = 'green';
                        return [2 /*return*/];
                }
            });
        });
    };
    GlobalService.prototype.scrollToElement = function (e) {
        var x = e.target.value;
        var element = document.getElementById(x);
        element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
    };
    GlobalService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [AlertController,
            AngularFireAuth,
            Router,
            FirestoreService])
    ], GlobalService);
    return GlobalService;
}());
export { GlobalService };
//# sourceMappingURL=global.service.js.map