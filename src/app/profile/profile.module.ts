import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfilePage } from './profile.page';
import { AdminProfileComponent } from '../admin-profile/admin-profile.component';
import { SupportRepProfileComponent } from '../support-rep-profile/support-rep-profile.component';

import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { FilterPipe } from '../admin-profile/filter.pipe';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    RichTextEditorAllModule,
    ReactiveFormsModule
  ],
  declarations: [
    ProfilePage,
    AdminProfileComponent,
    SupportRepProfileComponent,
    FilterPipe
  ]
})
export class ProfilePageModule {}
