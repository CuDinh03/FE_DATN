import {ErrorCode} from 'src/app/model/ErrorCode';
import { HttpErrorResponse } from '@angular/common/http';
import {ApiResponse} from 'src/app/model/ApiResponse';
import {AuthenticationService} from './../../service/AuthenticationService';
import {Router} from '@angular/router';
import {HoaDonChiTietService} from './../../service/HoaDonChiTietService';
import {Component, ElementRef, ViewChild} from '@angular/core';
import {HoaDonService} from "../../service/HoaDonService";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent {
  currentStatus: number = 0;
  @ViewChild('confirmUpdate') confirmUpdate!: ElementRef;
  hoaDon: any = {};
  listHoaDonChiTiet: any[] = [];
  noCartDetail = false;
  trangThaiList: number[] = [0, 1, 2, 3, 4, 5];
  showNoteInput: boolean = false;
  noteText: string = '';
  notePlaceholder: string = '';
  selectedOption1: string = '';
  selectedOption2: string = 'Thay đổi đơn hàng (màu sắc, kích thước, thêm mã giảm giá...)';
  selectedOption3: string = 'Tôi không có nhu cầu mua nữa';

  onRadioChange(noteText: string) {
    this.notePlaceholder = noteText;
    this.showNoteInput = true;
  }

  constructor(private auth: AuthenticationService,
              private router: Router,
              private hoaDonChiTietService: HoaDonChiTietService,
              private hoaDonService: HoaDonService
  ) {
  }

  ngOnInit() {
    this.loadHoaDonChiTiet();
  }

  submitRequest() {
    const requestPayload = {
      ghiChu: this.selectedOption1 + ' - ' + this.noteText
    };

    const invoiceId = this.hoaDon.id; // Thay thế bằng UUID của hóa đơn

    this.hoaDonService.yeuCauSuaHoaDon(invoiceId, requestPayload)
      .subscribe(response => {
        console.log('Yêu cầu sửa thành công', response);
      }, error => {
        console.error('Yêu cầu sửa thất bại', error);
      });
  }


  loadHoaDonChiTiet(): void {
    const storeHoaDon = localStorage.getItem('hoaDon');
    if (storeHoaDon) {
      const hoaDon = JSON.parse(storeHoaDon);
      this.hoaDon = hoaDon
      this.currentStatus = hoaDon.trangThai;
      this.hoaDonChiTietService.getAllBỵKhachHang(hoaDon.id).subscribe(
        (response: ApiResponse<any>) => {
          if (response.result && response.result.length > 0) {
            this.listHoaDonChiTiet = response.result;
            this.noCartDetail = false;
          } else {
            this.noCartDetail = true;
            this.listHoaDonChiTiet = [];
          }
        },
        (error: HttpErrorResponse) => {
          if (error.error.code === ErrorCode.NO_ORDER_DETAIL_FOUND) {
            this.noCartDetail = true;
            this.listHoaDonChiTiet = [];
          } else {
            console.error('Unexpected error:', error);
          }
        }
      );
    } else {
      console.log('khong tim thay hoa don');
    }
  }

  getTrangThaiText(trangThai: number): string {
    switch (trangThai) {
      case 0:
        return 'Chưa thanh toán';
      case 1:
        return 'Chờ xác nhận';
      case 2:
        return 'Đã xử lý';
      case 3:
        return 'Đang giao';
      case 4:
        return 'Hoàn thành';
      case 5:
        return 'Hủy đơn';
      case 6:
        return 'Sửa đơn';
      default:
        return '';
    }
  }

  getTrangThaiColor(trangThai: number): string {
    switch (trangThai) {
      case 0:
        return '#FFD700';
      case 1:
        return '#FF6347';
      case 2:
        return '#228B22';
      case 3:
        return '#ADD8E6';
      case 4:
        return '#228B22';
      case 5:
        return '#FF0000';
      case 6:
        return '#FF0000';
      default:
        return '';
    }
  }

  // shouldDisplayStatus(trangThai: number): boolean {
  //   // Chỉ hiển thị trạng thái nếu không phải là "Đã hủy" hoặc nếu là "Đã hủy" nhưng trạng thái hiện tại là "Đã hủy"
  //   if (trangThai === 4 || trangThai === 5) {
  //     return this.currentStatus === 4 || this.currentStatus === 5;
  //   }
  //   return true;
  // }
}
