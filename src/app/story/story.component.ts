import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FirestoreService } from '../firebase/firestore/firestore.service';
import { AlertController } from '@ionic/angular';
// tslint:disable-next-line: max-line-length
import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService, QuickToolbarService } from '@syncfusion/ej2-angular-richtexteditor';
import { stringify } from 'querystring';
import { createElement } from '@syncfusion/ej2-base';
import { StoryBubbleComponent } from '../story-bubble/story-bubble.component';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService, QuickToolbarService],
})
export class StoryComponent implements OnInit, OnDestroy {

  constructor(
    private alertController: AlertController,
    private firestore: FirestoreService) { }

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
        this.stories = result;
    });
  }

  async sendStory() {
    if (this.title.value === '' || this.value === '') {
      const errorMsg = await this.alertController.create({
        header: 'שגיאה',
        message: 'אחד מהשדות לא מולאו. יש לוודא כי כל השדות מולאו',
        buttons: [{
          text: 'המשך',
        }]
      });

      errorMsg.present();
      return;
    }

    this.firestore.createStory(this.title.value, this.value);
    const msg = await this.alertController.create({
      header: 'הסיפור נשלח בהצלחה',
      message: 'תודה רבה ששיתפת אותנו במקרה האישי שלך! במידה והעדות תאושר ניתן יהיה לראותה באתר תוך מספר ימים',
      buttons: [{
        text: 'המשך',
      }]
    });
    msg.present();
    document.getElementById('tell-your-story').hidden = true;
    document.getElementById('scroll-to-editor-btn').hidden = true;
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
