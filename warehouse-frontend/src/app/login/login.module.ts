import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login.component';
import {FormsModule} from '@angular/forms';
import {TrimValueAccessorModule} from 'ng-trim-value-accessor';


@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    TrimValueAccessorModule
  ]
})
export class LoginModule {
}
