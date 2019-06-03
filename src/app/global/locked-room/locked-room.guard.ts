import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FirestoreService } from 'src/app/firebase/firestore/firestore.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { GlobalService } from '../global.service';

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
    private global: GlobalService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean | Observable<boolean> | Promise<boolean> {
    // return new Promise((resolve, reject) => {
    //   this.firestore.getOccupiedByClientField(this.global.currentChatRoomId).subscribe(result => {
    //     if (!result['occupiedByClient']) {
    //       resolve(true);
    //     } else {
    //       alert('אנא פתח שיחה חדשה');
    //       this.router.navigateByUrl('/');
    //       resolve(false);
    //     }
    //   });
    // });
    return true;
  }


}
