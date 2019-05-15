import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';
var routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', loadChildren: './home/home.module#HomePageModule' },
    { path: 'chat/:id', loadChildren: './chat/chat.module#ChatPageModule' },
    { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
    { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
    { path: '404', loadChildren: './not-found/not-found.module#NotFoundPageModule' },
    { path: '**', redirectTo: '404' }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = tslib_1.__decorate([
        NgModule({
            imports: [
                RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
            ],
            exports: [RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map