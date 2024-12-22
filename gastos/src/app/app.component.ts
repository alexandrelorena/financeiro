import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { filter } from 'rxjs'; // Para filtrar eventos de navegação

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'gastos';
  // showHeaderFooter: boolean = true;

  constructor() {}

  // constructor(private router: Router) {
  //   this.router.events
  //     .pipe(filter((event) => event instanceof NavigationEnd))
  //     .subscribe((event: NavigationEnd) => {

  //       this.showHeaderFooter =
  //         event.url !== '/page-not-found' &&
  //         !event.url.includes('page-not-found');
  //     });
  // }
}
