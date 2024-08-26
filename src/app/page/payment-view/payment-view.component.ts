import {MatSnackBar} from '@angular/material/snack-bar';
import {ApiResponse} from './../../model/ApiResponse';
import { HttpErrorResponse } from '@angular/common/http';
import {KhachHangService} from './../../service/KhachHangService';
import {GioHangService} from 'src/app/service/GioHangService';
import {GioHangChiTietService} from './../../service/GioHangChiTietService';
import {Router} from '@angular/router';
import {AuthenticationService} from './../../service/AuthenticationService';
import {Component, ElementRef, Renderer2, HostListener, ViewChild} from '@angular/core';
import {VoucherService} from "../../service/VoucherService";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ThanhToanService} from "../../service/ThanhToanService";
import {ThanhToanOnl} from "../../model/thanh-toan-onl";
import {GioHangDto} from "../../model/gio-hang-dto";
import {DiaChiService} from "../../service/DiaChiService";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-payment-view',
  templateUrl: './payment-view.component.html',
  styleUrls: ['./payment-view.component.css']
})
export class PaymentViewComponent {
  @ViewChild('voucherModal') voucherModal!: ElementRef;
  @ViewChild('userInfor') userInfor!: ElementRef;
  @ViewChild('submitPay') submitPay!: ElementRef;
  totalElements = 0;
  totalPages: number = 0;
  currentPage = 0;
  pageSize = 6;
  tenDangNhap: string = '';
  results: string[] = [];
  khachHang: any;
  vouchers: any[] = [];
  gioHang: any = {};
  gioHangChiTiet: any[] = [];
  voucher: any;
  discount: number = 0;
  customerForm: FormGroup;
  selectedCustomerId: string | null = null;
  loading = false;
  thongTinDatHang: any[] = []
  showUpperFooter: boolean = true;
  selectedCustomer: any = null;

