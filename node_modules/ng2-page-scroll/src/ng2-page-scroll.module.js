import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NG2PAGESCROLL_SERVICE_PROVIDER, PageScrollService } from './ng2-page-scroll.service';
import { PageScroll } from './ng2-page-scroll.directive';
var Ng2PageScrollModule = (function () {
    function Ng2PageScrollModule() {
    }
    /** @deprecated since v4.0.0-beta.10 (https://github.com/Nolanus/ng2-page-scroll/pull/190) */
    Ng2PageScrollModule.forRoot = function () {
        return {
            ngModule: Ng2PageScrollModule,
            providers: [
                { provide: PageScrollService, useClass: PageScrollService }
            ]
        };
    };
    Ng2PageScrollModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    declarations: [PageScroll],
                    exports: [PageScroll],
                    providers: [NG2PAGESCROLL_SERVICE_PROVIDER]
                },] },
    ];
    /** @nocollapse */
    Ng2PageScrollModule.ctorParameters = function () { return []; };
    return Ng2PageScrollModule;
}());
export { Ng2PageScrollModule };
