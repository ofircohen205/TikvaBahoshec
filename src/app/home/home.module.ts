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
import {SlideshowModule} from 'ng-simple-slideshow';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SlideshowModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [
    HomePage,
    StoryComponent,
    CalenderComponent,
    GalleryComponent,
    DonateComponent
  ]
})
export class HomePageModule {}
