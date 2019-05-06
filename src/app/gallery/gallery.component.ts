import { Component, OnInit } from '@angular/core';
import firebase from 'firebase';




@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
  private images: any[] = [];

  constructor() {  }

  ngOnInit() {}

}
