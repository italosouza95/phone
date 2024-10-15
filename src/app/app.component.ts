import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PhoneNumberComponent } from "./components/phone-number/phone-number.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PhoneNumberComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
