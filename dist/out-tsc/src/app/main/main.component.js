import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirestoreService } from '../firebase/firestore/firestore.service';
import { GlobalService } from '../global/global.service';
var MainComponent = /** @class */ (function () {
    function MainComponent(alertController, userAuth, router, firestore, global) {
        this.alertController = alertController;
        this.userAuth = userAuth;
        this.router = router;
        this.firestore = firestore;
        this.global = global;
        this.aboutAssociation = '';
        this.anonymousNumber = -1;
    }
    MainComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.firestore.getAnonNumber().subscribe(function (result) { return _this.anonymousNumber = result['nextAnonymous']; });
        this.firestore.getAboutAssociation().subscribe(function (result) { return _this.aboutAssociation = result['aboutAssociation']; });
    };
    MainComponent.prototype.userDetails = function () {
        this.global.userDetails();
    };
    MainComponent = tslib_1.__decorate([
        Component({
            selector: 'app-main',
            templateUrl: './main.component.html',
            styleUrls: ['./main.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [AlertController,
            AngularFireAuth,
            Router,
            FirestoreService,
            GlobalService])
    ], MainComponent);
    return MainComponent;
}());
export { MainComponent };
//# sourceMappingURL=main.component.js.map