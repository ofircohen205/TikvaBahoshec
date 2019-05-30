import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChatPage } from './chat.page';
import { ChatBubbleComponent } from '../chat-bubble/chat-bubble.component';
import { LockedRoomGuard } from '../global/locked-room/locked-room.guard';

const routes: Routes = [
  {
    path: '',
    component: ChatPage,
    canActivate: [LockedRoomGuard]
  }
];

@NgModule({
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
export class ChatPageModule {}
