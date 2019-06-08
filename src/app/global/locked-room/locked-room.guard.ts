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
    return new Promise((resolve, reject) => {
      if (this.userAuth.auth.currentUser) {
        resolve(true);
      }

      if (this.userAuth.auth.currentUser === null) {
        this.router.navigateByUrl('/');
        resolve(false);
      } else if (this.userAuth.auth.currentUser.isAnonymous) {
        resolve(true);
      }
    });
  }

}
