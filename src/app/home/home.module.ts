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
import { NgImageSliderModule } from 'ng-image-slider';
import {SlideshowModule} from 'ng-simple-slideshow';

import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';




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
      },
      {
        path: 'calender',
        component: CalenderComponent
      }
    ]),
    NgImageSliderModule,
    SlideshowModule,
    RichTextEditorAllModule
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
