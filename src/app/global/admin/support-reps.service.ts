import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FirestoreService } from 'src/app/firebase/firestore/firestore.service';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class SupportRepsService {

  list = [];

  constructor(
    private firestore: FirestoreService,
    private alertController: AlertController,
    private userAuth: AngularFireAuth) {
      this.firestore.getSupportRepIdList().subscribe(result => {
        result.forEach(ele => {
        const data = ele.payload.doc.data();
        const id = ele.payload.doc.id;
        if (ele.payload.type === 'added') {
        this.list.push({id, ...data}) ;
        } else if (ele.payload.type === 'modified') {
          const index = this.list.findIndex(item => item.id === id);

          // Replace the item by index.
          this.list.splice(index, 1, {id, ...data});
        } else {
          this.list.slice(this.list.indexOf(id), 1);
          }
        });
      });
     }

}
