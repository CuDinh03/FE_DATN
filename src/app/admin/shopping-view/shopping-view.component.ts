import {Router} from '@angular/router';
import {AuthenticationService} from './../../service/AuthenticationService';
import {Component, ElementRef, ViewChild} from '@angular/core';
import {VoucherService} from "../../service/VoucherService";
import {ApiResponse} from "../../model/ApiResponse";
import {KhachHangService} from "../../service/KhachHangService";
import * as bootstrap from "bootstrap";


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


  constructor(
              private router: Router,
              private voucherService: VoucherService,
              private khachHangService: KhachHangService
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

}
