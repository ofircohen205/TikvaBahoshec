import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onclick(e): void {

    const AdminElement = document.getElementById('admin');
    const supportRepElement = document.getElementById('supportRep');
    const x = e.target.value;
    if (x === 'admin') {
      if (AdminElement.hidden === true) {
        AdminElement.hidden = false;
        supportRepElement.hidden = true;
      }
    } else {
      if (supportRepElement.hidden === true) {
        AdminElement.hidden = true;
        supportRepElement.hidden = false;
      }
    }
  }

}
