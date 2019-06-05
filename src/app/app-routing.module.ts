import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './global/auth/auth.guard';
import { LockedRoomGuard } from './global/locked-room/locked-room.guard';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'chat/:id', loadChildren: './chat/chat.module#ChatPageModule', canActivate: [LockedRoomGuard] },
  { path: 'client-profile/:id', loadChildren: './client-profile/client-profile.module#ClientProfilePageModule', canActivate: [AuthGuard] },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule', canActivate: [AuthGuard] },
  { path: '404', loadChildren: './not-found/not-found.module#NotFoundPageModule' },
  { path: '**', redirectTo: '404' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
