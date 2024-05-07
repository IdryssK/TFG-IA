// progress.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private progress = new BehaviorSubject<number>(0);

  getProgress() {
    return this.progress.asObservable();
  }

  changeProgress(value: number) {
    this.progress.next(value);
  }
}