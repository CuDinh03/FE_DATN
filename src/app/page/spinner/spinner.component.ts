import {Component, Input} from '@angular/core';
import {SpinnerService} from "../../service/spinner.service";

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {
  @Input() isLoading: boolean = false;
}
