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

  imageUrls: (string)[] = [];
  height: string = '400px';
  minHeight: string;
  arrowSize: string = '30px';
  showArrows: boolean = true;
  disableSwiping: boolean = false;
  autoPlay: boolean = true;
  autoPlayInterval: number = 5555;
  stopAutoPlayOnSlide: boolean = true;
  debug: boolean = false;
  backgroundSize: string = 'cover';
  backgroundPosition: string = 'center center';
  backgroundRepeat: string = 'no-repeat';
  showDots: boolean = true;
  dotColor: string = '#FFF';
  showCaptions: boolean = true;
  captionColor: string = '#FFF';
  captionBackground: string = 'rgba(0, 0, 0, .35)';
  lazyLoad: boolean = false;
  hideOnNoSlides: boolean = false;
  width: string = '100%';
  fullscreen: boolean = false;


  file: File;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;

  ngOnInit() {
    this.firestore.getImageArray().subscribe(result => this.imageUrls = result['images']);
    // adding an image url dynamically.
    // setTimeout(() => {
    //   console.log('adding an image url dynamically.');
    //   // this.imageUrls.push('https://cdn-images-1.medium.com/max/2000/1*Nccd2ofdArlXF7v58UK94Q.jpeg');
    // }, 2000);
    console.log(`
                                  /   \\
 _                        )      ((   ))     (
(@)                      /|\\      ))_((     /|\\
|-|                     / | \\    (/\\|/\\)   / | \\                      (@)
| | -------------------/--|-voV---\`|'/---Vov-|--\\---------------------|-|
|-|                         '^\`   (o o)  '^\`                          | |
| |                               \`\\Y/'                               |-|
|-|                                                                   | |
| |                                Hey                                |-|
|-|                                                                   | |
| |                                                                   |-|
|_|___________________________________________________________________| |
(@)              l   /\\ /         ( (       \\ /\\   l                \`\\|-|
                 l /   V           \\ \\       V   \\ l                  (@)
                 l/                _) )_          \\I
                                   \`\\ /'
				                     \`
    `);
  }

  // ngOnInit() {
  //   // this.setImageObject();
  // }

  // @ViewChild('nav') ds: NgImageSliderComponent;
  // showSlider = true;

  // sliderWidth: Number = 950;
  // sliderImageWidth: Number = 500;
  // sliderImageHeight: Number = 300;
  // sliderArrowShow: Boolean = true;
  // sliderInfinite: Boolean = true;
  // sliderImagePopup: Boolean = true;
  // sliderAutoSlide: Boolean = true;
  // sliderSlideImage: Number = 1;
  // sliderAnimationSpeed: any = 5;
  // imageObject: Array<object> = [];

  // onChangeHandler() {
  //   this.setImageObject();
  //   this.showSlider = false;
  //   setTimeout(() => {
  //     this.showSlider = true;
  //   }, 10);
  // }

  // setImageArray() {

  //   // get referance for images folder
  //   // loop through images folder
  //     // get URL of image
  //     // get URL of thumbImage
  //     // push object of {image, thumbImage} into the array

  //   const storageRef = this.afs.storage.ref('/assets/images/');
  //   for (let i = 1; i < this.totalImages; i++) {
  //     this.imageUrls.push(this.getURL(storageRef, i));
  //   }
  //   Promise.all(this.imageUrls).then(result => console.log(result));

  //   // for (let i = 1; i < this.totalImages; i++) {
  //   //   this.imageUrls.push('assets/img/slider/' + i + '.jpg');
  //   // }


  //   // this.imageObject = [{
  //   //   image: 'assets/img/slider/1.jpg',
  //   //   thumbImage: 'assets/img/slider/1_min.jpeg',
  //   // }, {
  //   //   image: 'assets/img/slider/2.jpg',
  //   //   thumbImage: 'assets/img/slider/2_min.jpeg',
  //   // }, {
  //   //   image: 'assets/img/slider/3.jpg',
  //   //   thumbImage: 'assets/img/slider/3_min.jpeg',
  //   // }, {
  //   //   image: 'assets/img/slider/4.jpg',
  //   //   thumbImage: 'assets/img/slider/4_min.jpeg',
  //   // }, {
  //   //   image: 'assets/img/slider/5.jpg',
  //   //   thumbImage: 'assets/img/slider/5_min.jpeg'
  //   // }, {
  //   //   image: 'assets/img/slider/6.jpg',
  //   //   thumbImage: 'assets/img/slider/6_min.jpeg'
  //   // }, {
  //   //   image: 'assets/img/slider/7.jpg',
  //   //   thumbImage: 'assets/img/slider/7_min.jpeg'
  //   // }, {
  //   //   image: 'assets/img/slider/8.jpg',
  //   //   thumbImage: 'assets/img/slider/8_min.jpeg'
  //   // }, {
  //   //   image: 'assets/img/slider/9.jpg',
  //   //   thumbImage: 'assets/img/slider/9_min.jpeg'
  //   // }];
  // }

  // getURL(ref, index) {
  //   return ref.child(index + '.jpg').getDownloadURL().then(res => res);
  // }

  // imageOnClick(index) { }

  // arrowOnClick(event) { }

  // lightboxArrowClick(event) { }

  // prevImageClick() {
  //   this.ds.prev();
  // }

  // nextImageClick() {
  //   this.ds.next();
  // }

  addFile(event) {
    this.file = event.target.files[0];
  }

  // !Admin Functions
  uploadFile() {
    const fileName = this.file.name;
    const filePath = 'assets/images/' + fileName;
    const task = this.afs.upload(filePath, this.file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    task.snapshotChanges().pipe( finalize(() => {
      console.log(this.file.name + ' uploaded successfully');
    })).subscribe();

    this.getFile(filePath);
  }

  getFile(filePath) {
    const storageRef = this.afs.ref(filePath);
    storageRef.getDownloadURL().subscribe(res => {
      this.imageUrls.push(res);
      this.firestore.updateImageArray(this.imageUrls);
    });
  }
}
