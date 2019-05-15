import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
var GalleryComponent = /** @class */ (function () {
    function GalleryComponent() {
        this.imagesLength = 7;
        this.images = [];
        for (var i = 1, j = 0; i <= this.imagesLength && j < this.imagesLength; i++, j++) {
            var picIndex = i.toString();
            this.images[j] = picIndex.concat('.JPG');
        }
    }
    GalleryComponent.prototype.ngOnInit = function () { };
    GalleryComponent = tslib_1.__decorate([
        Component({
            selector: 'app-gallery',
            templateUrl: './gallery.component.html',
            styleUrls: ['./gallery.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], GalleryComponent);
    return GalleryComponent;
}());
export { GalleryComponent };
//# sourceMappingURL=gallery.component.js.map