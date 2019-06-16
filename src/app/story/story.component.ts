import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FirestoreService } from '../firebase/firestore/firestore.service';

// tslint:disable-next-line: max-line-length
import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService, QuickToolbarService } from '@syncfusion/ej2-angular-richtexteditor';
import { stringify } from 'querystring';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss'],

  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService, QuickToolbarService],
})
export class StoryComponent implements OnInit, OnDestroy {
  alertController: any;

  constructor(private firestore: FirestoreService) { }

  @ViewChild('title') title;
  stories = [];
  storiesArray = [];
  stories_subscribe;
  template_subscribe;
  template_flag: boolean = false;

  // variables for the text editor
  public value: string;


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
    this.stories_subscribe = this.firestore.getStories().subscribe(result => {
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

  async sendStory() {

    if (this.title.value === '') {
      const errorMsg = await this.alertController.create({
        header: 'שגיאה',
        message: 'אחד מהשדות לא מולאו. יש לוודא כי כל השדות מולאו',
        buttons: [{
          text: 'המשך',
        }]
      });

      return errorMsg.present();
    }

    this.firestore.createStory(this.title.value, this.value);
    alert('תודה רבה ששיתפת אותנו במקרה האישי שלך! במידה והעדות תאושר ניתן יהיה לראותה באתר תוך מספר ימים');
    document.getElementById('tell-your-story').hidden = true;
    document.getElementById('scroll-to-editor-btn').hidden = true;
  }

  showStories() {
    let html = '<span></span>';
    this.stories.forEach(story => {
      if (story.approved) {
        html += '<ion-card style="background-color: rgb(135, 86, 86);"><ion-card-header><ion-card-title text-right style="color: white;text-decoration: underline;">' +
          story.title +
          '</ion-card-title></ion-card-header><ion-card-content id = \'desc\' text-right style="color: white";>' +
          story.description + '</ion-card-content></ion-card><br/>';
      }
    });
    document.getElementById('upload-stories').innerHTML = html;
  }


  writeYourStory() {
    document.getElementById('defaultRTE').scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });

    let storyTemplate = window.open( '', '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
    this.firestore.getStoryTemplate().subscribe(result => {
      storyTemplate.document.body.innerHTML =  result.storyTemplate;
      storyTemplate.document.body.setAttribute("style", "text-align: right;");
      storyTemplate.document.body.setAttribute("lang","he");
      storyTemplate.document.body.setAttribute("dir","rtl");
    });

    //also need to check in admin profile why when change the template it goes to the support rep tab
  }


  ngOnDestroy() {
    this.stories_subscribe.unsubscribe();
    if (this.template_flag)
      this.template_subscribe.unsubscribe();
  }
}
