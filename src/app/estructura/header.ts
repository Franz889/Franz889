import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header style="background:#c62828; color:white; padding:10px 16px;">
      <strong>Biblioteca Virtual</strong>
    </header>
  `,
})
export class HeaderComponent {}
