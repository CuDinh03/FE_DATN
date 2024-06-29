import { Component } from '@angular/core';
import {HoaDonService} from "../../service/HoaDonService";
import {HoaDonChiTietService} from "../../service/HoaDonChiTietService";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../service/AuthenticationService";
import {MatSnackBar} from "@angular/material/snack-bar";
import {KhachHangService} from "../../service/KhachHangService";

@Component({
  selector: 'app-rating-view',
  templateUrl: './rating-view.component.html',
  styleUrls: ['./rating-view.component.css']
})
export class RatingViewComponent {
  hoaDonChiTiet: any = {};

  constructor(
    private apiService: HoaDonService,
    private hoaDonChiTietService: HoaDonChiTietService,
    private hoaDonService: HoaDonService,
    private router: Router,
    private auth: AuthenticationService,
    private snackBar: MatSnackBar,
    private khachHangService: KhachHangService

  ) {

  }

  findOrderDetailByid(): void{
    const storageOrderDetail = localStorage.getItem('hoaDonChiTiet');
    if (storageOrderDetail){
      const hoaDonChiTiet = JSON.parse(storageOrderDetail);
      this.hoaDonChiTietService.findById(hoaDonChiTiet.id).subscribe((response) =>{
        if (response.result){
          this.hoaDonChiTiet = response.result;
        }
      })
    }
  }
}
