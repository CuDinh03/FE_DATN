import {Component, HostListener} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  @HostListener('window:beforeunload', ['$event'])
  clearLocalStorage(event: any) {
    // Clear localStorage
    localStorage.clear();
  }
}
