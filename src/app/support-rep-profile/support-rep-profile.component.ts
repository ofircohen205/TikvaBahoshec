import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirestoreService } from '../firebase/firestore/firestore.service';
import { GlobalService } from '../global/global.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';


@Component({
  selector: 'app-support-rep-profile',
  templateUrl: './support-rep-profile.component.html',
  styleUrls: ['./support-rep-profile.component.scss']
})

export class SupportRepProfileComponent implements OnInit {
  chatReadyStatus = false;
  openChatList: any = [];
  supportRepOpenChatList: any = [];
  rooms: any[] = [];
  myChats: any [];
  dateStatus = true;
  nameStatus = true;
  stateStatus = true;
  myChatsCopy = [];
  txtMsg = '';


  constructor(
    private alertController: AlertController,
    private router: Router,
    private userAuth: AngularFireAuth,
    private firestore: FirestoreService,
    private global: GlobalService
  ) {

  }

  ngOnInit() {
    this.firestore.getOpenChatRooms().subscribe(result => {
        this.openChatList = result;
      this.createTable1(document.getElementById('supRepTBody1'), this.openChatList);

    });
    this.firestore.getSupportRepOpenChatRooms(this.userAuth.auth.currentUser.uid).subscribe(result => {
      this.supportRepOpenChatList = result;
      this.createTable2(document.getElementById('supRepTBody2'), this.supportRepOpenChatList);
    });

    this.firestore.getOwnChats(this.userAuth.auth.currentUser.uid).subscribe(result => {
      this.myChats = result;
      this.myChatsCopy = result;
      var scroll  = document.getElementById('scrollbar3')
      if(this.myChats.length>=4){
        scroll.style.height ='300px';
      }
        else
        scroll.style.height ='200px';
  });

  }
  async inShift() {
    var readyButton = document.getElementById('supportRepreadyButton');
    if(readyButton.getAttribute('color') === 'danger'){
      if(confirm('האם את/ה בטוח/ה רוצה להיכנס למשמרת')){
      readyButton.setAttribute('color', 'success');
      readyButton.textContent = 'במשמרת';
      this.firestore.updateSupportRepInShift(this.userAuth.auth.currentUser.uid, true);
      }
    } else {
      if(confirm('האם את/ה בטוח/ה רוצה לצאת ממשמרת')){
      readyButton.setAttribute('color', 'danger');
      readyButton.textContent = 'לא במשמרת';
      this.firestore.updateSupportRepInShift(this.userAuth.auth.currentUser.uid, false);

      }
    }
  }

  scrollToElement(e): void {
    this.global.scrollToElement(e);
  }

  

  async  createTable1(tbody, list: any[]) {
    var tbodyChildrens = tbody.childNodes;
    var scrollbar1 = document.getElementById('scrollbar1');
    if(list.length>=4){
      scrollbar1.style.height = '300px';
    } else {
      scrollbar1.style.height = '200px';
    }
    this.removeChildren(tbody,'supRepTBody1');
    var index = 1;
    for (let v of list) {
      var tr = document.createElement('tr');

      var button = document.createElement('ion-button');
      var td1 = document.createElement('td');
      td1.appendChild(button);
      td1.id = 'supRepTable1button_' + index;
      button.innerHTML = 'שיחה מחכה לנציג';
      button.color = 'success';

      if(v.occupied === true) {
        button.setAttribute('disabled', 'true');
        button.innerHTML = 'שיחה בטיפול';
        button.color = 'danger';
      }
      td1.style.color = 'white';
      td1.style.border = ' 1px solid #ddd';
      td1.style.padding = '8px';
      td1.style.borderCollapse = 'collapse';

      var td2 = document.createElement('td');
      td2.style.border = ' 1px solid #ddd';
      td2.style.padding = '8px';
      td2.style.borderCollapse = 'collapse';
      if(v.occupied === true) {
        td2.textContent = 'בטיפול';
      } else {
        td2.textContent = 'לא בטיפול';
      }

      var td3 = document.createElement('td');
      var name = '';
      td3.style.border = ' 1px solid #ddd';
      td3.style.padding = '8px';
      td3.style.borderCollapse = 'collapse';
      if(v.SupportRepName !== '' && v.SupportRepName !=null){
        td3.textContent = v.SupportRepName;
      } else {
       // console.log('kaka2');
        td3.textContent = '';
      }
      var td4 = document.createElement('td');
      td4.style.border = ' 1px solid #ddd';
      td4.style.padding = '8px';
      td4.style.borderCollapse = 'collapse';
      td4.textContent = new Date(v.timestamp).toLocaleString();

      var td5 = document.createElement('td');
      td5.style.border = ' 1px solid #ddd';
      td5.style.padding = '8px';
      td5.style.borderCollapse = 'collapse';
      // this.firestore.getSupportRepName(v.SupportRepID)
      td5.textContent = v.ClientName;

      var td6 = document.createElement('td');
      td6.style.border = ' 1px solid #ddd';
      td6.style.padding = '8px';
      td6.style.borderCollapse = 'collapse';
      td6.textContent = index.toString();
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      tr.appendChild(td5);
      tr.appendChild(td6);

      tr.id = 'supRepTable1Tr_' + index; 
      index++;
      tbody.appendChild(tr);
    }
    var tbodyChildrens = tbody.childNodes;
    for(let i = 0; i < tbody.childNodes.length; i++) {
      tbodyChildrens[i].addEventListener('mouseover', () => this.onmouseover(tbodyChildrens[i]));
      tbodyChildrens[i].addEventListener('mouseout', () => this.onmouseout(tbodyChildrens[i]));
      var trChildren = tbodyChildrens[i].childNodes;
      trChildren[0].addEventListener('click', () => this.onclickTable1(tbodyChildrens[i],list,i));
    }

  }


