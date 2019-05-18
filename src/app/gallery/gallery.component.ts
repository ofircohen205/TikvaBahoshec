import { Component, OnInit, ViewChild } from '@angular/core';
import { NgImageSliderModule, NgImageSliderComponent } from 'ng-image-slider';



@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent {

  @ViewChild('nav') ds: NgImageSliderComponent;
    showSlider = true;

    sliderWidth: Number = 940;
    sliderImageWidth: Number = 300;
    sliderImageHeight: Number = 225;
    sliderArrowShow: Boolean = true;
    sliderInfinite: Boolean = true;
    sliderImagePopup: Boolean = true;
    sliderAutoSlide: Boolean = true;
    sliderSlideImage: Number = 1;
    sliderAnimationSpeed: any = 1;
    imageObject: Array<object> = [];

    constructor() {
        this.setImageObject();
    }

    onChangeHandler() {
        this.setImageObject();
        this.showSlider = false;
        setTimeout(() => {
            this.showSlider = true;
        }, 10);
    }

    setImageObject() {
        this.imageObject = [{
            image: 'assets/img/slider/4.jpg',
            thumbImage: 'assets/img/slider/4_min.jpeg',
        }, {
            image: 'assets/img/slider/5.jpg',
            thumbImage: 'assets/img/slider/5_min.jpeg'
        }, {
            image: 'assets/img/slider/6.jpg',
            thumbImage: 'assets/img/slider/6_min.jpeg'
        }, {
            image: 'assets/img/slider/7.jpg',
            thumbImage: 'assets/img/slider/7_min.jpeg'
        }, {
            image: 'assets/img/slider/8.jpg',
            thumbImage: 'assets/img/slider/8_min.jpeg'
        }, {
            image: 'assets/img/slider/9.jpg',
            thumbImage: 'assets/img/slider/9_min.jpeg'
        }];
    }

    imageOnClick(index) { }

    arrowOnClick(event) { }

    lightboxArrowClick(event) { }

    prevImageClick() {
      this.ds.prev();
    }

    nextImageClick() {
      this.ds.next();
    }
}
