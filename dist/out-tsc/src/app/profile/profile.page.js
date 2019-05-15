import * as tslib_1 from "tslib";
import { Component, ViewChild } from '@angular/core';
import { FirestoreService } from '../firebase/firestore/firestore.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Location } from '@angular/common';
var ProfilePage = /** @class */ (function () {
    function ProfilePage(firestore, userAuth, location) {
        this.firestore = firestore;
        this.userAuth = userAuth;
        this.location = location;
        this.adminLoginAuth = false;
    }
    ProfilePage.prototype.ngOnInit = function () {
        var _this = this;
        // const adminElement = document.getElementById('admin');
        // const supportRepElement = document.getElementById('supportRep');
        // const toolbarHeaderElement = document.getElementById('toolbarHeader');
        this.firestore.checkIfAdmin(this.userAuth.auth.currentUser.uid).subscribe(function (result) {
            result['admins'].some(function (element) {
                if (element === _this.userAuth.auth.currentUser.uid) {
                    _this.adminLoginAuth = true;
                    _this.toolbarHeader.hidden = false;
                    _this.admin.hidden = true;
                    _this.supportRep.hidden = false;
                }
                else {
                    _this.toolbarHeader.hidden = true;
                    _this.admin.hidden = true;
                    _this.supportRep.hidden = false;
                }
            });
        });
    };
    ProfilePage.prototype.onclick = function (e) {
        var tar = e.target.value;
        var adminElement = document.getElementById('admin');
        var supportRepElement = document.getElementById('supportRep');
        if (tar === 'admin') {
            if (adminElement.hidden === true) {
                adminElement.hidden = false;
                supportRepElement.hidden = true;
            }
        }
        else {
            if (supportRepElement.hidden === true) {
                adminElement.hidden = true;
                supportRepElement.hidden = false;
            }
        }
    };
    tslib_1.__decorate([
        ViewChild('admin'),
        tslib_1.__metadata("design:type", Object)
    ], ProfilePage.prototype, "admin", void 0);
    tslib_1.__decorate([
        ViewChild('supportRep'),
        tslib_1.__metadata("design:type", Object)
    ], ProfilePage.prototype, "supportRep", void 0);
    tslib_1.__decorate([
        ViewChild('toolbarHeader'),
        tslib_1.__metadata("design:type", Object)
    ], ProfilePage.prototype, "toolbarHeader", void 0);
    ProfilePage = tslib_1.__decorate([
        Component({
            selector: 'app-profile',
            templateUrl: './profile.page.html',
            styleUrls: ['./profile.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [FirestoreService,
            AngularFireAuth,
            Location])
    ], ProfilePage);
    return ProfilePage;
}());
export { ProfilePage };
//# sourceMappingURL=profile.page.js.map