import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
  images = ['1.JPG', '2.JPG', '3.JPG', '4.JPG', '5.JPG', '6.JPG', '7.JPG'];

  constructor() {  }

  ngOnInit() {}

}
