import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirestoreService } from '../firebase/firestore/firestore.service';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss'],
})
export class CalenderComponent implements OnInit, OnDestroy {

  private today: Date;
  private currentMonth: any;
  private currentYear: any;
  private months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  //private monthAndYear = document.getElementById('monthAndYear');
  eventsArray: any[] = [];
  private first_show_flag: boolean = true;
  events_subscribe;

  constructor(
    private firestore: FirestoreService
  ) { }

  ngOnInit() {
    this.events_subscribe = this.firestore.getEvents().subscribe(result => {
      this.eventsArray = result;
    });

    this.today = new Date();
    this.currentMonth = this.today.getMonth();
    this.currentYear = this.today.getFullYear();



    this.showCalendar(this.currentMonth, this.currentYear);

  } // end of ngOnInit


  showCalendar(month, year) {
    const firstDay = (new Date(year, month)).getDay();

    const tbl = document.getElementById('calendar-body'); // body of the calendar

    // clearing all previous cells
    tbl.innerHTML = '';

    // filing data about month and in the page via DOM.
    let month_in_hebrew;
    switch (this.months[month]) {
      case "January":
        month_in_hebrew = "ינואר";
        break;
      case "February":
        month_in_hebrew = "פברואר";
        break;
      case "March":
        month_in_hebrew = "מרץ";
        break;
      case "April":
        month_in_hebrew = "אפריל";
        break;
      case "May":
        month_in_hebrew = "מאי";
        break;
      case "June":
        month_in_hebrew = "יוני";
        break;
      case "July":
        month_in_hebrew = "יולי";
        break;
      case "August":
        month_in_hebrew = "אוגוסט";
        break;
      case "September":
        month_in_hebrew = "ספטמבר";
        break;
      case "October":
        month_in_hebrew = "אוקטובר";
        break;
      case "November":
        month_in_hebrew = "נובמבר";
        break;
      case "December":
        month_in_hebrew = "דצמבר";
    }
    document.getElementById('monthAndYear').innerHTML = month_in_hebrew + " " + year;

    // creating all cells
    let date = 1, color_flag = true;;
    for (let i = 0; i < 6; i++) {
      // creates a table row
      const row = document.createElement('tr');

      // creating individual cells, filing them up with data.
      let cell, cellText, data, full_date;
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          cell = document.createElement('td');
          cell.setAttribute("style", "border-style: solid; background-color:#f9f9f9;");
          if (color_flag) {
            cell.setAttribute("style", "background-color:#e0d5d5;border-style: solid;");
            color_flag = false;
          }
          else
            color_flag = true;
          cellText = document.createTextNode('');
          data = document.createElement('div'); // div for the titles in the calendar
          cell.appendChild(cellText);
          cell.appendChild(data);
          row.appendChild(cell);
        } else if (date > this.daysInMonth(month, year)) {
          break;
        } else {
          cell = document.createElement('td');
          cell.setAttribute("style", "border-style: solid; background-color:#f9f9f9;");
          if (color_flag) {
            cell.setAttribute("style", "background-color:#e0d5d5;border-style: solid;");
            color_flag = false;
          }
          else
            color_flag = true;
          cellText = document.createTextNode(date.toString());
          data = document.createElement('div'); // div for the titles in the calendar
          if (date.toString().length === 1)
            full_date = "0" + date.toString() + "-";
          else
            full_date = date.toString() + "-";
          if (month.toString().length === 1)
            full_date += "0" + (month + 1) + "-";
          else
            full_date += (month + 1) + "-";

          full_date += year;
          data.setAttribute('id', full_date);
          data.setAttribute('class', 'divContent');

          if (date === this.today.getDate() && year === this.today.getFullYear() && month === this.today.getMonth()) {
            cell.setAttribute("style", "background-color: #d15e5e;") // color today's date
          }
          cell.appendChild(cellText); // the day in the month
          cell.appendChild(data);  // the events in the day
          row.appendChild(cell);
          date++;
        }
      }
      tbl.appendChild(row); // appending each row into calendar body.
    }

    if (this.first_show_flag === true) {
      setTimeout(() => { this.addEventsToCalendar() }, 2500);
      this.first_show_flag = false;
    }
    else
      this.addEventsToCalendar();
  } //end of showCalendar function


  // check how many days in a month
  daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
  }

  //show the events in the calendar
  addEventsToCalendar() {
    let day, month, year, date, card, card_header, card_content, span_date, span_title, content_title, content_content, cardArr:any[]=[];
    document.getElementById('event-description').innerHTML = "";
    this.eventsArray.forEach(event => {
      day = event.date.substring(8, 10);
      month = event.date.substring(5, 7);
      year = event.date.substring(0, 4);
      date = day + "-" + month + "-" + year;
      if (this.currentYear === Number(year) && this.currentMonth + 1 === Number(month)) {
        document.getElementById(date).innerHTML = event.title; //inject the title of the event to the calendar
      
      /*show the description about the events of the month*/
      card = document.createElement('ion-card');
      card.setAttribute('style', '--background:#e0d5d5;padding:2%;font-size:120%;color:rgb(20, 20, 20);margin:1% 15% 5% 15%;')
      card_header = document.createElement('ion-card-header').appendChild(document.createElement('ion-header'));
      span_date = document.createElement('span');
      span_date.setAttribute('style', 'float:left;')
      span_date.innerHTML = "תאריך האירוע: " + date;
      span_title = document.createElement('span');
      span_title.setAttribute('style', 'text-align:right;');
      span_title.innerHTML = "שם האירוע: " + event.title;
      card_header.appendChild(span_title);
      card_header.appendChild(span_date);

      card_content = document.createElement('ion-card-content');
      content_title = document.createElement('ion-card-header');
      content_title.setAttribute('style', 'text-decoration:underline;color:rgb(20, 20, 20);');
      content_title.innerHTML = "תיאור האירוע: ";
      content_content = document.createElement('ion-card-content');
      content_content.innerHTML = event.description;
      card_content.appendChild(content_title);
      card_content.appendChild(content_content);
      card.appendChild(card_header);
      card.appendChild(card_content);
      
      cardArr[Number(day)] = card;
      //document.getElementById('event-description').appendChild(card);
      }
    });

    for (let i = 0; i < cardArr.length; i++) {
      if (cardArr[i] === undefined || cardArr[i] === null)
      continue;
      else
      document.getElementById('event-description').appendChild(cardArr[i]);
    }
  }


  next() {
    this.currentYear = (this.currentMonth === 11) ? this.currentYear + 1 : this.currentYear;
    this.currentMonth = (this.currentMonth + 1) % 12;
    this.showCalendar(this.currentMonth, this.currentYear);
  }

  previous() {
    this.currentYear = (this.currentMonth === 0) ? this.currentYear - 1 : this.currentYear;
    this.currentMonth = (this.currentMonth === 0) ? 11 : this.currentMonth - 1;
    this.showCalendar(this.currentMonth, this.currentYear);
  }


  ngOnDestroy() {
    this.events_subscribe.unsubscribe();
  }

} //end of CalenderComponent


