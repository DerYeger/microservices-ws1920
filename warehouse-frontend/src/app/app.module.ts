import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginModule} from './login/login.module';
import {SupplyModule} from './supply/supply.module';
import {ModelService} from './model/model.service';
import {UserService} from './model/user/user.service';
import {PalletService} from './model/pallet/pallet.service';
import {RampModule} from './ramp/ramp.module';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {StoreModule} from './store/store.module';
import {OrderService} from './model/order/order.service';
import {PicklistModule} from './picklist/picklist.module';
import {PickModule} from './pick/pick.module';
import {DateService} from './model/date.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LoginModule,
    SupplyModule,
    RampModule,
    StoreModule,
    PicklistModule,
    PickModule,
    HttpClientModule
  ],
  providers: [
    ModelService,
    UserService,
    PalletService,
    OrderService,
    DateService,
    HttpClient
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}

