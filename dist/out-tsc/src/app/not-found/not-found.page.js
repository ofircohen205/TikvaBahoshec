import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Router } from '@angular/router';
var NotFoundPage = /** @class */ (function () {
    function NotFoundPage(router) {
        this.router = router;
    }
    NotFoundPage.prototype.ngOnInit = function () { };
    NotFoundPage.prototype.redirect = function () {
        var _this = this;
        setTimeout(function () { return _this.router.navigateByUrl('/home'); }, 1000);
    };
    NotFoundPage = tslib_1.__decorate([
        Component({
            selector: 'app-not-found',
            templateUrl: './not-found.page.html',
            styleUrls: ['./not-found.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [Router])
    ], NotFoundPage);
    return NotFoundPage;
}());
export { NotFoundPage };
//# sourceMappingURL=not-found.page.js.map