import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { FirestoreService } from '../firebase/firestore/firestore.service';
var StoryComponent = /** @class */ (function () {
    function StoryComponent(firestore) {
        this.firestore = firestore;
        this.stories = [];
    }
    StoryComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.firestore.getStories().subscribe(function (result) {
            result.forEach(function (element) {
                if (element['approved']) {
                    _this.stories.push(element);
                }
            });
        });
    };
    StoryComponent = tslib_1.__decorate([
        Component({
            selector: 'app-story',
            templateUrl: './story.component.html',
            styleUrls: ['./story.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [FirestoreService])
    ], StoryComponent);
    return StoryComponent;
}());
export { StoryComponent };
//# sourceMappingURL=story.component.js.map