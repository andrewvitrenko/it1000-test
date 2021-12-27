import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.scss']
})
export class StopwatchComponent implements OnInit {
  stream: Observable<number>;
  time: number = 0;
  hours: number;
  minutes: number;
  seconds: number;
  interval: NodeJS.Timeout;
  status: 'going' | 'paused' | 'changing' = 'paused';
  waitingTimeout: NodeJS.Timeout;

  constructor() { }

  ngOnInit(): void {
    this.parser(this.time);
  }

  start() {
    this.stream = new Observable(observer => {
      this.time = this.time || 0;
      observer.next(this.time);
      this.interval = setInterval(() => observer.next(this.time++), 1000);
    });
    this.stream.subscribe(value => this.parser(value));
    this.status = 'going';
  }

  stop() {
    this.status = 'paused';
    clearInterval(this.interval);
    this.time = 0;
    this.parser(this.time);
  }

  reset() {
    this.time = 0;
    this.start();
  }

  wait() {
    if (this.status === 'going') {
      this.waitingTimeout = setTimeout(() => {
        clearTimeout(this.waitingTimeout);
        this.status = 'going';
      }, 300);
      this.status = 'changing';
    } else if (this.status === 'changing') {
      clearInterval(this.interval);
      this.status = 'paused';
      clearTimeout(this.waitingTimeout);
    }
  }

  parser(time: number): void {
    this.hours = Math.floor(time / 3600);
    this.minutes = Math.floor(time  / 60 - 60 * this.hours);
    this.seconds = time - this.hours * 3600 - this.minutes * 60;
  }

}
