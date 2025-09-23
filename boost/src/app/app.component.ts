import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BoostMainContainerComponent } from "./components/boost-main-container/boost-main-container.component";

@Component({
  selector: 'app-root',
  imports: [BoostMainContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'boost';
}
