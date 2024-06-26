import { AuthenticationService } from './../../service/AuthenticationService';
import { Router } from '@angular/router';
import { HoaDonChiTietService } from './../../service/HoaDonChiTietService';
import { Component } from '@angular/core';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent {
  currentStatus: number = 4;
  hoaDonChiTiet: any = {};
  constructor(private auth: AuthenticationService, private router: Router,
    private hoaDonChiTietService: HoaDonChiTietService
  ) { }

}
