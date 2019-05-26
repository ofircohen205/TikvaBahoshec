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
  //@ViewChild('description') description;
  stories = [];
  storiesArray = [];

  // variables for the text editor
  public value: string //=
  //`<br/>
  //כתוב על המקרה שלך כאן`;

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
    alert("תודה רבה ששיתפת אותנו במקרה האישי שלך! במידה והעדות תאושר ניתן יהיה לראותה באתר תוך מספר ימים")
    document.getElementById('tell-your-story').hidden = true;


  }

  showStories() {
    let html= "<span></span>";
    this.stories.forEach(story => {
      if (story.approved) {
        html += "<ion-card><ion-card-header><ion-card-title text-right>" + story.title + "</ion-card-title></ion-card-header><ion-card-content id = 'desc' text-right >" + story.description + "</ion-card-content></ion-card>"
      }
    });
    console.log(html);
    console.log(document.getElementById('upload-stories'));
    document.getElementById('upload-stories').innerHTML = html;

  }

  // manageStories() {
  //   this.firestore.getStoriesId().subscribe(results => {
  //     results.forEach(result => {
  //       const id = result.payload.doc.id;
  //       const data = result.payload.doc.data();
  //       const timestampDate = data['date']['seconds'];   // save the date as timestamp
  //       const stringDate = new Date(timestampDate * 1000).toDateString();  // save the date as a regular date form
  //       // const approval = data['approved'];

  //       this.storiesArray.push({stringDate, id, ...data });
  //       console.log(this.storiesArray);
  //     });

  //     this.storiesArray.sort((s1, s2) => {
  //       if (s1['date']['seconds'] > s2['date']['seconds']) {
  //         return 1;
  //       } else {
  //         return -1;
  //       }
  //     });
  //   });

  // }


  // editStory(story) {
  //   document.getElementById('save-edit').hidden = false;
  //   document.getElementById('defaultRTE').hidden = false;
  //   document.getElementById('defaultRTE').className = story.id;
  //   for (let i = 0; i < this.storiesArray.length; i++) {
  //     if (story.id === this.storiesArray[i].id) {
  //       this.value = this.storiesArray[i].description;  // edit the story
  //     }
  //   }
  // }

  // // delete the story from firebase and from the array of stories
  // deleteStory(story) {
  //   for (let i = 0; i < this.storiesArray.length; i++) {
  //       if (story.id === this.storiesArray[i].id) {
  //         for (let j = i + 1; j < this.storiesArray.length; j++) {  // the remove from the array doesn't work well
  //             this.storiesArray[j - 1] = this.storiesArray[j];
  //             this.storiesArray[j] = null;
  //         }
  //         this.firestore.removeStory(this.storiesArray[i].id);
  //       }
  //   }
  // }

  // // to confirm the story can be uploaded to the website
  // confirmStory(story) {
  //   for (let i = 0; i < this.storiesArray.length; i++) {
  //     if (story.id === this.storiesArray[i].id) {
  //       this.storiesArray[i].approved = true;
  //       this.firestore.confirmStory(this.storiesArray[i].id, true);
  //     }
  //   }
  // }

  // // after the story was edited, we save the changes in it
  // acceptStoryChange() {
  //   const storyId = document.getElementById('defaultRTE').className;
  //   let areEquals: number;
  //   for (let i = 0; i < this.storiesArray.length; i++) {
  //     areEquals = this.strcmp(storyId, i);
  //     if (areEquals === 0) {
  //       this.storiesArray[i].description = this.value;
  //       this.firestore.editStory(this.storiesArray[i].id, this.value);
  //       break;
  //     }
  //   }
  //   alert('יש ללחוץ בטבלה על הכפתור \'אשר\' עבור העדות הרצויה');
  //   document.getElementById('defaultRTE').hidden = true;
  //   document.getElementById('save-edit').hidden = true;
  // }

  // // compare 2 strings
  // private strcmp(storyId, i) {
  //   for (let j = 0, n = 20; j < n; j++) {
  //     if (storyId.toString().charAt(j) !== this.storiesArray[i].id.toString().charAt(j)) {
  //       return -1;
  //     }
  //   }
  //   return 0;
  // }

}
