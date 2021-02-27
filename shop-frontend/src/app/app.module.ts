import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {ModelService} from './model/model.service';
import {UserService} from './model/user/user.service';
import {ProductService} from './model/product/product.service';
import {LoginModule} from './login/login.module';
import {ShoppingModule} from './shopping/shopping.module';
import {OrderModule} from './order/order.module';
import {DeliveryModule} from './delivery/delivery.module';
import {OrderService} from './model/order/order.service';
import {DateService} from './model/date.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    LoginModule,
    ShoppingModule,
    OrderModule,
    DeliveryModule
  ],
  providers: [
    ModelService,
    UserService,
    ProductService,
    OrderService,
    DateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