  constructor(private auth: AuthenticationService, private router: Router,
              private gioHangChiTietService: GioHangChiTietService,
              private gioHangService: GioHangService,
              private khachHangService: KhachHangService,
              private snackBar: MatSnackBar,
              private el: ElementRef, private renderer: Renderer2,
              private voucherService: VoucherService,
              private formBuilder: FormBuilder,
              private thanhToanService: ThanhToanService,
              private diaChiService: DiaChiService,
              private spinner: NgxSpinnerService
  ) {
    this.customerForm = this.formBuilder.group({
      ten: ['', [Validators.required, Validators.pattern('^[^0-9]*$')]],  // Chỉ cho phép nhập các ký tự không phải số
      diaChi: ['', Validators.required],
      sdt: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], // Số điện thoại chỉ cho phép số
      note: ['']
    })


  }



  get f() {
    return this.customerForm.controls;
  }

  ngOnInit() {
    this.findShoppingCart();
    this.loadUserInfor();
  }

  calculateSubtotal(item: any): number {
    return item.chiTietSanPham.giaBan * item.soLuong;
  }


  selectCustomer(customer: any): void {
    this.selectedCustomerId = customer.id;
    this.selectedCustomer = customer;
    this.customerForm.patchValue({
      ten: customer.ten,
      diaChi: customer.diaChi,
      sdt: customer.sdt,
      email: customer.email,
      note: customer.note
    });
  }

  updateCustomerInfo(): void {
    if (this.selectedCustomer) {
      this.customerForm.patchValue({
        ten: this.selectedCustomer.ten,
        diaChi: this.selectedCustomer.diaChi,
        sdt: this.selectedCustomer.sdt,
        email: this.selectedCustomer.email,
        note: this.selectedCustomer.note
      });
    }
    this.closeInforModal();
  }


  // Hiển thị thông tin khách hàng vào form
  selectCustomerForUpdate(customer: any): void {
    this.selectedCustomer = customer;
    this.customerForm.patchValue({
      ten: customer.ten,
      diaChi: customer.diaChi,
      sdt: customer.sdt,
      email: customer.email,
      note: customer.note
    });
  }

  findShoppingCart() {
    const tenDangNhap = this.auth.getTenDangNhap();
    if (tenDangNhap) {
      this.khachHangService.findKhachHangByTenDangNhap(tenDangNhap).subscribe(
        (response) => {
          const khachHang = response.result;
          if (khachHang && khachHang.id) {
            this.gioHangService.findGioHangByIdKhachHang(khachHang.id).subscribe(
              (response) => {
                const gioHang = response.result;
                console.log(gioHang);
                if (gioHang && gioHang.id) {
                  this.loadGioHangChiTiet(gioHang.id);
                }
              },
              (error) => {
                console.error('Error fetching shopping cart:', error);
              }
            );
          } else {
            console.error('Không tìm thấy thông tin khách hàng.');
          }
        },
        (error) => {
          console.error('Error fetching customer:', error);
        }
      );
    }
  }

  loadUserInfor() {
    const tenDangNhap = this.auth.getTenDangNhap();
    if (tenDangNhap) {
      this.khachHangService.findKhachHangByTenDangNhap(tenDangNhap).subscribe(
        (response) => {
          if (response.result) {
            this.khachHang = response.result;
            this.diaChiService.getAllByIdKhachHang(response.result.id).subscribe((response) =>{
              this.thongTinDatHang = response.result;
            })
          } else {
            console.error('Không tìm thấy thông tin khách hàng.');
          }
        },
        (error) => {
          console.error('Error fetching customer:', error);
        }
      );
    }
  }


  loadGioHangChiTiet(idGioHang: string): void {
    const storedGioHangChiTiet = localStorage.getItem('selectedItems');
    const gioHangChiTietList = storedGioHangChiTiet ? JSON.parse(storedGioHangChiTiet) : [];
    this.gioHangChiTiet = gioHangChiTietList;
  }

  getCartTotal(): number {
    return this.gioHangChiTiet.reduce((total, item) => {
      return total + item.soLuong * item.chiTietSanPham.giaBan;
    }, 0);
  }

  showModal(): void {
    if (this.voucherModal && this.voucherModal.nativeElement) {
      this.voucherModal.nativeElement.classList.add('show');
      this.voucherModal.nativeElement.style.display = 'block';
      this.loadVoucher();
    }
  }

  showModalSubmitPay(): void {
    if (this.submitPay && this.submitPay.nativeElement) {
      this.submitPay.nativeElement.classList.add('show');
      this.submitPay.nativeElement.style.display = 'block';
      this.loadVoucher();
    }
  }

  closeModalSubmitPay(): void {
    if (this.submitPay && this.submitPay.nativeElement) {
      this.submitPay.nativeElement.classList.remove('show');
      this.submitPay.nativeElement.style.display = 'none';
    }
  }

  showModalInfor(): void {
    if (this.userInfor && this.userInfor.nativeElement) {
      this.userInfor.nativeElement.classList.add('show');
      this.userInfor.nativeElement.style.display = 'block';
      this.loadUserInfor()
    }
  }

  loadVoucher(): void {
    if (this.pageSize > 0) {

      this.voucherService.getVouchers(this.currentPage, this.pageSize)
        .subscribe(
          (response: ApiResponse<any>) => {
            if (response.result && response.result.content) {
              this.vouchers = response.result.content;
              this.totalElements = response.result.totalElements;
              this.totalPages = response.result.totalPages;
            }
          },
          (error) => {
            console.error('Error loading vouchers:', error);
            // Xử lý lỗi nếu cần
          }
        );
    } else {
      console.log("Invalid size value");
    }
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadVoucher();
    }
  }

  closeVoucherModal(): void {
    if (this.voucherModal && this.voucherModal.nativeElement) {
      this.voucherModal.nativeElement.classList.remove('show');
      this.voucherModal.nativeElement.style.display = 'none';
    }
  }


  closeInforModal(): void {
    if (this.userInfor && this.userInfor.nativeElement) {
      this.userInfor.nativeElement.classList.remove('show');
      this.userInfor.nativeElement.style.display = 'none';
    }
  }

  getVoucherById(id: string) {
    this.voucherService.getVoucherByid(id)
      .subscribe(
        (response: ApiResponse<any>) => {
          if (response.result) {
            this.voucher = response.result;
            localStorage.setItem('voucher', JSON.stringify(response.result));
            this.calculateThanhTien();
            this.calculateGiamGia();
            this.router.navigate(['/customer/thanh-toan'])
          }
        })
  }

  calculateThanhTien(): number {
    let total = this.calculateTotal();
    return total - this.discount;
  }

  calculateTotal(): number {
    let total = 0;
    this.gioHangChiTiet.forEach((item: any) => {
      total += item.soLuong * item.chiTietSanPham.giaBan;
    });
    return total;
  }

  calculateGiamGia(): void {
    let total = this.calculateTotal();
    const storedVoucher = localStorage.getItem('voucher');

    if (storedVoucher) {
      const voucher = JSON.parse(storedVoucher);
      const discountPercentage = voucher.giaTriGiam; // Assuming giaTriGiam is the discount percentage
      this.discount = total * (discountPercentage / 100);
      console.log(this.discount);
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, '0'); // Get day and pad with leading zero if necessary
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month (0-based index, hence the +1) and pad with leading zero if necessary
    const year = date.getFullYear(); // Get full year

    return `${day}/${month}/${year}`; // Return in the desired format (dd/MM/yyyy)
  }

  // @ts-ignore
  findGioHang(id: string): GioHangDto {
    this.gioHangService.findGioHangByIdKhachHang(id).subscribe(
      (response: ApiResponse<GioHangDto>) => {
        console.log('thanhcong')
        console.log(response.result)
        return response.result;
      }
    )
  }

  saveInfoPayment() {

    this.loading = true;
    if (this.customerForm.invalid) {
      this.loading = false;
      return;
    }
    this.spinner.show();

    const storedVoucher = localStorage.getItem('voucher') || '';
    const tenDangNhap = localStorage.getItem('tenDangNhap') || '';

    this.khachHangService.findKhachHangByTenDangNhap(tenDangNhap).subscribe(
      (response) => {
        this.khachHang = response.result;
        if (!this.khachHang || !this.khachHang.id) {
          console.error('Không tìm thấy thông tin khách hàng.');
          this.spinner.hide();
          return;
        }
        this.gioHangService.findGioHangByIdKhachHang(this.khachHang.id).subscribe(
          (gioHangResponse: ApiResponse<GioHangDto>) => {
            const gioHang = gioHangResponse.result;
            if (!gioHang) {
              console.error('Không tìm thấy giỏ hàng.');
              this.spinner.hide();
              return;
            }

            // Lấy dữ liệu giỏ hàng chi tiết từ localStorage
            const storedGioHangChiTiet = localStorage.getItem('selectedItems');
            const gioHangChiTietList = storedGioHangChiTiet ? JSON.parse(storedGioHangChiTiet) : [];

            const thanhToanOnl: ThanhToanOnl = {
              gioHang: gioHang,
              tongTien: this.getCartTotal() - this.discount,
              tongTienGiam: this.discount,
              voucher: storedVoucher ? JSON.parse(storedVoucher) : null,
              diaChiGiaoHang: this.customerForm.value.diaChi,
              ghiChu: this.customerForm.value.note,
              gioHangChiTietList: gioHangChiTietList
            };

            this.thanhToanService.thanhToanOnle(thanhToanOnl).subscribe(
              (response: ApiResponse<ThanhToanOnl>) => {
                this.loading = false;
                if (response.result) {
                  this.snackBar.open('Đặt hàng thành công!', 'Đóng', {
                    duration: 3000,
                    panelClass: ['success-snackbar']
                  });
                  this.router.navigate(['/trang-chu']);
                  localStorage.removeItem('selectedItems');
                  this.spinner.hide();
                }
              },
              (error) => {
                this.snackBar.open('Đặt hàng không thành công. Vui lòng thử lại!', 'Đóng', {
                  duration: 3000,
                  panelClass: ['error-snackbar']
                });
                this.spinner.hide();              }
            );
          },
          (error) => {
            console.error('Lỗi tải giỏ hàng:', error);
            this.spinner.hide();          }
        );
      },
      (error) => {
        console.error('Lỗi tải khách hàng:', error);
        this.spinner.hide();      }
    );
  }

}
