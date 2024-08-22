import {Component, OnInit, ViewChild} from '@angular/core';
import {CurrencyPipe, NgForOf} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {HoaDonService} from "../../service/HoaDonService";
import {HoaDonChiTietService} from "../../service/HoaDonChiTietService";
import {ApiResponse} from "../../model/ApiResponse";
import {ChartComponent, NgApexchartsModule ,  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid} from "ng-apexcharts";
import {MonthlySalesData} from "../../model/MonthlySalesData";

export type ChartOptions = {
  series?: ApexAxisChartSeries;
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  dataLabels?: ApexDataLabels;
  grid?: ApexGrid;
  stroke?: ApexStroke;
  title?: ApexTitleSubtitle;
};


@Component({
  selector: 'app-dash-board',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgForOf,
    ReactiveFormsModule,
    NgApexchartsModule,
  ],
  templateUrl: './dash-board.component.html',
  styleUrl: './dash-board.component.css'
})
export class DashBoardComponent implements OnInit {
  doanhThu: number = 0;
  donHang: number = 0;
  listHoaDonChiTiet: any[] = [];
  monthlySalesData: MonthlySalesData[] = [];
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> = {
    series: [],
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false
      }
    } as ApexChart,
    xaxis: {
      categories: []
    },
    dataLabels: {
      enabled: false
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5
      }
    },
    stroke: {
      curve: 'smooth'
    },
    title: {
      text: '',
      align: 'left'
    }
  };

  constructor(
    private hoaDonService: HoaDonService,
    private hoaDonChiTietService: HoaDonChiTietService
  ) {
  }

  ngOnInit(): void {
    this.hoaDonService.getMonthlySalesData().subscribe(data => {
      console.log('API Data:', data);  // Kiểm tra dữ liệu API
      this.monthlySalesData = Array.isArray(data) ? data : [];
      this.updateChartOptions();
    });
    this.getThongKeDoanhThu();
    this.getThongKeDonHang();
    this.getThongKeSanPham();
  }


  getThongKeDoanhThu() {
    this.hoaDonService.getThongKeDoanhThu().subscribe(res => {
      if (res.result) {
        this.doanhThu = res.result;
      }
    })
  }

  getThongKeDonHang() {
    this.hoaDonService.getThongKeDonHang().subscribe(res => {
      if (res.result) {
        this.donHang = res.result;
      }
    })
  }

  getThongKeSanPham() {
    this.hoaDonChiTietService.getThongKeSanPham().subscribe((res: ApiResponse<any>) => {
      if (res.result) {
        this.listHoaDonChiTiet = res.result;
      }
    })
  }

  updateChartOptions(): void {
    if (!this.monthlySalesData || !Array.isArray(this.monthlySalesData)) {
      console.error('Invalid monthly sales data:', this.monthlySalesData);
      return;
    }

    this.chartOptions = {
      series: [
        {
          name: 'Số Hóa Đơn',
          data: this.monthlySalesData.map(item => item.orderCount || 0)
        },
        {
          name: 'Tổng Tiền',
          data: this.monthlySalesData.map(item => item.totalSales || 0)
        }
      ],
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: 'Số Hóa Đơn và Tổng Tiền Theo Tháng',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5
        }
      },
      xaxis: {
        categories: this.monthlySalesData.map(item => this.getMonthName(item.month))
      },
      // @ts-ignore
      yaxis: {
        title: {
          text: 'Giá Trị'
        }
      }
    };
  }


  getMonthName(month: number): string {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return monthNames[month - 1] || 'Unknown';
  }

}
