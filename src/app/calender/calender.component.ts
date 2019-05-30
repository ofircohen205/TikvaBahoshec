import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss'],

})
export class CalenderComponent implements OnInit {

  private today: Date;
  private currentMonth: any;
  private currentYear: any;
  private selectYear: any;
  private selectMonth: any;
  private showCalendar: Function;

  constructor() {

  }

  ngOnInit() {
    this.today = new Date();
    this.currentMonth = this.today.getMonth();
    this.currentYear = this.today.getFullYear();
    // this.selectYear = document.getElementById("year");
    // this.selectMonth = document.getElementById("month");

    // tslint:disable-next-line: max-line-length
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const monthAndYear = document.getElementById('monthAndYear');

    this.showCalendar = (month, year) => {
      const firstDay = (new Date(year, month)).getDay();

      const tbl = document.getElementById('calendar-body'); // body of the calendar

      // clearing all previous cells
      tbl.innerHTML = '';

      // filing data about month and in the page via DOM.
      let month_in_hebrew;
      switch (months[month]) {
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
      monthAndYear.innerHTML = month_in_hebrew + " " + year ;
      // this.selectYear.value = year;
      // this.selectMonth.value = month;

      // creating all cells
      let date = 1;
      for (let i = 0; i < 6; i++) {
        // creates a table row
        const row = document.createElement('tr');

        // creating individual cells, filing them up with data.
        let cell, cellText, data;
        for (let j = 0; j < 7; j++) {
          if (i === 0 && j < firstDay) {
            cell = document.createElement('td');
            cellText = document.createTextNode('');
            data = document.createElement('div');//new. for data
            cell.appendChild(cellText);
            cell.appendChild(data);
            row.appendChild(cell);
          } else if (date > daysInMonth(month, year)) {
            break;
          } else {
            cell = document.createElement('td')
            cellText = document.createTextNode(date.toString());
            data = document.createElement('div'); //new. for data
            data.setAttribute('id', date.toString() + "-" + (month + 1) + "-" + year);


            if (date === this.today.getDate() && year === this.today.getFullYear() && month === this.today.getMonth()) {
              cell.classList.add('bg-info');
            } // color today's date
            cell.appendChild(cellText); //the day in the month
            cell.appendChild(data);  //the events in the day
            row.appendChild(cell);
            date++;
          }
        }
        tbl.appendChild(row); // appending each row into calendar body.
      }
    };

    this.showCalendar(this.currentMonth, this.currentYear);

    // check how many days in a month code from https://dzone.com/articles/determining-number-days-month
    function daysInMonth(iMonth, iYear) {
      return 32 - new Date(iYear, iMonth, 32).getDate();
    }
    document.getElementById("7-7-2019").innerHTML = "a";

  }

  next() {
    this.currentYear = (this.currentMonth === 11) ? this.currentYear + 1 : this.currentYear;
    this.currentMonth = (this.currentMonth + 1) % 12;
    this.showCalendar(this.currentMonth, this.currentYear);
    document.getElementById("7-5-2019").innerHTML = "a";
  }

  previous() {
    this.currentYear = (this.currentMonth === 0) ? this.currentYear - 1 : this.currentYear;
    this.currentMonth = (this.currentMonth === 0) ? 11 : this.currentMonth - 1;
    this.showCalendar(this.currentMonth, this.currentYear);
    document.getElementById("7-5-2019").innerHTML = "a";
  }
}
