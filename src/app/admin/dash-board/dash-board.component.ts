import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {CurrencyPipe, NgForOf} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {HoaDonService} from "../../service/HoaDonService";
import {HoaDonChiTietService} from "../../service/HoaDonChiTietService";
import {ChartComponent, NgApexchartsModule, ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexYAxis} from "ng-apexcharts";
import {MonthlySalesData} from "../../model/MonthlySalesData";
import {NgxSpinnerComponent, NgxSpinnerService} from "ngx-spinner";
import {forkJoin} from "rxjs";

export type ChartOptions = {
  series?: ApexAxisChartSeries;
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  dataLabels?: ApexDataLabels;
  grid?: ApexGrid;
  stroke?: ApexStroke;
  title?: ApexTitleSubtitle;
  yaxis?: ApexYAxis;  // Thêm yaxis vào định nghĩa
};


@Component({
  selector: 'app-dash-board',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgForOf,
    ReactiveFormsModule,
    NgApexchartsModule,
    NgxSpinnerComponent,
  ],
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']  // Chú ý sửa styleUrl thành styleUrls
})
export class DashBoardComponent implements OnInit {
  doanhThu: number = 0;
  donHang: number = 0;
  listHoaDonChiTiet: any[] = [];
  monthlySalesData: MonthlySalesData[] = [];
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> = {};

  constructor(
    private hoaDonService: HoaDonService,
    private hoaDonChiTietService: HoaDonChiTietService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef // Thêm ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.spinner.show();
    forkJoin({
      monthlySales: this.hoaDonService.getMonthlySalesData(),
      thongKeDoanhThu: this.hoaDonService.getThongKeDoanhThu(),
      thongKeDonHang: this.hoaDonService.getThongKeDonHang(),
      thongKeSanPham: this.hoaDonChiTietService.getThongKeSanPham()
    }).subscribe(({monthlySales, thongKeDoanhThu, thongKeDonHang, thongKeSanPham}) => {
      this.monthlySalesData = this.prepareChartData(monthlySales.result);
      this.doanhThu = thongKeDoanhThu.result || 0;
      this.donHang = thongKeDonHang.result || 0;
      this.listHoaDonChiTiet = thongKeSanPham.result || [];
      this.updateChartOptions();
    });
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
        categories: this.getMonthNames()
      },
      yaxis: {
        title: {
          text: 'Giá Trị'
        }
      }
    };

    // Sau khi cập nhật chartOptions, cập nhật lại series để biểu đồ render
    // this.chart.updateSeries(this.chartOptions.series!);
    this.cdr.detectChanges(); // Thêm dòng này để phát hiện thay đổi
    this.spinner.hide();  //

  }

  getMonthNames(): string[] {
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  }

  prepareChartData(monthlySalesData: any[]): any[] {
    const fullYearData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      orderCount: 0,
      totalSales: 0
    }));

    monthlySalesData.forEach(data => {
      const index = data.month - 1;
      fullYearData[index] = data;
    });

    return fullYearData;
  }
}
