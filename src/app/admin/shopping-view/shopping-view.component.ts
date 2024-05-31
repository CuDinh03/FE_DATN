import {Component, ElementRef, ViewChild , OnInit } from '@angular/core';
import {VoucherService} from "../../service/VoucherService";
import {KhachHangService} from "../../service/KhachHangService";
// import * as bootstrap from "bootstrap";
import { HoaDonService } from './../../service/HoaDonService';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Validators } from '@angular/forms';
import { AuthenticationService } from './../../service/AuthenticationService';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DanhMucDto } from 'src/app/model/danh-muc-dto.model';
import { DanhMucService } from 'src/app/service/DanhMucService';
import { ApiResponse } from "../../model/ApiResponse";
import { ErrorCode } from "../../model/ErrorCode";
import { HoaDonChiTietService } from 'src/app/service/HoaDonChiTietService';
import { HoaDonCTService } from 'src/app/service/HoaDonCTService';
import { SanPhamCTService } from 'src/app/service/SanPhamCTService';
import { HoaDonService } from 'src/app/service/HoaDonService';


@Component({
  selector: 'app-shopping-view',
  templateUrl: './shopping-view.component.html',
  styleUrls: ['./shopping-view.component.css']
})

export class ShoppingViewComponent {
  @ViewChild('voucherModal') voucherModal!: ElementRef;
  vouchers: any[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 5;
  listVoucher: any[] = [];
  customer: any = null;
  newCustomer: any = {ten: ''};
  sdtValue: string = '';
  voucher: any;
  // searchControl = new FormControl('');
  results: string[] = [];
  listHoaDon: any[] = [];
  hoaDon: any = {};
  startFrom = 1;
  submitted = false;
  errorMessage: string = '';
  selectedDanhMuc: any;
  maxHoaDon = 5;
  isModalVisible = false;
  chiTietHoaDon: any[] = [];
  noProductsFound: boolean = false;



  constructor(
              private router: Router,
              private voucherService: VoucherService,
              private khachHangService: KhachHangService,
    private hoaDonChiTietService: HoaDonChiTietService, 
    private apiService: DanhMucService,
    private hoaDonService: HoaDonService
  ) {
    // Khởi tạo Form ở đây

  };


  showModal(): void {
    if (this.voucherModal && this.voucherModal.nativeElement) {
      this.voucherModal.nativeElement.classList.add('show');
      this.voucherModal.nativeElement.style.display = 'block';
      this.loadVoucher();
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

  // loadListVoucher() {
  //     this.voucherService.getListVoucher()
  //         .subscribe(
  //             (response: ApiResponse<any>) => {
  //                 if (response.result) {
  //                     this.listVoucher = response.result
  //                 }
  //             })
  // }

  closeVoucherModal(): void {
    if (this.voucherModal && this.voucherModal.nativeElement) {
      this.voucherModal.nativeElement.classList.remove('show');
      this.voucherModal.nativeElement.style.display = 'none';
    }
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadVoucher();
    }
  }

  getVoucherById(id: string) {
    this.voucherService.getVoucherByid(id)
      .subscribe(
        (response: ApiResponse<any>) => {
          if (response.result) {
            this.voucher = response.result;
            localStorage.setItem('voucher', JSON.stringify(response.result));
            this.router.navigate(['/admin/shopping'])
          }
        })
  }


  // tim kiem tu dong

  // ngOnInit(): void {
  //     this.searchControl.valueChanges.pipe(
  //         debounceTime(300),
  //         distinctUntilChanged(),
  //         switchMap(query => this.loadAndSearch(query))
  //     ).subscribe(results => {
  //         this.results = results;
  //     });
  // }
  //
  // loadAndSearch(query: string | null): Observable<string[]> {
  //     return this.loadListVoucher().pipe(
  //         map(() => {
  //             if (!query) {
  //                 return [];
  //             }
  //             const items = this.listVoucher;
  //             return items.filter(item => item.toLowerCase().includes(query.toLowerCase()));
  //         })
  //     );
  // }
  //
  // search(query: string | null): Observable<string[]> {
  //     if (!query) {
  //         return of([]);
  //     }
  //     const items = this.listVoucher;
  //     return of(items.filter(item => item.toLowerCase().includes(query.toLowerCase())));
  // }
  //
  // loadListVoucher(): Observable<any> {
  //     return this.voucherService.getListVoucher().pipe(
  //         tap((response: ApiResponse<any>) => {
  //             if (response.result) {
  //                 this.listVoucher = response.result;
  //             }
  //         })
  //     );
  // }

  ///customer

  getCustomer() {
    if (!this.sdtValue) {
      this.customer = {ten: "Khách lẻ"};
      this.router.navigate(['/admin/shopping']);
    } else {
      this.khachHangService.getKhachHang(this.sdtValue)
        .subscribe(
          (response: ApiResponse<any>) => {
            if (response.result) {
              this.customer = response.result;
              localStorage.setItem('kh', JSON.stringify(response.result));
              this.router.navigate(['/admin/shopping']);
            } else {
              this.showAddCustomerModal();
            }
          }
        );
    }
  }

  onSdtInputChange() {
    if (this.sdtValue) {
      // Nếu có số điện thoại được nhập vào, tự động lấy thông tin khách hàng
      this.getCustomer();
    } else {
      // Nếu không có số điện thoại, đặt lại thông tin khách hàng thành Khách lẻ
      this.customer = {ten: "Khách lẻ"};
      localStorage.removeItem('kh') // xoá kh đi để ko lưu lại thông tin khách hàng vừa nhập hoặc đang nhập
    }
  }

  showAddCustomerModal() {
    const modalElement = document.getElementById('addCustomerModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  addCustomer() {
    // this.khachHangService.addKhachHang(this.newCustomer)
    //   .subscribe(
    //     (response: ApiResponse<any>) => {
    //       if (response.result) {
    //         this.customer = response.result;
    //         localStorage.setItem('kh', JSON.stringify(response.result));
    //         this.router.navigate(['/admin/shopping']);
    //         this.hideAddCustomerModal();
    //       }
    //     }
    //   );
  }

  hideAddCustomerModal() {
    const modalElement = document.getElementById('addCustomerModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }



  ngOnInit(): void {
    this.loadHoaDon();
    
  }

  // loadHoaDonChiTiet(): void {
  //   this.hoaDonService.getAll()
  //     .subscribe(
  //       (response: ApiResponse<any>) => this.handleApiResponse(response),
  //       (error: any) => console.error('Error loading invoices:', error)
  //     );
  // }

  loadHoaDonChiTiet(idHoaDon: string): void {
    this.hoaDonChiTietService.getAll(idHoaDon).subscribe(
      (response: ApiResponse<any>) => {
        if (response.result && response.result.length > 0) {
          // Nếu có hóa đơn chi tiết, gán danh sách vào biến và đặt noProductsFound là false
          this.chiTietHoaDon = response.result;
          this.noProductsFound = false;
        } else {
          // Nếu không có hóa đơn chi tiết, đặt noProductsFound là true
          this.noProductsFound = true;
        }
      },
      (error: HttpErrorResponse) => {
        this.handleErrorGetAllHoaDonCT(error);
      }
    );
    
  }

  handleErrorGetAllHoaDonCT(error: HttpErrorResponse): void {
    console.error(error);
    if (error.error.code === ErrorCode.NO_ORDER_FOUND) {
      this.errorMessage = 'Chưa có sản phẩm nào';
    }
  }
  

  loadHoaDon(): void {
      this.hoaDonService.getAll()
        .subscribe(
          (response: ApiResponse<any>) => this.handleApiResponse(response),
          (error: any) => console.error('Error loading invoices:', error)
        );
    }

  // => list san pham chi tiet
  getAllSanPham(): void {
    this.sanPhamCTService.getAll().subscribe(
      res => {
        this.listSanPhamCT = res.result;
        console.log(this.listSanPhamCT)
      }
    )
  }

  // => list hoa don
  private handleApiResponse(response: ApiResponse<any>): void {
    if (response && response.result) {
      this.listHoaDon = response.result;
    } else {
      console.log('Không tìm thấy danh sách hóa đơn nào');
    }
}

  createHoaDon(): void {
    this.submitted = true;
    if (this.listHoaDon.length >= this.maxHoaDon) {
      this.openModal();
      return;
    }
    this.hoaDonChiTietService.createHoaDon(this.hoaDon).subscribe(data => {

      console.log(data);
      this.loadHoaDon();
      this.router.navigate(['/admin/shopping']);
    }, err => console.log(err));
  }

  openModal(): void {
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
  }
}
