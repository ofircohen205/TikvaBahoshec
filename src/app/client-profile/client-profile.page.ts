import { Component, OnInit, ViewChild } from '@angular/core';
import { FirestoreService } from '../firebase/firestore/firestore.service';
import { GlobalService } from '../global/global.service';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.page.html',
  styleUrls: ['./client-profile.page.scss'],
})
export class ClientProfilePage implements OnInit {

  @ViewChild('age') age;
  @ViewChild('address') address;
  @ViewChild('last_name') last_name;
  @ViewChild('first_name') first_name;
  @ViewChild('email') email;
  @ViewChild('phone_num') phone_num;
  @ViewChild('cellphone') cellphone;
  @ViewChild('brief') brief;
  @ViewChild('comments') comments;
  @ViewChild('male') male;
  @ViewChild('female') female;
  @ViewChild('other') other;
  clientId = '';

  constructor(
    private firestore: FirestoreService,
    private global: GlobalService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.clientId = params.id;
      this.firestore.getClientDetails(params.id).subscribe(res => {
        this.first_name.value = res.first_name;
        this.last_name.value = res.last_name;
        this.age.value = res.age;
        this.address.value = res.address;
        this.email.value = res.email;
        this.phone_num.value = res.phone_num;
        this.cellphone.value = res.cellphone;
        this.comments.value = res.comments;
        this.brief.value = res.brief;
        if (res.gender === 'male') {
          this.male.checked = true;
        } else if (res.gender === 'female') {
          this.female.checked = true;
        } else if (res.gender === 'other') {
          this.other.checked = true;
        }
      });
    });
  }

  async updateClientProfile() {

// tslint:disable-next-line: max-line-length
    if (this.first_name.value === '' || this.last_name.value === '' || this.address.value === '' || this.age.value === '' || this.cellphone.value === '' || this.phone_num.value === '' || this.email.value === '') {
      const errorMsg = await this.alertController.create({
        header: 'שגיאה',
        message: 'אחד מהשדות לא מולאו. יש לוודא כי כל השדות מולאו',
        buttons: [{
          text: 'המשך',
        }]
      });

      return errorMsg.present();
    }

    if (this.male.checked) {
// tslint:disable-next-line: max-line-length
      this.firestore.updateClientDetails(this.clientId, this.first_name.value, this.last_name.value, this.address.value, this.age.value, this.cellphone.value, this.phone_num.value, this.email.value, 'male', this.brief.value, this.comments.value);
    } else if (this.female.checked) {
// tslint:disable-next-line: max-line-length
      this.firestore.updateClientDetails(this.clientId, this.first_name.value, this.last_name.value, this.address.value, this.age.value, this.cellphone.value, this.phone_num.value, this.email.value, 'female', this.brief.value, this.comments.value);
    } else {
// tslint:disable-next-line: max-line-length
      this.firestore.updateClientDetails(this.clientId, this.first_name.value, this.last_name.value, this.address.value, this.age.value, this.cellphone.value , this.phone_num.value, this.email.value, 'other', this.brief.value, this.comments.value);
    }

    const alert = await this.alertController.create({
      header: 'לקוח עודכן בהצלחה',
      message: 'לקוח זה עודכן בהצלחה. אנא לחץ המשך ליציאה',
      buttons: [{
        text: 'המשך',
        handler: () => window.close()
      }]
    });

    alert.present();

  }

}
