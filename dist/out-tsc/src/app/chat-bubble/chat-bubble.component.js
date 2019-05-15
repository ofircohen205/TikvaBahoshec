import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { FirestoreService } from '../firebase/firestore/firestore.service';
var ChatBubbleComponent = /** @class */ (function () {
    function ChatBubbleComponent(firestore) {
        this.firestore = firestore;
    }
    ChatBubbleComponent.prototype.ngOnInit = function () {
        this.messageTime = new Date(this.data['timestamp']).toLocaleTimeString();
        if (this.clientName) {
            this.flag = true;
        }
        else {
            this.flag = false;
        }
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ChatBubbleComponent.prototype, "data", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ChatBubbleComponent.prototype, "clientName", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ChatBubbleComponent.prototype, "supportRepName", void 0);
    ChatBubbleComponent = tslib_1.__decorate([
        Component({
            selector: 'app-chat-bubble',
            templateUrl: './chat-bubble.component.html',
            styleUrls: ['./chat-bubble.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [FirestoreService])
    ], ChatBubbleComponent);
    return ChatBubbleComponent;
}());
export { ChatBubbleComponent };
//# sourceMappingURL=chat-bubble.component.js.map