import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {SupplyComponent} from './supply/supply.component';
import {RampComponent} from './ramp/ramp.component';
import {AuthGuard} from './auth.guard';
import {StoreComponent} from './store/store.component';
import {PicklistComponent} from './picklist/picklist.component';
import {PickComponent} from './pick/pick.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'supply',
    component: SupplyComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'ramp',
    component: RampComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'store',
    component: StoreComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'picklist',
    component: PicklistComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pick',
    component: PickComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
