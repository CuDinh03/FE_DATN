import {Component, ElementRef, ViewChild} from '@angular/core';
import {AuthenticationService} from "../../service/AuthenticationService";
import {ActivatedRoute, Router} from "@angular/router";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {VoucherService} from "../../service/VoucherService";
import {ApiResponse} from "../../model/ApiResponse";
import { HttpErrorResponse } from "@angular/common/http";
import {Voucher} from "../../model/voucher";

@Component({
  selector: 'app-voucher-view',
  templateUrl: './voucher-view.component.html',
  styleUrls: ['./voucher-view.component.css']
})
export class VoucherViewComponent {
  @ViewChild('voucherModal') voucherModal!: ElementRef;

  vouchers: any[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 5;
  startFrom = 1;
  submitted = false;
  errorMessage: string = '';
  voucherForm: FormGroup;
  id: string;
  showSuccessAlert = false;
  successMessage = '';
  selectedVoucher: any;
  isEditMode = false;


  constructor(private apiService: VoucherService, private formBuilder: FormBuilder,
              private router: Router,private route: ActivatedRoute, private auth: AuthenticationService) {

    this.voucherForm = this.formBuilder.group({
      id: [''],
      ma: [''],
      ten: [''],
      loaiGiamGia: [''],
      ngayBatDau: [''],
      ngayKetThuc: [''],
      giaTriGiam: [''],
      giaTriToiThieu: [''],
      soLuong: [''],
      trangThai: [''],
    });
    this.id = this.route.snapshot.params['id'];

  };

  ngOnInit(): void {
    this.loadVoucher();
  }

  get f() {
    return this.voucherForm.controls;
  }

  loadVoucher(): void {
    this.apiService.getVouchers(this.currentPage, this.pageSize)
      .subscribe(response => {
        this.vouchers = response.result.content;
        this.totalElements = response.result.totalElements;
        this.totalPages = response.result.totalPages;
        console.log("view voucher");
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadVoucher();
  }

  openModal(account: any) {
    this.selectedVoucher = account;
    this.showModal();
  }

  private showModal() {
    if (this.voucherModal && this.voucherModal.nativeElement) {
      this.voucherModal.nativeElement.classList.add('show');
      this.voucherModal.nativeElement.style.display = 'block';
    }
  }

  closeVoucherModal() {
    if (this.voucherModal && this.voucherModal.nativeElement) {
      this.voucherModal.nativeElement.classList.remove('show');
      this.voucherModal.nativeElement.style.display = 'none';
    }
  }


  onSubmit(): void {
    this.submitted = true;
    if (this.voucherForm.invalid) {
      return;
    }
    if (this.isEditMode) {
      this.updateVoucher();
    } else {
      this.createVoucher();
    }
  }

  createVoucher(): void {
    this.submitted = true;
    if (this.voucherForm.invalid) {
      return;
    }
    const voucherData: Voucher = this.voucherForm.value;
    this.apiService.createVoucher(voucherData)
      .subscribe(
        (data: ApiResponse<Voucher>) => {
          this.showSuccessAlert = true;
          this.successMessage = 'Thêm thành công'
          this.loadVoucher();
          setTimeout(() => this.showSuccessAlert = false, 3000); // Tự động ẩn sau 3 giây
          this.voucherForm.reset();
          this.isEditMode = false;
        },
        (error: HttpErrorResponse) => {
          // this.handleError(error);
        }
      );
  }

  updateVoucher(): void {
    this.submitted = true;
    if (this.voucherForm.invalid) {
      return;
    }
    const voucherData: Voucher = this.voucherForm.value;
    this.apiService.updateVoucher(voucherData.id, voucherData).subscribe(
      () => {
        this.showSuccessAlert = true;
        this.successMessage = 'Sửa thành công'
        this.loadVoucher();
        setTimeout(() => this.showSuccessAlert = false, 3000); // Tự động ẩn sau 3 giây
        this.voucherForm.reset();
        this.isEditMode = false; // Đặt lại chế độ
      },
      (error: HttpErrorResponse) => {
        // this.handleError(error);
      }
    );
  }


  findById(id: string): void {
    this.apiService.findById(id)
      .subscribe(
        (response: ApiResponse<Voucher>) => {
          this.voucherForm.patchValue({
            id: response.result.id,
            ma: response.result.ma,
            ten: response.result.ten,
            loaiGiamGia: response.result.loaiGiamGia,
            ngayBatDau: response.result.ngayBatDau instanceof Date ? this.formatDate(response.result.ngayBatDau) : this.formatDate(new Date(response.result.ngayBatDau)),
            ngayKetThuc: response.result.ngayKetThuc instanceof Date ? this.formatDate(response.result.ngayKetThuc) : this.formatDate(new Date(response.result.ngayKetThuc)),
            giaTriGiam: response.result.giaTriGiam,
            giaTriToiThieu: response.result.giaTriToiThieu,
            soLuong: response.result.soLuong,
            trangThai: response.result.trangThai.toString() // Chuyển đổi boolean thành string

          });
          this.isEditMode = true;
        },
        (error: HttpErrorResponse) => {
          // this.handleError(error);
        }
      );
  }

  // handleError(error: HttpErrorResponse): void {
  //   console.error(error);
  //   if (error.error.code === ErrorCode.PASSWORD_INVALID) {
  //     this.errorMessage = 'Mã voucher không được để trống';
  //   } else {
  //     this.errorMessage = 'Đã xảy ra lỗi, vui lòng thử lại sau.';
  //   }
  // }
  delete(id: any): void {
    this.apiService.deleteVoucher(id).subscribe(() => {
      this.loadVoucher();
      this.router.navigate(['/admin/voucher']);
    });
  }

  openVoucher(id: any): void {
    this.apiService.openVoucher(id).subscribe(() => {
      this.loadVoucher();
      this.router.navigate(['/admin/voucher']);
    });
  }

  closeSuccessAlert(): void {
    this.showSuccessAlert = false;
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

}
