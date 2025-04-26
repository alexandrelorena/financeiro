import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false,
})
export class AppComponent {
  title = 'gastos';
  showHeaderFooter = true;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Verifica se a rota atual é a página "page-not-found"
        this.showHeaderFooter =
          !event.urlAfterRedirects.includes('page-not-found');
        this.cdr.detectChanges();
      });
  }
}
