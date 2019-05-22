import { Component, OnInit, ViewChild } from '@angular/core';
import { NgImageSliderModule, NgImageSliderComponent } from 'ng-image-slider';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FirestoreService } from '../firebase/firestore/firestore.service';
import { getUrl } from '@ionic/angular/dist/directives/navigation/stack-utils';


@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})

export class GalleryComponent implements OnInit {

  constructor(
    private afs: AngularFireStorage,
    private firestore: FirestoreService) { }

  ngOnInit() {
    this.setImageObject();
  }

  @ViewChild('nav') ds: NgImageSliderComponent;
  showSlider = true;
  totalImages = 10;

  sliderWidth: Number = 950;
  sliderImageWidth: Number = 500;
  sliderImageHeight: Number = 300;
  sliderArrowShow: Boolean = true;
  sliderInfinite: Boolean = true;
  sliderImagePopup: Boolean = true;
  sliderAutoSlide: Boolean = true;
  sliderSlideImage: Number = 1;
  sliderAnimationSpeed: any = 5;
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

    // get referance for images folder
    // loop through images folder
      // get URL of image
      // get URL of thumbImage
      // push object of {image, thumbImage} into the array

    const storageRef = this.afs.storage.ref('/assets/images/');
    const array = [];
    for (let i = 1; i < this.totalImages; i++) {
      const image = this.getURL(storageRef, i, 'reg');
      const thumbImage = this.getURL(storageRef, i, 'min');
      array.push({ image, thumbImage });
      // let image, thumbImage;
      // storageRef.child(i + '.jpg').getDownloadURL().then(res => {
      //   image = res;
      //   storageRef.child(i + '_min.jpeg').getDownloadURL().then(result => {
      //     thumbImage = result;
      //     this.imageObject.push({ image, thumbImage });
      //   });
      // });
    }
    Promise.all(array).then(result => console.log(result[0]['image']));

    for (let i = 1; i < this.totalImages; i++) {
      this.imageObject.push({ image: 'assets/img/slider/' + i + '.jpg', thumbImage: 'assets/img/slider/' + i + '_min.jpeg' });
    }


    // this.imageObject = [{
    //   image: 'assets/img/slider/1.jpg',
    //   thumbImage: 'assets/img/slider/1_min.jpeg',
    // }, {
    //   image: 'assets/img/slider/2.jpg',
    //   thumbImage: 'assets/img/slider/2_min.jpeg',
    // }, {
    //   image: 'assets/img/slider/3.jpg',
    //   thumbImage: 'assets/img/slider/3_min.jpeg',
    // }, {
    //   image: 'assets/img/slider/4.jpg',
    //   thumbImage: 'assets/img/slider/4_min.jpeg',
    // }, {
    //   image: 'assets/img/slider/5.jpg',
    //   thumbImage: 'assets/img/slider/5_min.jpeg'
    // }, {
    //   image: 'assets/img/slider/6.jpg',
    //   thumbImage: 'assets/img/slider/6_min.jpeg'
    // }, {
    //   image: 'assets/img/slider/7.jpg',
    //   thumbImage: 'assets/img/slider/7_min.jpeg'
    // }, {
    //   image: 'assets/img/slider/8.jpg',
    //   thumbImage: 'assets/img/slider/8_min.jpeg'
    // }, {
    //   image: 'assets/img/slider/9.jpg',
    //   thumbImage: 'assets/img/slider/9_min.jpeg'
    // }];
  }

  getURL(ref, index, type) {
    if (type === 'reg') {
      return ref.child(index + '.jpg').getDownloadURL().then(res => res);
    } else if (type === 'min') {
      return ref.child(index + '_min.jpeg').getDownloadURL().then(res => res);
    }
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
