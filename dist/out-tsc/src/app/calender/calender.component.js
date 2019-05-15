import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
var CalenderComponent = /** @class */ (function () {
    function CalenderComponent() {
    }
    CalenderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.today = new Date();
        this.currentMonth = this.today.getMonth();
        this.currentYear = this.today.getFullYear();
        //this.selectYear = document.getElementById("year");
        //this.selectMonth = document.getElementById("month");
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var monthAndYear = document.getElementById("monthAndYear");
        this.showCalendar = function (month, year) {
            var firstDay = (new Date(year, month)).getDay();
            var tbl = document.getElementById("calendar-body"); // body of the calendar
            // clearing all previous cells
            tbl.innerHTML = "";
            // filing data about month and in the page via DOM.
            monthAndYear.innerHTML = months[month] + " " + year;
            //this.selectYear.value = year;
            //this.selectMonth.value = month;
            // creating all cells
            var date = 1;
            for (var i = 0; i < 6; i++) {
                // creates a table row
                var row = document.createElement("tr");
                //creating individual cells, filing them up with data.
                var cell = void 0, cellText = void 0;
                for (var j = 0; j < 7; j++) {
                    if (i === 0 && j < firstDay) {
                        cell = document.createElement("td");
                        cellText = document.createTextNode("");
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                    }
                    else if (date > daysInMonth(month, year)) {
                        break;
                    }
                    else {
                        cell = document.createElement("td");
                        cellText = document.createTextNode(date.toString());
                        if (date === _this.today.getDate() && year === _this.today.getFullYear() && month === _this.today.getMonth()) {
                            cell.classList.add("bg-info");
                        } // color today's date
                        cell.appendChild(cellText);
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
    };
    CalenderComponent.prototype.next = function () {
        this.currentYear = (this.currentMonth === 11) ? this.currentYear + 1 : this.currentYear;
        this.currentMonth = (this.currentMonth + 1) % 12;
        this.showCalendar(this.currentMonth, this.currentYear);
    };
    CalenderComponent.prototype.previous = function () {
        this.currentYear = (this.currentMonth === 0) ? this.currentYear - 1 : this.currentYear;
        this.currentMonth = (this.currentMonth === 0) ? 11 : this.currentMonth - 1;
        this.showCalendar(this.currentMonth, this.currentYear);
    };
    CalenderComponent = tslib_1.__decorate([
        Component({
            selector: 'app-calender',
            templateUrl: './calender.component.html',
            styleUrls: ['./calender.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], CalenderComponent);
    return CalenderComponent;
}());
export { CalenderComponent };
//# sourceMappingURL=calender.component.js.map