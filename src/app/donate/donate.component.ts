import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss'],
})
export class DonateComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }

  moveToJgive(){
    window.open("https://www.jgive.com/new/he/ils/donation-targets/3670?currency=ILS&utm_campaign=Leave_no_Child_in_the_Dark&utm_source=mail");
    }

}
