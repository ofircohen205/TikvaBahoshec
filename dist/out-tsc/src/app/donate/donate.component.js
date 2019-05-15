import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
var DonateComponent = /** @class */ (function () {
    function DonateComponent() {
    }
    DonateComponent.prototype.ngOnInit = function () {
    };
    DonateComponent.prototype.moveToJgive = function () {
        window.open('https://www.jgive.com/new/he/ils/donation-targets/3670?currency=ILS&utm_campaign=Leave_no_Child_in_the_Dark&utm_source=mail');
    };
    DonateComponent = tslib_1.__decorate([
        Component({
            selector: 'app-donate',
            templateUrl: './donate.component.html',
            styleUrls: ['./donate.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], DonateComponent);
    return DonateComponent;
}());
export { DonateComponent };
//# sourceMappingURL=donate.component.js.map