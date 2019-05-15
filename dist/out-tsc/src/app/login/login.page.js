import * as tslib_1 from "tslib";
import { Component, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
var LoginPage = /** @class */ (function () {
    function LoginPage(
    // firebase.auth() in Firebase documentation is userAuth
    userAuth, loadingController, router, alertController) {
        this.userAuth = userAuth;
        this.loadingController = loadingController;
        this.router = router;
        this.alertController = alertController;
        this.loadingRef = null;
    }
    // This function logs the support rep into the system
    LoginPage.prototype.login = function () {
        var _this = this;
        var email = this.emailField.value;
        var password = this.passField.value;
        // ! check if email and password aren't 'undefined'
        this.presentLoading();
        this.userAuth.auth.signInWithEmailAndPassword(email, password)
            .then(function (result) {
            _this.dismissLoading();
            _this.router.navigateByUrl('/profile');
        })
            .catch(function (error) {
            _this.dismissLoading();
        });
    };
    LoginPage.prototype.forgotPassword = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: 'איפוס סיסמה',
                            message: 'הזן דוא"ל לקבלת הודעה על שינוי סיסמה',
                            inputs: [{
                                    name: 'email',
                                    placeholder: 'email'
                                }],
                            buttons: [{
                                    text: 'שלח',
                                    handler: function (data) {
                                        console.log(data);
                                        _this.userAuth.auth.sendPasswordResetEmail(data.email).then(function () {
                                        }).catch(function (error) {
                                            console.log(error);
                                        });
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
    LoginPage.prototype.presentLoading = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.loadingController.create({ message: '...אנא המתן', })];
                    case 1:
                        _a.loadingRef = _b.sent();
                        return [4 /*yield*/, this.loadingRef.present()];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.dismissLoading = function () {
        this.loadingRef.dismiss();
    };
    tslib_1.__decorate([
        ViewChild('email'),
        tslib_1.__metadata("design:type", Object)
    ], LoginPage.prototype, "emailField", void 0);
    tslib_1.__decorate([
        ViewChild('password'),
        tslib_1.__metadata("design:type", Object)
    ], LoginPage.prototype, "passField", void 0);
    LoginPage = tslib_1.__decorate([
        Component({
            selector: 'app-login',
            templateUrl: './login.page.html',
            styleUrls: ['./login.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [AngularFireAuth,
            LoadingController,
            Router,
            AlertController])
    ], LoginPage);
    return LoginPage;
}());
export { LoginPage };
//# sourceMappingURL=login.page.js.map