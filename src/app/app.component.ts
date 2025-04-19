import { Component } from '@angular/core';
import { LaptopOrdersComponent } from './laptop-orders/laptop-orders.component';

@Component({
    selector: 'app-root',
    imports: [LaptopOrdersComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-signalR';
}
