import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ChatPage } from './chat.page';
import { ChatBubbleComponent } from '../chat-bubble/chat-bubble.component';
var routes = [
    {
        path: '',
        component: ChatPage
    }
];
var ChatPageModule = /** @class */ (function () {
    function ChatPageModule() {
    }
    ChatPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [
                ChatPage,
                ChatBubbleComponent
            ]
        })
    ], ChatPageModule);
    return ChatPageModule;
}());
export { ChatPageModule };
//# sourceMappingURL=chat.module.js.map