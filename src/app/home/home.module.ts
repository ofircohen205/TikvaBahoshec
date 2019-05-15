import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { StoryComponent } from '../story/story.component';
import { CalenderComponent } from '../calender/calender.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { DonateComponent } from '../donate/donate.component';
import { MainComponent } from '../main/main.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      },
      {
        path: 'story',
        component: StoryComponent
      }
    ])
  ],
  declarations: [
    HomePage,
    StoryComponent,
    CalenderComponent,
    GalleryComponent,
    DonateComponent,
    MainComponent
  ]
})
export class HomePageModule {}
