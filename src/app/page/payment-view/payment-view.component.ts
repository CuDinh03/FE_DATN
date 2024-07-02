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
import {formatDate} from "@angular/common";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ThanhToanService} from "../../service/ThanhToanService";
import {ThanhToanOnl} from "../../model/thanh-toan-onl";
import {GioHangDto} from "../../model/gio-hang-dto";

@Component({
  selector: 'app-payment-view',
  templateUrl: './payment-view.component.html',
  styleUrls: ['./payment-view.component.css']
})
export class PaymentViewComponent {
  @ViewChild('voucherModal') voucherModal!: ElementRef;
  @ViewChild('userInfor') userInfor!: ElementRef;
  totalElements = 0;
  totalPages: number = 0;
  currentPage = 0;
  pageSize = 6;
  tenDangNhap: string = '';
  showSearch: boolean = false;
  isLoggedInCart: boolean = false;
  isCartHovered = false;
  results: string[] = [];
  khachHang: any;
  vouchers: any[] = [];
  gioHang: any = {};
  gioHangChiTiet: any[] = [];
  showConfirmationModal: boolean = false;
  itemToDeleteId: string = '';
  allSelected = false;
  selectedTotal = 0;
  showFooter: boolean = false;
  voucher: any;
  discount: number = 0;
  customerForm: FormGroup;
  selectedCustomerId: string | null = null;

  // submitted = false;

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
              private thanhToanService: ThanhToanService
  ) {
    this.customerForm = this.formBuilder.group({
      ten: [''],
      diaChi: [''],
      sdt: [''],
      email: [''],
      note: [''],
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

  selectCustomer(customerId: string): void {
    this.selectedCustomerId = customerId;
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

  updateCustomerInfo(): void {
    if (this.customerForm.invalid) {
      return;
    }
    const updatedCustomer = {
      ...this.selectedCustomer,
      ...this.customerForm.value
    };
    this.selectCustomerForUpdate(this.khachHang);
    this.closeInforModal();
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
    this.gioHangChiTietService.getAllBỵKhachHang(idGioHang).subscribe(
      (response: ApiResponse<any>) => {
        if (response.result && response.result.length > 0) {
          this.gioHangChiTiet = response.result;
          console.log(this.gioHangChiTiet);
        } else {
          this.gioHangChiTiet = [];
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Unexpected error:', error);
      }
    );
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
            this.router.navigate(['/thanh-toan'])
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
    if (this.customerForm.invalid) {
      return;
    }

    const storedVoucher = localStorage.getItem('voucher') || '';
    const tenDangNhap = localStorage.getItem('tenDangNhap') || '';

    this.khachHangService.findKhachHangByTenDangNhap(tenDangNhap).subscribe(
      (response) => {
        this.khachHang = response.result;
        if (!this.khachHang || !this.khachHang.id) {
          console.error('Không tìm thấy thông tin khách hàng.');
          return;
        }
        this.gioHangService.findGioHangByIdKhachHang(this.khachHang.id).subscribe(
          (gioHangResponse: ApiResponse<GioHangDto>) => {
            const gioHang = gioHangResponse.result;
            if (!gioHang) {
              console.error('Không tìm thấy giỏ hàng.');
              return;
            }
            this.gioHangChiTietService.getAllBỵKhachHang(gioHang.id).subscribe(
              (gioHangChiTietResponse: ApiResponse<any>) => {
                const gioCt = gioHangChiTietResponse.result || [];

                const thanhToanOnl: ThanhToanOnl = {
                  gioHang: gioHang,
                  tongTien: this.getCartTotal() - this.discount,
                  tongTienGiam: this.discount,
                  voucher: storedVoucher ? JSON.parse(storedVoucher) : null,
                  diaChiGiaoHang: this.customerForm.value.diaChi,
                  ghiChu: this.customerForm.value.note,
                  gioHangChiTietList: gioCt // lỗi ở đây, bên phía BE bị null chỗ này
                };

                this.thanhToanService.thanhToanOnle(thanhToanOnl).subscribe(
                  (response: ApiResponse<ThanhToanOnl>) => {
                    if (response.result) {
                      this.snackBar.open('Đặt hàng thành công!', 'Đóng', {
                        duration: 3000,
                        panelClass: ['success-snackbar']
                      });
                      this.router.navigate(['/trang-chu']);
                    }
                  },
                  (error) => {
                    this.snackBar.open('Đặt hàng không thành công. Vui lòng thử lại!', 'Đóng', {
                      duration: 3000,
                      panelClass: ['error-snackbar']
                    });
                  }
                );
              },
              (error) => {
                console.error('Lỗi hiển giỏ hàng chi tiêt:', error);
              }
            );
          },
          (error) => {
            console.error('Lỗi tải giỏ hàng:', error);
          }
        );
      },
      (error) => {
        console.error('Lỗi tải khách hàng:', error);
      }
    );
  }
}