  async createTable2(tbody, list: any[]) {
    var tbodyChildrens = tbody.childNodes;
    this.removeChildren(tbody,'supRepTBody2');
    var scrollbar2 = document.getElementById('scrollbar2');
    if(list.length>=4){
      scrollbar2.style.height = '300px';
    } else {
      scrollbar2.style.height = '200px';
    }
    var index = 1;
    for (let v of list) {
      var tr = document.createElement('tr');

      var button1 = document.createElement('ion-button');
      var td1 = document.createElement('td');
      td1.appendChild(button1);
      td1.id = 'supRepTable2button1_' + index;
      button1.innerHTML = 'סגור שיחה';
      button1.color = 'success';
      td1.style.color = 'white';
      td1.style.border = ' 1px solid #ddd';
      td1.style.padding = '8px';
      td1.style.borderCollapse = 'collapse';


      var button2 = document.createElement('ion-button');
      var td2 = document.createElement('td');
      td2.appendChild(button2);
      td2.id = 'supRepTable2button2_' + index;
      button2.innerHTML = 'מילוי טופס לקוח';
      button2.color = 'success';
      td2.style.color = 'white';
      td2.style.border = ' 1px solid #ddd';
      td2.style.padding = '8px';
      td2.style.borderCollapse = 'collapse';

      var button3 = document.createElement('ion-button');
      var td3 = document.createElement('td');
      td3.appendChild(button3);
      td3.id = 'supRepTable2button3_' + index;
      button3.innerHTML = 'כנס לשיחה';
      button3.color = 'success';
      td3.style.color = 'white';
      td3.style.border = ' 1px solid #ddd';
      td3.style.padding = '8px';
      td3.style.borderCollapse = 'collapse';

      var td4 = document.createElement('td');
      td4.style.border = ' 1px solid #ddd';
      td4.style.padding = '8px';
      td4.style.borderCollapse = 'collapse';
      if(v.occupied === true) {
        td4.textContent = 'בטיפול';
      } else {
        td4.textContent = 'לא בטיפול';
      }

      var td5 = document.createElement('td');
      var name = '';
      td5.style.border = ' 1px solid #ddd';
      td5.style.padding = '8px';
      td5.style.borderCollapse = 'collapse';
      if(v.SupportRepName !== '' && v.SupportRepName !=null){
        td5.textContent = v.SupportRepName;
      } else {
        td5.textContent = 'no support name';
      }
      var td6 = document.createElement('td');
      td6.style.border = ' 1px solid #ddd';
      td6.style.padding = '8px';
      td6.style.borderCollapse = 'collapse';
      td6.textContent = new Date(v.timestamp).toLocaleString();

      var td7 = document.createElement('td');
      td7.style.border = ' 1px solid #ddd';
      td7.style.padding = '8px';
      td7.style.borderCollapse = 'collapse';
      td7.textContent = v.ClientName;

      var td8 = document.createElement('td');
      td8.style.border = ' 1px solid #ddd';
      td8.style.padding = '8px';
      td8.style.borderCollapse = 'collapse';
      td8.textContent = index.toString();
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      tr.appendChild(td5);
      tr.appendChild(td6);
      tr.appendChild(td7);
      tr.appendChild(td8);

      tr.id = 'supRepTable2Tr_' + index; 
      index++;
      tbody.appendChild(tr);
    }
    //console.log(tbody);
    var tbodyChildrens = tbody.childNodes;
    for(let i = 0; i < tbody.childNodes.length; i++) {
      tbodyChildrens[i].addEventListener('mouseover', () => this.onmouseover(tbodyChildrens[i]));
      tbodyChildrens[i].addEventListener('mouseout', () => this.onmouseout(tbodyChildrens[i]));
      var trChildren = tbodyChildrens[i].childNodes;
      trChildren[0].addEventListener('click', () => this.onclickTable2(tbodyChildrens[i].childNodes[0],list,i));
      trChildren[1].addEventListener('click', () => this.onclickTable2(tbodyChildrens[i].childNodes[1],list,i));
      trChildren[2].addEventListener('click', () => this.onclickTable2(tbodyChildrens[i].childNodes[2],list,i));
    }

  }

  onmouseover(e) {
    e.style.background = '#ddd';
  }
  onmouseout(e) {
    e.style.background = 'white';
  }

