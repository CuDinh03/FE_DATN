import {Component, OnInit} from '@angular/core';
import {CurrencyPipe, NgForOf} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {AuthenticationService} from "../../service/AuthenticationService";
import {ActivatedRoute, Router} from "@angular/router";
import {HoaDonService} from "../../service/HoaDonService";
import {HoaDonChiTietService} from "../../service/HoaDonChiTietService";
import {ApiResponse} from "../../model/ApiResponse";

@Component({
  selector: 'app-dash-board',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgForOf,
    ReactiveFormsModule,
  ],
  templateUrl: './dash-board.component.html',
  styleUrl: './dash-board.component.css'
})
export class DashBoardComponent implements OnInit {
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
}
