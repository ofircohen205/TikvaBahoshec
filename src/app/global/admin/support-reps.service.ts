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


    async addSupport() {
    const alert = await this.alertController.create({
      header: 'הוספת נציג חדש',
      inputs: [
        {
          name: 'username',
          placeholder: 'שם הנציג'
        },
        {
          name: 'email',
          placeholder: 'אימייל'
        },
        {
          name: 'password',
          placeholder: 'סיסמא'
        },
        {
          name: 'phone',
          placeholder: 'טלפון'
        }
      ],
      buttons: [{
        text: 'חזור'
      },
      {
        text: 'הוסף',
        handler: data => {
          this.userAuth.auth.createUserWithEmailAndPassword(data.email, data.password).then(res => {
            this.firestore.createSupportRep(data.username, data.email, data.phone, res.user.uid);
          }).catch(error => console.log(error));
          }
      }]
    });
    alert.present();
  }



  async editSupport(x) {

    const alert = await this.alertController.create({
      header: 'עריכת נציג',
      inputs: [
        {
          name: 'username',
          placeholder: x.name,
          value: x.name
        },
        {
          name: 'email',
          placeholder: x.email,
          value: x.email
        },

        {
          name: 'phone',
          placeholder: x.phone,
          value: x.phone
        },
      ],
      buttons: [{
        text: 'חזור'
      },
      {
        text: 'שמור שינויים',
        handler: data => {
          console.log(x.SupportRepID);
          this.firestore.updateSupportRepDetails(x.SupportRepID, data.username, data.email, data.phone);
          x.username = data.username;
          x.email = data.email;
          x.phone = data.phone;
        }
      }]
    });
    alert.present();
  }

  async deleteSupport(x) {
    const alert = await this.alertController.create({
      header: 'אישור מחיקה',
      message: `האם את/ה בטוח/ה שברצונך למחוק את הנציג/ה?`,
      buttons: [
        { text: 'חזור' },
        {
          text: 'מחק',
          handler: () => {
            this.firestore.removeSupportRep(x.SupportRepID);
            this.list.splice(this.list.indexOf(x), 1);
          }
        }]
    });
    alert.present();
  }

}
