import {Component} from '@angular/core';
import {HoaDonChiTietService} from "../../service/HoaDonChiTietService";
import {ApiResponse} from "../../model/ApiResponse";
import {FormBuilder, FormGroup} from "@angular/forms";
import {DanhGiaDto} from "../../model/danh-gia-dto";
import {KhachHangService} from "../../service/KhachHangService";
import {DanhGiaService} from "../../service/DanhGiaService";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-rating-view',
  templateUrl: './rating-view.component.html',
  styleUrls: ['./rating-view.component.css']
})
export class RatingViewComponent {
  hoaDonChiTiet: any = {};
  danhGiaForm: FormGroup;
  selectedRating: number = 0;
  stars: number[] = [1, 2, 3, 4, 5];
  khachHang: any = {}

  constructor(
    private hoaDonChiTietService: HoaDonChiTietService,
    private formBuilder: FormBuilder,
    private khachHangService: KhachHangService,
    private danhGiaServe: DanhGiaService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.danhGiaForm = this.formBuilder.group({
      khachHang: [''],
      hoaDonChiTiet: [''],
      tieuDe: [''],
      noiDung: [''],
      diem: [''],
      trangThai: [''],
    })

    const tenDangNhap = localStorage.getItem('tenDangNhap');
    if (tenDangNhap) {
      this.khachHangService.findKhachHangByTenDangNhap(tenDangNhap).subscribe(
        (response) => {
          this.khachHang = response.result;
        },
        (error) => {
          console.error('Error fetching customer:', error);
        }
      );
    }
  }

  ngOnInit(): void {
    this.findOrderDetailByid();
  }

  get f() {
    return this.danhGiaForm.controls;
  }

  findOrderDetailByid(): void {
    const storageOrderDetail = localStorage.getItem('hoaDonChiTiet');
    if (storageOrderDetail) {
      const hoaDonChiTiet = JSON.parse(storageOrderDetail);
      this.hoaDonChiTietService.findById(hoaDonChiTiet.id).subscribe((response: ApiResponse<any>) => {
        if (response.result) {
          this.hoaDonChiTiet = response.result;
          console.log(this.hoaDonChiTiet)
        }
      })
    }
  }


  createRating(): void {
    if (!this.danhGiaForm.valid || !this.selectedRating) {
      this.snackBar.open('Vui lòng điền đầy đủ thông tin và chọn mức đánh giá!', 'Đóng', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    // Tạo bản sao của hoaDonChiTiet và loại bỏ thuộc tính hinhAnhUrls
    const hoaDonChiTiet = { ...this.hoaDonChiTiet };
    if (hoaDonChiTiet.hinhAnhUrls) {
      delete hoaDonChiTiet.hinhAnhUrls;
    }

    const danhGiaDto: DanhGiaDto = {
      khachHang: this.khachHang,
      hoaDonChiTiet: hoaDonChiTiet, // Gửi hoaDonChiTiet không chứa hinhAnhUrls
      tieuDe: this.danhGiaForm.value.tieuDe,
      noiDung: this.danhGiaForm.value.noiDung,
      diem: this.selectedRating,
      trangThai: 1,
    };

    this.danhGiaServe.createRating(danhGiaDto).subscribe(
      (response) => {
        if (response.code === 1000) {
          this.snackBar.open('Đánh giá sản phẩm thành công!', 'Đóng', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/don-mua']);
        } else {
          this.snackBar.open('Có lỗi xảy ra khi đánh giá sản phẩm!', 'Đóng', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      },
      (error) => {
        console.error('Lỗi khi đánh giá sản phẩm:', error);
        this.snackBar.open('Đánh giá sản phẩm thất bại! Vui lòng thử lại.', 'Đóng', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    );
  }




  selectRating(rating: number): void {
    this.selectedRating = rating;
  }


  getRatingText(rating: number): string {
    switch (rating) {
      case 1:
        return 'Tệ';
      case 2:
        return 'Không hài lòng';
      case 3:
        return 'Bình thường';
      case 4:
        return 'Hài lòng';
      case 5:
        return 'Tuyệt vời!';
      default:
        return '';
    }
  }
}
