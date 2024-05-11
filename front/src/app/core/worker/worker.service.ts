import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {
  private worker: Worker;
  private messageSubject = new Subject<any>();
  public workerMessage = this.messageSubject.asObservable();

  constructor() {
    this.worker = new Worker(new URL('./azy.worker.ts', import.meta.url), { type: 'module' });
    this.worker.onmessage = ({ data }) => {
      this.messageSubject.next(data);
    };
  }

  postMessage(message: any) {
    this.worker.postMessage(message);
  }
}