import { Component, OnInit, ViewChild } from '@angular/core';
import { NgImageSliderModule, NgImageSliderComponent } from 'ng-image-slider';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})

export class GalleryComponent {

  constructor(private afs: AngularFireStorage) {
    this.setImageObject();
  }

  @ViewChild('nav') ds: NgImageSliderComponent;
  showSlider = true;
  totalImages = 10;

  sliderWidth: Number = 950;
  sliderImageWidth: Number = 350;
  sliderImageHeight: Number = 300;
  sliderArrowShow: Boolean = true;
  sliderInfinite: Boolean = true;
  sliderImagePopup: Boolean = true;
  sliderAutoSlide: Boolean = true;
  sliderSlideImage: Number = 1;
  sliderAnimationSpeed: any = 3;
  imageObject: Array<object> = [];


  file: File;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;

  onChangeHandler() {
    this.setImageObject();
    this.showSlider = false;
    setTimeout(() => {
      this.showSlider = true;
    }, 10);
  }

  setImageObject() {
    // const storageRef = this.afs.storage.ref('/assets/images/');
    // for (let i = 1; i < this.totalImages; i++) {
    //   let image, thumbImage;
    //   storageRef.child(i + '.jpg').getDownloadURL().then(res => {
    //     image = res;
    //     storageRef.child(i + '_min.jpeg').getDownloadURL().then(result => {
    //       thumbImage = result;
    //       this.imageObject.push({ image, thumbImage });
    //     });
    //   });
    //   console.log(this.imageObject);
    // }


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

  addFile(event) {
    this.file = event.target.files[0];
    console.log(this.file);
    this.getFile();
  }

  // !Admin Functions
  uploadFile() {
    const fileName = this.file.name;
    const fileNameArr = fileName.split('.');
    fileNameArr.splice(1, 0, '_min');
    fileNameArr.splice(2, 0, '.');
    const minFileName = 'assets/images/' + fileNameArr.join('');
    const filePath = 'assets/images/' + this.file.name;
    const task = this.afs.upload(filePath, this.file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    task.snapshotChanges().pipe( finalize(() => {
      console.log(this.file.name + 'uploaded successfully');
    })).subscribe();
  }

  getFile() {
    const storageRef = this.afs.ref('assets/images/1.jpg');
    storageRef.getMetadata().subscribe(result => console.log(result));
  }
}
