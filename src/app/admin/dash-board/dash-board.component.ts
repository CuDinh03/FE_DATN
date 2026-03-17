import { ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CurrencyPipe, NgClass, NgForOf, NgIf } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HoaDonService } from "../../service/HoaDonService";
import { HoaDonChiTietService } from "../../service/HoaDonChiTietService";
import { ChartComponent, NgApexchartsModule, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexTitleSubtitle, ApexStroke, ApexGrid, ApexYAxis } from "ng-apexcharts";
import { MonthlySalesData } from "../../model/MonthlySalesData";
import { NgxSpinnerComponent, NgxSpinnerService } from "ngx-spinner";
import { forkJoin } from "rxjs";
import ApexCharts from 'apexcharts';
import { HoaDonDto } from "../../model/hoa-don-dto.model";

export type ChartOptions = {
  series?: ApexAxisChartSeries;
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  dataLabels?: ApexDataLabels;
  grid?: ApexGrid;
  stroke?: ApexStroke;
  title?: ApexTitleSubtitle;
  yaxis?: ApexYAxis;
};

/** Trạng thái hóa đơn để hiển thị tiếng Việt */
const TRANG_THAI_LABELS: Record<number, string> = {
  0: 'Chưa thanh toán',
  1: 'Chưa xác nhận',
  2: 'Đã xử lý',
  3: 'Đang giao',
  4: 'Hoàn thành',
  5: 'Đã hủy',
  6: 'Yêu cầu hủy'
};

@Component({
  selector: 'app-dash-board',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgClass,
    NgForOf,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    NgxSpinnerComponent,
  ],
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit, AfterViewInit {
  doanhThu: number = 0;
  donHang: number = 0;
  tangTruongPhanTram: number | null = null;
  listHoaDonChiTiet: any[] = [];
  monthlySalesData: MonthlySalesData[] = [];
  recentHoaDon: HoaDonDto[] = [];
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = 0; // 0 = cả năm
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> = {};
  readonly monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

  constructor(
    private hoaDonService: HoaDonService,
    private hoaDonChiTietService: HoaDonChiTietService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    const observables = {
      monthlySales$: this.hoaDonService.getMonthlySalesData(),
      thongKeDoanhThu$: this.hoaDonService.getThongKeDoanhThu(),
      soDonHang$: this.hoaDonService.getSoDonHangDaBan(),
      thongKeSanPham$: this.hoaDonChiTietService.getThongKeSanPham(),
      recentHoaDon$: this.hoaDonService.getHoaDon(0, 10),
      tangTruong$: this.hoaDonService.getTangTruongDoanhThu()
    };

    forkJoin(observables).subscribe({
      next: ({
               monthlySales$,
               thongKeDoanhThu$,
               soDonHang$,
               thongKeSanPham$,
               recentHoaDon$,
               tangTruong$
             }) => {
        this.monthlySalesData = this.prepareChartData(monthlySales$.result);
        this.doanhThu = Number(thongKeDoanhThu$.result ?? 0);
        this.donHang = Number(soDonHang$.result ?? 0);
        this.listHoaDonChiTiet = thongKeSanPham$.result || [];
        this.recentHoaDon = (recentHoaDon$.result?.content ?? recentHoaDon$.result ?? []) as HoaDonDto[];
        if (tangTruong$.result?.tangTruongPhanTram != null) {
          this.tangTruongPhanTram = Number(tangTruong$.result.tangTruongPhanTram);
        }
        this.updateChartOptions();
        this.cdr.detectChanges();
        this.spinner.hide();
      },
      error: (err) => {
        console.error('Có lỗi xảy ra khi lấy dữ liệu', err);
        this.spinner.hide();
      }
    });
  }

  getTrangThaiLabel(trangThai: number): string {
    return TRANG_THAI_LABELS[trangThai] ?? '—';
  }

  getKhachHangTen(hoaDon: HoaDonDto): string {
    const kh = (hoaDon as any).khachHang;
    if (kh && (kh.hoTen || kh.ten)) return kh.hoTen || kh.ten;
    return '—';
  }

  formatHoaDonTime(ngayTao: string | Date): string {
    if (!ngayTao) return '—';
    const d = new Date(ngayTao);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }

  formatHoaDonDate(ngayTao: string | Date): string {
    if (!ngayTao) return '—';
    return new Date(ngayTao).toLocaleDateString('vi-VN');
  }

  ngAfterViewInit() {
    // Đảm bảo biểu đồ được khởi tạo sau khi cấu hình đã được thiết lập
    if (this.chartOptions && this.chartOptions.series) {
      new ApexCharts(document.querySelector("#chart"), this.chartOptions as ApexCharts.ApexOptions).render();
    } else {
      console.error('Biểu đồ không thể được khởi tạo vì chartOptions chưa được cấu hình.');
    }
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

    // Đảm bảo biểu đồ được cập nhật sau khi cấu hình đã được thiết lập
    if (this.chart) {
      this.chart.updateSeries(this.chartOptions.series!); // Cập nhật lại series
    }
    this.cdr.detectChanges(); // Phát hiện thay đổi
    this.spinner.hide(); // Đóng spinner
  }

  getMonthNames(): string[] {
    return this.monthNames;
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
