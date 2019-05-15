import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NotFoundPage } from './not-found.page';
var routes = [
    {
        path: '',
        component: NotFoundPage
    }
];
var NotFoundPageModule = /** @class */ (function () {
    function NotFoundPageModule() {
    }
    NotFoundPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [NotFoundPage]
        })
    ], NotFoundPageModule);
    return NotFoundPageModule;
}());
export { NotFoundPageModule };
//# sourceMappingURL=not-found.module.js.map