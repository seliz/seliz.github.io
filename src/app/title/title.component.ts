import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  HostListener,
} from '@angular/core';
import { Subscription, interval, fromEvent, Observable } from 'rxjs';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css'],
})
export class TitleComponent implements OnInit {
  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;

  public titleName = !localStorage.getItem('titleInput')
    ? 'New Years Eve '
    : localStorage.getItem('titleInput');
  public titleFontSize = !localStorage.getItem('titleFontSize')
    ? '8vw'
    : localStorage.getItem('titleFontSize');

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.resizeSubscription$.unsubscribe();
  }

  saveValue(event: any): void {
    localStorage.setItem('titleInput', event);
  }

  resizeTitle(): void {
    const output = document.querySelector('.title') as HTMLElement;
    const container = document.querySelector('.container') as HTMLElement;

    let fontSize = window.getComputedStyle(output).fontSize;

    if (output.clientWidth >= container.clientWidth) {
      output.style.fontSize = parseFloat(fontSize) - 1 + 'px';
      if (output.clientWidth - container.clientWidth > 0) {
        this.resizeTitle();
      }
    } else {
      output.style.fontSize = parseFloat(fontSize) + 1 + 'px';
      if (container.clientWidth - output.clientWidth > 0) {
        this.resizeTitle();
      }
    }
    localStorage.setItem('titleFontSize', fontSize);
  }

  checkOrientation() {
    if (window.outerWidth > window.outerHeight) return 'landscape';
    return 'portrait';
  }

  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(event) {
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe((evt) => {
      this.resizeTitle();
    })
  }
}
