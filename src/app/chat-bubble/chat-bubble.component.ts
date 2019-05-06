import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chat-bubble',
  templateUrl: './chat-bubble.component.html',
  styleUrls: ['./chat-bubble.component.scss'],
})
export class ChatBubbleComponent implements OnInit {

  @Input() data;
  @Input() fullName;

  constructor() { }

  ngOnInit() {}

  getContentColor(m) {
    if (this.fullName != null && m != null && this.fullName === m.from) {
      return 'red';
    }
  }

}
