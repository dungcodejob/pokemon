import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from '@shared/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [RouterOutlet],
})
export class App implements OnInit {
  themeService = inject(ThemeService);

  ngOnInit(): void {
    this.themeService.initialize();
  }

  isCollapsed = false;
}
