import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SupplyComponent} from './supply.component';
import {FormsModule} from '@angular/forms';
import {TrimValueAccessorModule} from 'ng-trim-value-accessor';


@NgModule({
  declarations: [SupplyComponent],
  imports: [
    CommonModule,
    FormsModule,
    TrimValueAccessorModule
  ]
})
export class SupplyModule {
}
