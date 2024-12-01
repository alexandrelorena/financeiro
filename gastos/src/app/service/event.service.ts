import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private statusChangeSubject = new Subject<void>();

  // Método para disparar o evento
  notifyStatusChange() {
    this.statusChangeSubject.next();
  }

  // Método para que outros componentes escutem o evento
  onStatusChange() {
    return this.statusChangeSubject.asObservable();
  }
}
