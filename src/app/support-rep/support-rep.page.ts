import { Component, OnInit, ViewChild } from '@angular/core';
import { FirestoreService } from '../firebase/firestore/firestore.service';
import { GlobalService } from '../global/global.service';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

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
  supportRepId = '';

  constructor(
    private firestore: FirestoreService,
    private global: GlobalService,
    private activatedRoute: ActivatedRoute,
    private userAuth: AngularFireAuth) { }

  ngOnInit() {
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
        });
      }
    });
  }

  createSupportRep() {
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
  }

  updateSupportRep() {
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
  }

}
