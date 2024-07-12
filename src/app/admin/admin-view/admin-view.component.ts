import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {TaiKhoanService} from "../../service/TaiKhoanService";
import { HttpClient } from "@angular/common/http";
import {AuthenticationService} from "../../service/AuthenticationService";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, of} from "rxjs";
import {ApiResponse} from "../../model/ApiResponse";
import {HoaDonService} from "../../service/HoaDonService";
import {HoaDonChiTietService} from "../../service/HoaDonChiTietService";
import {Chart, registerables} from "chart.js";
import {DanhGiaDto} from "../../model/danh-gia-dto";
Chart.register(...registerables)

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css']
})
export class AdminViewComponent implements OnInit {
  doanhThu: number = 0;
  donHang: number =  0;
  listHoaDonChiTiet: any[] = [];


  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private hoaDonService: HoaDonService,
    private hoaDonChiTietService: HoaDonChiTietService
    ) {
  }

  ngOnInit(): void {
  this.getThongKeDoanhThu();
  this.getThongKeDonHang();
  this.getThongKeSanPham();
  }

  getThongKeDoanhThu()  {
    this.hoaDonService.getThongKeDoanhThu().subscribe(res => {
      if (res.result){
        this.doanhThu = res.result;
      }
    })
  }

  getThongKeDonHang()  {
    this.hoaDonService.getThongKeDonHang().subscribe(res => {
      if (res.result){
        this.donHang = res.result;
      }
    })
  }

  getThongKeSanPham()  {
    this.hoaDonChiTietService.getThongKeSanPham().subscribe((res:ApiResponse<any>) => {
      if (res.result){
        this.listHoaDonChiTiet = res.result;
      }
    })
  }

}
