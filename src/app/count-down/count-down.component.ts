import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MomentDateModule,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
}

@Component({
  selector: 'app-count-down',
  templateUrl: './count-down.component.html',
  styleUrls: ['./count-down.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class CountDownComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;

  public dateInput = localStorage.getItem('dateInput');

  public dateNow = new Date();
  public dDay = !this.dateInput
    ? new Date('Dec 25 2021 00:00:00')
    : new Date(this.dateInput);
  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute = 60;

  public timeDifference;
  public secondsToDday;
  public minutesToDday;
  public hoursToDday;
  public daysToDday;

  private getTimeDifference() {
    this.timeDifference = new Date(this.dDay).getTime() - new Date().getTime();
    this.allocateTimeUnits(this.timeDifference);
  }

  private allocateTimeUnits(timeDifference) {
    this.secondsToDday = Math.floor(
      (timeDifference / this.milliSecondsInASecond) % this.SecondsInAMinute,
    );
    this.minutesToDday = Math.floor(
      (timeDifference / (this.milliSecondsInASecond * this.minutesInAnHour)) %
        this.SecondsInAMinute,
    );
    this.hoursToDday = Math.floor(
      (timeDifference /
        (this.milliSecondsInASecond *
          this.minutesInAnHour *
          this.SecondsInAMinute)) %
        this.hoursInADay,
    );
    this.daysToDday = Math.floor(
      timeDifference /
        (this.milliSecondsInASecond *
          this.minutesInAnHour *
          this.SecondsInAMinute *
          this.hoursInADay),
    );
  }

  saveValue(event: any): void {
    localStorage.setItem('dateInput', event);
  }

  resizeCounter(): void {
    const output = document.querySelector('.counter') as HTMLElement;
    const container = document.querySelector('.timer') as HTMLElement;

    let fontSize = window.getComputedStyle(output).fontSize;

    if (output.clientWidth - container.clientWidth > 10) {
      output.style.fontSize = parseFloat(fontSize) - 1 + 'px';
      if (output.clientWidth - container.clientWidth > 0) {
        this.resizeCounter();
      }
    } else {
      output.style.fontSize = parseFloat(fontSize) + 1 + 'px'
      if (container.clientWidth - output.clientWidth > 0) {
        this.resizeCounter();
      }
    }
  }

  checkOrientation() {
    if (window.innerWidth > window.innerHeight) return 'landscape';
    return 'portrait';
  }

  ngOnInit() {
    this.subscription = interval(1000).subscribe((x) => {
      this.getTimeDifference();
      this.resizeCounter();
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
