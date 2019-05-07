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
<<<<<<< HEAD

=======
>>>>>>> d0b5a6776846d2aac35f74fbce4e066d59aaa4b1


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
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
