import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  private dateMillis = 0;

  constructor() {
  }

  getDate(): string {
    let time = new Date().getTime();
    if (this.dateMillis >= time) {
      time = this.dateMillis + 1;
    }
    this.dateMillis = time;
    return new Date(time).toISOString();
  }
}