  onclickTable1(e,list,index) {
    if(e.childNodes[1].textContent === 'לא בטיפול'){
    this.firestore.getSupportRepName(this.userAuth.auth.currentUser.uid).subscribe(result =>{
      this.firestore.updateChatRooms(list[index]['ChatRoomId'],result['name'], this.userAuth.auth.currentUser.uid);
      window.open('/chat/' + list[index]['ChatRoomId'], '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
    });
  }
   }

   onclickTable2(e,list,index) {
    if(e['id'] === 'supRepTable2button1_' + (index + 1)){
      if(confirm('האם את/ה בטוח/ה רוצה לסגור את השיחה')){
        this.firestore.updateChatRoomOpenField( list[index]['ChatRoomId'], false);
      }
    }
    if(e['id'] === 'supRepTable2button2_' + (index + 1)){
    }
    if(e['id'] === 'supRepTable2button3_' + (index + 1)){
      window.open('/chat/' + list[index]['ChatRoomId'], '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
    }
   }

   async removeChildren(tbody,tbodyId){
     var size = tbody.childNodes.length;
     var tbody1 = document.getElementById(tbodyId);
     while (tbody1.firstChild) {
      tbody1.removeChild(tbody1.firstChild);
   }
    }

    sortByDate(dateStatus){
    var nameBtn =(<HTMLButtonElement>document.getElementById("dateBtn"))
    if(dateStatus==true){
      this.myChats.sort((a,b)=> (a.timestamp>=b.timestamp)? 1:-1)
      this.dateStatus=false
      nameBtn.innerHTML ='&#8657; שעה ותאריך פתיחת החדר'
    }
    else{
      this.myChats.sort((a,b)=> (a.timestamp<=b.timestamp)? 1:-1)
    this.dateStatus=true;
    nameBtn.innerHTML ='&#8659; שעה ותאריך פתיחת החדר'
    
    }
}


sortByName(nameStatus){
  var nameBtn =(<HTMLButtonElement>document.getElementById("nameBtn"))
    if(nameStatus==true){
      this.myChats.sort((a,b)=> (a.ClientName>=b.ClientName)? 1:-1)
      this.nameStatus=false
      nameBtn.innerHTML ='&#8657; שם הלקוח'
    }
    else{
      this.myChats.sort((a,b)=> (a.ClientName<=b.ClientName)? 1:-1)
    this.nameStatus=true;
    nameBtn.innerHTML ='&#8659; שם הלקוח'
 }

}


sortByState(stateStatus){
  var stateBtn =(<HTMLButtonElement>document.getElementById("stateBtn"))
    if(stateStatus==true){
      this.myChats.sort((a,b)=>a.open-b.open)
      this.stateStatus=false
      stateBtn.innerHTML ='&#8657; מצב החדר'
    }
    else{
      this.myChats.sort((a,b)=>b.open-a.open)
    this.stateStatus=true;
    stateBtn.innerHTML ='&#8659; מצב החדר'
 }

}


wakeUpDate(){
  var dateFrom =  (<HTMLInputElement>document.getElementById('Cdate1')).value;
  var dateTo = document.getElementById("Cdate2");
  (<HTMLInputElement>(dateTo)).value="";

  
   dateTo.setAttribute("min",dateFrom);

}


clearFields(){
  var name = (<HTMLInputElement>document.getElementById('Cname'));
  var dateFrom =  (<HTMLInputElement>document.getElementById('Cdate1'));
  var dateTo =  (<HTMLInputElement>document.getElementById('Cdate2'));

  name.value =""
  dateFrom.value=""
  dateTo.value =""
  this.myChats = Object.assign([], this.myChatsCopy);
  
 
  }


searchChat(){
  this.myChats = Object.assign([], this.myChatsCopy);
  var name = (<HTMLInputElement>document.getElementById('Cname')).value;
  var date1 =  (<HTMLInputElement>document.getElementById('Cdate1')).value;
  var date2 =  (<HTMLInputElement>document.getElementById('Cdate2')).value;

  if(date1=="")
    date1="1/1/2018"

  if(date2=="")
    date2 = Date().toString()  


  var dateFrom =new Date(date1)
  var dateTo =new Date(date2)

  dateTo.setHours(dateTo.getHours()+21)
  dateFrom.setHours(dateFrom.getHours()-3)
 



  this.myChats =[]
        this.myChatsCopy.forEach(a=>{
        if(a.ClientName.search(name)!=-1){
          var clientDate = new Date(a.timestamp);
          if(clientDate>=dateFrom && clientDate<=dateTo){
            
             this.myChats.push(a)
          }
        }
      }) 
  



}



openRoom(roomId){
window.open('/chat/' +roomId, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');

}

downloadChatMsg(roomId){
  
this.firestore.getChatMessages(roomId).subscribe(result =>{
  
result.forEach(msg=>{
  
  this.txtMsg+="From:"+msg.from +" Time:" +new Date(msg.timestamp)
  this.txtMsg+="\n<"+msg.content +">\n\n"
  
})
console.log("startDownload")
var link = document.createElement('a');
link.download = 'Chat:'+roomId+'.txt';
var blob = new Blob([this.txtMsg], {type: 'text/plain'});
link.href = window.URL.createObjectURL(blob);
link.click();
})


}

 

}



