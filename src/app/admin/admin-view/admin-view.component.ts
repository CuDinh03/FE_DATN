import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {TaiKhoanService} from "../../service/TaiKhoanService";
import { HttpClient } from "@angular/common/http";
import {AuthenticationService} from "../../service/AuthenticationService";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, of} from "rxjs";
import {ApiResponse} from "../../model/ApiResponse";
import {HoaDonService} from "../../service/HoaDonService";
import {HoaDonChiTietService} from "../../service/HoaDonChiTietService";
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css']
})
export class AdminViewComponent implements OnInit {
  doanhThu: number = 0;
  donHang: number =  0;
  listHoaDonChiTiet: any[] = [];
  title = 'angular-charts-youtube';


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

  lineChart=new Chart({
    chart: {
      type: 'line'
    },
    title: {
      text: 'Thống kê số lượng đơn hàng'
    },
    credits: {
      enabled: false
    },
    xAxis: {
      categories: ['1', '2', '3', '4', '5', '6','7','8','9','10','11','12'] // Ví dụ về categories
    },
    yAxis: {
      title: {
        text: 'Đơn hàng'
      }
    },
    series: [
      {
        name: 'Số lượng đơn hàng',
        data: [10, 2, 3,6,9,17,20,10,5,2,16]
      } as any
    ]

  })
}
