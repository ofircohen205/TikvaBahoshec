import { Component, OnInit, ViewChild } from '@angular/core';
import { FirestoreService } from '../firebase/firestore/firestore.service';

import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService, QuickToolbarService } from '@syncfusion/ej2-angular-richtexteditor';
import { stringify } from 'querystring';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss'],

  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService, QuickToolbarService],
})
export class StoryComponent implements OnInit {
  alertController: any;

  constructor(private firestore: FirestoreService) { }

  @ViewChild('title') title;
  // @ViewChild('description') description;
  stories = [];
  storiesArray = [];

  // variables for the text editor
  public value: string; // =
  // `<br/>
  // כתוב על המקרה שלך כאן`;

  public tools: object = {
    items: ['Undo', 'Redo', '|',
      'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
      /*'SubScript', 'SuperScript', '|',
      'LowerCase', 'UpperCase', '|',*/
      'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
      'Indent', 'Outdent', '|', 'CreateLink', 'CreateTable',
      'Image', '|', 'ClearFormat', /* 'Print',*/ 'SourceCode', '|', 'FullScreen']
  };
  public quickTools: object = {
    image: [
      'Replace', 'Align', 'Caption', 'Remove', 'InsertLink', '-', 'Display', 'AltText', 'Dimension']
  };

  ngOnInit() {
    this.firestore.getStories().subscribe(result => {
      result.sort((s1, s2) => {
        if (s1['timestamp'] > s2['timestamp']) {
          return 1;
        } else {
          return -1;
        }
      });
      if (this.stories.length <= 0) {
        this.stories = result;
      } else {
        this.stories.push(result[result.length - 1]);
      }

      this.showStories();
    });

  }

  sendStory() {
    console.log(this.value);
    this.firestore.createStory(this.title.value, this.value);
    alert('תודה רבה ששיתפת אותנו במקרה האישי שלך! במידה והעדות תאושר ניתן יהיה לראותה באתר תוך מספר ימים');
    document.getElementById('tell-your-story').hidden = true;


  }

  showStories() {
    let html = '<span></span>';
    this.stories.forEach(story => {
      if (story.approved) {
        html += "<ion-card><ion-card-header><ion-card-title text-right>" +
                story.title +
                "</ion-card-title></ion-card-header><ion-card-content id = 'desc' text-right >" +
                story.description + "</ion-card-content></ion-card>"
      }
    });
    console.log(html);
    console.log(document.getElementById('upload-stories'));
    document.getElementById('upload-stories').innerHTML = html;

  }

}
