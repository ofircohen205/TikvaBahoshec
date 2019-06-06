import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FirestoreService } from 'src/app/firebase/firestore/firestore.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { GlobalService } from '../global.service';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class LockedRoomGuard implements CanActivate {

  occupied = false;
  chatId = '';

  constructor(
    private router: Router,
    private firestore: FirestoreService,
    private userAuth: AngularFireAuth,
    private global: GlobalService,
    private afiredb: AngularFireDatabase) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean | Observable<boolean> | Promise<boolean> {
    // return new Promise((resolve, reject) => {
    //   this.afiredb.list('/ChatRooms/').snapshotChanges().subscribe(result1 => {
    //     result1.forEach(item => {
    //       this.chatId = item.key;
    //     });
    //     this.afiredb.list('/ChatRooms/' + this.chatId).valueChanges().subscribe(result2 => {
    //       console.log(result2[0]);
    //       if (result2[0]) {
    //         this.router.navigateByUrl('/');
    //         resolve(false);
    //       }
    //       this.afiredb.database.ref('/ChatRooms/' + this.chatId).set({ occupiedByClient: true });
    //       resolve(true);
    //     });
    //   });
    // });
    return true;
  }


}
