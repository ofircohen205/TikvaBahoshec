import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-story-bubble',
  templateUrl: './story-bubble.component.html',
  styleUrls: ['./story-bubble.component.scss'],
})
export class StoryBubbleComponent implements OnInit {

@Input() data;
stringDate;

  constructor() { }

  ngOnInit() { 
    
       const timestampDate = this.data.date.seconds;   // save the date as timestamp
       this.stringDate = new Date(timestampDate * 1000).toLocaleDateString();
  }

}
