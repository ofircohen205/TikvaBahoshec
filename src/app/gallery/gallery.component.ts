import { Component, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
  imagesLength = 7;
  images: any = [];
  slides: any;

  constructor() {
    for (let i = 1 , j = 0 ; i <= this.imagesLength && j < this.imagesLength ; i++, j++) {
      const picIndex = i.toString();
      this.images[j] = picIndex.concat('.JPG');
    }

    }

  ngOnInit() {}

// tslint:disable-next-line: use-life-cycle-interface
  ngOnChanges(changes: SimpleChanges) {

    setTimeout(() => {
      if (this.images && this.images.length > 0) {
        this.slides.freeMode = true;
        this.slides.autoplay = 2000;
        this.slides.speed = 500;
        this.slides.loop = true;
        this.slides.startAutoplay();
      }

    }, 1000);
  }

}
