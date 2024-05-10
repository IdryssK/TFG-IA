// progress.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private stateSource = new BehaviorSubject('idle');
  currentState = this.stateSource.asObservable();

  changeState(state: string) {
    this.stateSource.next(state);
  }
  private progressSource = new BehaviorSubject<number>(0);
  progress = this.progressSource.asObservable();

  changeProgress(value: number) {
    this.progressSource.next(value);
  }
}