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
  height = '400px';
  minHeight: string;
  arrowSize = '30px';
  showArrows = true;
  disableSwiping = false;
  autoPlay = true;
  autoPlayInterval = 5555;
  stopAutoPlayOnSlide = true;
  debug = false;
  backgroundSize = 'cover';
  backgroundPosition = 'center center';
  backgroundRepeat = 'no-repeat';
  showDots = true;
  dotColor = '#FFF';
  showCaptions = true;
  captionColor = '#FFF';
  captionBackground = 'rgba(0, 0, 0, .35)';
  lazyLoad = false;
  hideOnNoSlides = false;
  width = '100%';
  fullscreen = false;


  file: File;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;

  ngOnInit() {
    this.firestore.getImageArray().subscribe(result => this.imageUrls = result['images']);
  }

  deleteFile(img) {
    const storageRef = this.afs.storage.refFromURL(img);
    storageRef.delete().then(() => {
      this.imageUrls.splice(this.imageUrls.indexOf(img), 1);
      this.firestore.updateImageArray(this.imageUrls);
      }
    );
  }

  addFile(event) {
    this.file = event.target.files[0];
  }

  uploadFile() {
    const fileName = this.file.name;
    const filePath = 'assets/images/' + fileName;
    const task = this.afs.upload(filePath, this.file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    task.snapshotChanges().pipe( finalize(() => {
      this.getFile(filePath);
    })).subscribe();

  }

  getFile(filePath) {
    const storageRef = this.afs.ref(filePath);
    storageRef.getDownloadURL().subscribe(res => {
      this.imageUrls.push(res);
      this.firestore.updateImageArray(this.imageUrls);
    });
  }

}
