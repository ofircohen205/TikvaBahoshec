import * as tslib_1 from "tslib";
import { Component, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirestoreService } from '../firebase/firestore/firestore.service';
import { GlobalService } from '../global/global.service';
import { Location } from '@angular/common';
var HomePage = /** @class */ (function () {
    function HomePage(alertController, userAuth, router, firestore, global, location) {
        this.alertController = alertController;
        this.userAuth = userAuth;
        this.router = router;
        this.firestore = firestore;
        this.global = global;
        this.location = location;
    }
    HomePage.prototype.ngOnInit = function () { };
    HomePage.prototype.userDetails = function () {
        this.global.userDetails();
    };
    HomePage.prototype.onclick = function (e) {
        var tar = e.target.value;
        var storyElement = document.getElementById('story');
        var mainElement = document.getElementById('main');
        var calenderElement = document.getElementById('calender');
        if (tar === 'story') {
            if (storyElement.hidden === true) {
                storyElement.hidden = false;
                calenderElement.hidden = true;
                mainElement.hidden = true;
                this.location.go('/story');
            }
        }
        else if (tar === 'home') {
            if (mainElement.hidden === true) {
                storyElement.hidden = true;
                calenderElement.hidden = true;
                mainElement.hidden = false;
                this.location.go('/home');
            }
        }
        else if (tar === 'calender') {
            storyElement.hidden = true;
            calenderElement.hidden = false;
            mainElement.hidden = true;
            this.location.go('/calender');
        }
    };
    tslib_1.__decorate([
        ViewChild('story'),
        tslib_1.__metadata("design:type", Object)
    ], HomePage.prototype, "story", void 0);
    tslib_1.__decorate([
        ViewChild('main'),
        tslib_1.__metadata("design:type", Object)
    ], HomePage.prototype, "main", void 0);
    HomePage = tslib_1.__decorate([
        Component({
            selector: 'app-home',
            templateUrl: 'home.page.html',
            styleUrls: ['home.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [AlertController,
            AngularFireAuth,
            Router,
            FirestoreService,
            GlobalService,
            Location])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.page.js.map