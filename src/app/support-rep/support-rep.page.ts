import { Component, OnInit, ViewChild } from '@angular/core';
import { FirestoreService } from '../firebase/firestore/firestore.service';
import { GlobalService } from '../global/global.service';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-support-rep',
  templateUrl: './support-rep.page.html',
  styleUrls: ['./support-rep.page.scss'],
})
export class SupportRepPage implements OnInit {

  @ViewChild('first_name') first_name;
  @ViewChild('last_name') last_name;
  @ViewChild('id') id;
  @ViewChild('address') address;
  @ViewChild('age') age;
  @ViewChild('cellphone') cellphone;
  @ViewChild('phone_num') phone_num;
  @ViewChild('email') email;
  @ViewChild('password') password;
  @ViewChild('male') male;
  @ViewChild('female') female;
  @ViewChild('other') other;
  @ViewChild('admin') admin;
  supportRepId = '';
  adminsList = [];
  numOfChanges = 0;

  constructor(
    private firestore: FirestoreService,
    private global: GlobalService,
    private activatedRoute: ActivatedRoute,
    private userAuth: AngularFireAuth,
    private alertController: AlertController) { }

  ngOnInit() {
    this.firestore.getAdmins().subscribe(result => {
      result['admins'].forEach(item => {
        this.adminsList.push(item);
      });
    });

    this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.supportRepId = params['id'];
        this.firestore.getSupportRepDetails(params.id).subscribe(res => {
          this.first_name.value = res.first_name;
          this.last_name.value = res.last_name;
          this.age.value = res.age;
          this.address.value = res.address;
          this.email.value = res.email;
          this.phone_num.value = res.phone_num;
          this.cellphone.value = res.cellphone;
          this.id.value = res.id;
          this.password.value = res.password;
          if (res.gender === 'זכר') {
            this.male.checked = true;
          } else if (res.gender === 'נקבה') {
            this.female.checked = true;
          } else if (res.gender === 'אחר') {
            this.other.checked = true;
          }

          if (this.adminsList.includes(this.supportRepId)) {
            this.admin.checked = true;
          }
        });
      }
    });
  }

  async createSupportRep() {

// tslint:disable-next-line: max-line-length
    if (this.first_name.value === '' || this.last_name.value === '' || this.id.value === '' || this.address.value === '' || this.age.value === '' || this.cellphone.value === '' || this.phone_num.value === '' || this.email.value === '' || this.password.value === '') {
      const errorMsg = await this.alertController.create({
        header: 'שגיאה',
        message: 'אחד מהשדות לא מולאו. יש לוודא כי כל השדות מולאו',
        buttons: [{
          text: 'המשך',
        }]
      });

      return errorMsg.present();
    }

    this.userAuth.auth.createUserWithEmailAndPassword(this.email.value, this.password.value).then(result => {
      if (this.male.checked) {
// tslint:disable-next-line: max-line-length
        this.firestore.createSupportRep(result.user.uid, this.first_name.value, this.last_name.value, this.id.value, this.address.value, this.age.value, this.email.value, this.cellphone.value, this.phone_num.value, 'זכר');
      } else if (this.female.checked) {
// tslint:disable-next-line: max-line-length
        this.firestore.createSupportRep(result.user.uid, this.first_name.value, this.last_name.value, this.id.value, this.address.value, this.age.value, this.email.value, this.cellphone.value, this.phone_num.value, 'נקבה');
      } else if (this.other.checked) {
// tslint:disable-next-line: max-line-length
        this.firestore.createSupportRep(result.user.uid, this.first_name.value, this.last_name.value, this.id.value, this.address.value, this.age.value, this.email.value, this.cellphone.value, this.phone_num.value, 'אחר');
      }
    });

    const alert = await this.alertController.create({
      header: 'נציג הוקם בהצלחה',
      message: 'נציג זה הוקם בהצלחה. אנא לחץ המשך ליציאה',
      buttons: [{
        text: 'המשך',
        handler: () => window.close()
      }]
    });

    alert.present();
  }

  async updateSupportRep() {

    // tslint:disable-next-line: max-line-length
    if (this.first_name.value === '' || this.last_name.value === '' || this.id.value === '' || this.address.value === '' || this.age.value === '' || this.cellphone.value === '' || this.phone_num.value === '' || this.email.value === '' || this.password.value === '') {
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
      this.firestore.updateSupportRepDetails(this.supportRepId, this.first_name.value, this.last_name.value, this.id.value, this.address.value, this.age.value, this.email.value, this.cellphone.value, this.phone_num.value, 'זכר');
    } else if (this.female.checked) {
// tslint:disable-next-line: max-line-length
      this.firestore.updateSupportRepDetails(this.supportRepId, this.first_name.value, this.last_name.value, this.id.value, this.address.value, this.age.value, this.email.value, this.cellphone.value, this.phone_num.value, 'נקבה');
    } else if (this.other.checked) {
// tslint:disable-next-line: max-line-length
      this.firestore.updateSupportRepDetails(this.supportRepId, this.first_name.value, this.last_name.value, this.id.value, this.address.value, this.age.value, this.email.value, this.cellphone.value, this.phone_num.value, 'אחר');
    }

    const alert = await this.alertController.create({
      header: 'נציג עודכן בהצלחה',
      message: 'נציג זה עודכן בהצלחה. אנא לחץ המשך ליציאה',
      buttons: [{
        text: 'המשך',
        handler: () => window.close()
      }]
    });

    alert.present();
  }

  updateAdminList() {

    if (this.numOfChanges === 1) {
      return;
    }

    if (this.admin.checked) {
      const index = this.adminsList.indexOf(this.supportRepId);
      this.adminsList.splice(this.adminsList.indexOf(this.supportRepId), 1);
      this.firestore.updateAdminList(this.adminsList);
    } else {
      const isAdminAlready = this.adminsList.includes(this.supportRepId);
      if (!isAdminAlready) {
        this.adminsList.push(this.supportRepId);
        this.firestore.updateAdminList(this.adminsList);
      }
    }
    this.numOfChanges++;

  }

}
