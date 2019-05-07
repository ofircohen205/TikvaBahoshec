import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
  imagesLength = 7;
  images: any = [];

  constructor() {
    for (let i = 1 , j = 0 ; i <= this.imagesLength && j < this.imagesLength ; i++, j++) {
      const picIndex = i.toString();
      this.images[j] = picIndex.concat('.JPG');
    }


    }

  ngOnInit() {}

}
