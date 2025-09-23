import { Component } from '@angular/core';
import { HomeComponent } from '../home/home.component';
@Component({
  selector: 'app-container',
  imports: [HomeComponent],
  templateUrl: './container.component.html',
  standalone: true,
  styleUrl: './container.component.scss'
})
export class ContainerComponent {

}
