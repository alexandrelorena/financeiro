import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  isDarkMode = false;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    // Verifica se o tema escuro está armazenado no localStorage
    const isDarkTheme = localStorage.getItem('isDarkTheme') === 'true';
    this.isDarkMode = isDarkTheme; // Atualiza o estado da variável

    // Aplica a classe correspondente ao tema ao carregar
    this.applyTheme(this.isDarkMode);
  }

  toggleMode(): void {
    this.isDarkMode = !this.isDarkMode;
    // Salva o estado do tema no localStorage
    localStorage.setItem('isDarkTheme', String(this.isDarkMode));
    this.applyTheme(this.isDarkMode);
  }

  private applyTheme(isDark: boolean): void {
    if (isDark) {
      this.renderer.addClass(document.body, 'dark-theme');
      this.renderer.removeClass(document.body, 'light-theme');
    } else {
      this.renderer.addClass(document.body, 'light-theme');
      this.renderer.removeClass(document.body, 'dark-theme');
    }
  }
}
