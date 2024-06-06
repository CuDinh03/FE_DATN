import { HoaDonDto } from './../../model/hoa-don-dto.model';
import { ThanhToanDto } from './../../model/thanh-toan-dto.model';

import { error } from '@angular/compiler-cli/src/transformers/util';
import { KhachHangService } from './../../service/KhachHangService';
import { VoucherService } from './../../service/VoucherService';
import { SanPhamCTService } from 'src/app/service/SanPhamCTService';
import { GioHangChiTietService } from './../../service/GioHangChiTietService';
import { HoaDonGioHangService } from './../../service/HoaDonGioHangService';
import { HoaDonService } from './../../service/HoaDonService';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Validators } from '@angular/forms';
import { AuthenticationService } from './../../service/AuthenticationService';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DanhMucDto } from 'src/app/model/danh-muc-dto.model';
import { DanhMucService } from 'src/app/service/DanhMucService';
import { ApiResponse } from "../../model/ApiResponse";
import { ErrorCode } from "../../model/ErrorCode";
import { HoaDonChiTietService } from 'src/app/service/HoaDonChiTietService';
import { GioHangService } from 'src/app/service/GioHangService';
import { GioHangChiTietDto } from 'src/app/model/gio-hang-chi-tiet-dto.model';
import { ThanhToanService } from 'src/app/service/ThanhToanService';

@Component({
  selector: 'app-shopping-view',
  templateUrl: './shopping-view.component.html',
  styleUrls: ['./shopping-view.component.css']
})
export class ShoppingViewComponent {
  @ViewChild('voucherModal') voucherModal!: ElementRef;
  vouchers: any[] = [];
  listHoaDon: any = {};
  gioHang: any = {};
  chiTietSanPham: any = {};
  listHoaDonGioHang: any[] = [];
  hoaDon: any = {};
  startFrom = 1;
  submitted = false;
  errorMessage: string = '';
  selectedDanhMuc: any;
  maxHoaDon = 5;
  isModalVisible = false;
  gioHangChiTiet: any[] = [];
  page = 0;
  voucher: any;
  size = 5;
  noProductsFound: boolean = false;
  totalElements = 0;
  totalPages: number = 0;
  listSanPhamChiTiet: any[] = [];
  currentPage = 0;
  pageSize = 6;
  customer: any = null;
  newCustomer: any = {ten: ''};
  sdtValue: string = '';
  results: string[] = [];
  listVoucher: any[] = [];
  maHoaDon: string = '';
  danhMucList: DanhMucDto[] = [];
  thanhToanDto: ThanhToanDto;



  constructor(private auth: AuthenticationService,
    private router: Router,
    private hoaDonGioHangService: HoaDonGioHangService,
    private gioHangChiTietService: GioHangChiTietService,
    private chiTietSanPhamService: SanPhamCTService,
    private voucherService: VoucherService,
    private khachHangService: KhachHangService,
    private hoaDonService: HoaDonService,
    private gioHangService: GioHangService,
    private danhMucService : DanhMucService,
    private thanhToanService: ThanhToanService,
    private activatedRoute: ActivatedRoute

    ) {
      this.thanhToanDto = {
        hoaDonDto: {
          id: '',
          ma: '',
          khachHangId: '',
          nhanVienId: '',
          tongTien:'',
          tongTienGiam: '',
          ngayTao: new Date(),
          ngaySua: new Date(),
          trangThai: true,
        },
        gioHangChiTietDtoList: []
      };

  }
  ngOnInit(): void {
    this.loadHoaDonGioHang();
    this.loadChiTietSP();
    this.loadMaHoaDonFromLocalStorage();
    this.loadDanhMuc();

    this.activatedRoute.paramMap.subscribe(params => {
      const maHoaDon = params.get('ma');
      if (maHoaDon) {
        this.hoaDonService.getHoaDonByMa(maHoaDon).subscribe(
          data => {
            this.hoaDon= data.result;
            localStorage.setItem('dbhoadon',this.hoaDon);
          },
          error => {
            console.error('Error fetching invoice data', error);
          }
        );
      }
    });

  }

  onSubmitPayment() {

    // this.maHoaDon = this.router.snpa

    // this.hoaDonService.getHoaDonByMa()

    this.thanhToanService.thanhToan(this.thanhToanDto).subscribe(

      (response: ApiResponse<ThanhToanDto>) => {
        if (response.message === 'Thanh toán thành công') {


          console.log('Payment successful:', response.result);
        } else {
          // Handle payment error
          console.log('Payment failed:', response.message);
        }
      },
      (error) => {
        // Handle HTTP error
        console.error('HTTP error:', error);
      }
    );
  }

  loadGioHangChiTiet(idGioHang: string): void {
    this.gioHangChiTietService.getAll(idGioHang).subscribe(
            (response: ApiResponse<any>) => {
        if (response.result && response.result.length > 0) {
            this.gioHangChiTiet = response.result;
            this.noProductsFound = false; // Đặt noProductsFound là false khi có dữ liệu sản phẩm
        } else {
            this.noProductsFound = true; // Đặt noProductsFound là true khi không có dữ liệu sản phẩm
            this.gioHangChiTiet = [];
        }
    },
    (error: HttpErrorResponse) => {
        if (error.error.code === ErrorCode.NO_CARTDETAIl_FOUND) {
            this.noProductsFound = true;
            this.gioHangChiTiet = [];
        } else {
            console.error('Unexpected error:', error);
        }
    }
);
}

loadDanhMuc(): void {
  this.danhMucService.getAllDanhMuc().subscribe(
    (response: ApiResponse<DanhMucDto[]>) => {
      if (response.result) {
        this.danhMucList = response.result;
      }
    },
    (error: HttpErrorResponse) => {
      console.error('Error loading danh muc:', error);
    }
  );
}

calculateTotal(): number {
  let total = 0;
  this.gioHangChiTiet.forEach((item: any) => {
    total += item.soLuong * item.chiTietSanPham.giaBan;
  });
  return total;
}

deleteHoaDonFromLocalStorage(): void {
  const storedHoaDon = localStorage.getItem('hoaDon');
  if (storedHoaDon) {
    const hoaDon: any = JSON.parse(storedHoaDon);
    const idHoaDon = hoaDon.id;

    const isConfirmed = confirm('Bạn có chắc chắn muốn xóa hóa đơn này không?');

    if (isConfirmed) {
      this.hoaDonService.deleteHoaDon(idHoaDon).subscribe(
        (response: ApiResponse<any>) => {
          if (response.code === 0) { // Giả sử API trả về một thuộc tính 'success'
            this.loadHoaDonGioHang(); // Tải lại danh sách hóa đơn
            alert('Xóa hóa đơn thành công!');
            this.router.navigate(['/admin/shopping']);
          } else {
            alert('Có lỗi xảy ra khi xóa hóa đơn.');
          }
        },
        (error: HttpErrorResponse) => {
          console.error('Có lỗi xảy ra khi xóa hóa đơn:', error);
          alert('Có lỗi xảy ra khi xóa hóa đơn.');
        }
      );
    }
  } else {
    console.error('Không tìm thấy thông tin hóa đơn trong localStorage');
  }
}


loadHoaDonById(idHoaDon: string): void {
  this.hoaDonService.getHoaDonById(idHoaDon)
      .subscribe(
        (response: ApiResponse<any>) => {
          if (response.result) {
            this.listHoaDon = response.result;
            this.maHoaDon = this.listHoaDon.ma;
            localStorage.setItem('hoaDon', JSON.stringify(response.result));
            this.router.navigate(['/admin/shopping'])
            console.log(this.listHoaDon.ma);

          }
        })
}

loadGioHangById(idGioHang: string): void {
  this.gioHangService.getGioHangById(idGioHang)
      .subscribe(
        (response: ApiResponse<any>) => {
          if (response.result) {
            this.gioHang = response.result;
            localStorage.setItem('gioHang', JSON.stringify(response.result));
            this.router.navigate(['/admin/shopping'])
          }
        })
}

loadChiTietSanPhamById(idChiTietSanPham: string): void {
  this.chiTietSanPhamService.getChiTietSanPhamById(idChiTietSanPham)
      .subscribe(
        (response: ApiResponse<any>) => {
          if (response.result) {
            this.chiTietSanPham = response.result;
            localStorage.setItem('chiTietSanPham', JSON.stringify(response.result));
            this.router.navigate(['/admin/shopping'])
          }
        })
}

themSanPhamVaoGioHang(): void {
  const storedGioHang = localStorage.getItem('gioHang');
  const storedChiTietSanPham = localStorage.getItem('chiTietSanPham');

  if (storedGioHang && storedChiTietSanPham) {
    const gioHang = JSON.parse(storedGioHang);
    const chiTietSanPham = JSON.parse(storedChiTietSanPham);

    const gioHangChiTietDto: GioHangChiTietDto = {
      id: '',
      soLuong: 1, // Or any other quantity you need
      chiTietSanPham: chiTietSanPham,
      gioHang: gioHang,
      tongTienGiam: 0, // Assuming default values, you may update as per requirements
      trangThai: true, // Assuming default values, you may update as per requirements
      ngayTao: new Date(),
      ngaySua: new Date()
    };

    this.gioHangChiTietService.themSanPhamVaoGioHang(gioHangChiTietDto).subscribe(
      (response: ApiResponse<any>) => {
        if (response.result) {
          this.loadGioHangChiTiet(response.result.gioHang.id);
         alert('Thêm sản phẩm thành công');
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Thêm không thành công:', error);
      }
    );
  } else {
    console.error('Không tìm thấy giỏ hàng hoặc chi tiết sản phẩm nào trong local storage');
  }
}


loadMaHoaDonFromLocalStorage(): void {
  const storedHoaDon = localStorage.getItem('listHoaDon');
  if (storedHoaDon) {
    const hoaDon = JSON.parse(storedHoaDon);
    this.maHoaDon = hoaDon.ma; // Giả sử mã hóa đơn nằm ở thuộc tính 'ma'
  }
}

loadChiTietSP(): void {
  this.chiTietSanPhamService.getSanPhamChiTiet(this.page, this.size)
    .subscribe(response => {
      this.listSanPhamChiTiet = response.result.content;
      this.totalElements = response.result.totalElements;
      this.totalPages = response.result.totalPages;
    });
}

  handleErrorGetAllHoaDonCT(error: HttpErrorResponse): void {
    console.error(error);
    if (error.error.code === ErrorCode.NO_ORDER_FOUND) {
      this.errorMessage = 'Chưa có sản phẩm nào';
    }
  }

  onPageChangeSanPhamCT(page: number): void {
    this.page = page;
    this.loadChiTietSP();
  }

  loadHoaDonGioHang(): void {
    this.hoaDonGioHangService.getAll().subscribe(
      (response: ApiResponse<any>) => {
        if (response.result && response.result.length > 0) {
          // Nếu có hóa đơn chi tiết, gán danh sách vào biến và đặt noProductsFound là false
          this.listHoaDonGioHang = response.result;

        } else {
          console.log(response);
        }
      },
      (error: HttpErrorResponse) => {
        this.handleErrorGetAllHoaDonCT(error);
      }
    );
  }

  updateGioHangChiTiet(idGioHangChiTiet: string, soLuong: number): void {
    const originalSoLuong = this.gioHangChiTiet.find(item => item.id === idGioHangChiTiet).soLuong;
    this.gioHangChiTietService.updateGioHang(idGioHangChiTiet, soLuong).subscribe(
      (response: ApiResponse<any>) => {
          console.log(response.message);
          // Hiển thị thông báo sửa số lượng thành công
          alert('Sửa số lượng thành công!');
          this.loadChiTietSP();
          this.loadGioHangChiTiet(this.hoaDon.id);
      },
      (error: HttpErrorResponse) => {
          if (error.status === 400 ) {
              // Hiển thị thông báo lỗi khi số lượng vượt quá số lượng sản phẩm chi tiết
              alert('Số lượng nhập vào vượt quá số lượng sản phẩm chi tiết hiện có. Vui lòng nhập lại!');
              const item = this.gioHangChiTiet.find(item => item.id === idGioHangChiTiet);
                if (item) {
                    item.soLuong = originalSoLuong;
                }
          } else {
              console.error('Error updating gio hang:', error);
          }
      }
  );
}

resetGioHang(): void {
  // Đặt lại số lượng sản phẩm về 0
  this.gioHangChiTiet.forEach(item => {
    item.soLuong = 0;
  });

  // Cập nhật giỏ hàng chi tiết bằng cách gọi API cho từng sản phẩm
  this.gioHangChiTiet.forEach(item => {
    this.gioHangChiTietService.updateGioHang(item.id, item.soLuong).subscribe(
      (response: ApiResponse<any>) => {
        console.log(response.message);
      },
      (error: HttpErrorResponse) => {
        console.error('Error updating gio hang:', error);
      }
    );
  });

  // Load lại chi tiết giỏ hàng và chi tiết sản phẩm sau khi cập nhật
  this.loadGioHangChiTiet(this.gioHang.id);  // Giả sử `this.gioHang.id` là ID của giỏ hàng hiện tại
  this.loadChiTietSP();
}

  createHoaDon(): void {
    this.submitted = true;
    if(this.listHoaDonGioHang.length >= 5){
      alert('Chỉ được thêm tối đa 5 hóa đơn')
      return;
    }
    this.hoaDonGioHangService.createHoaDon(this.hoaDon).subscribe(data => {
      console.log(data);
      this.loadHoaDonGioHang();
      this.router.navigate(['/admin/shopping']);
    }, err => console.log(err));
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadVoucher();
    }
  }

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
              // this.showAddCustomerModal();
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

  // showAddCustomerModal() {
  //   const modalElement = document.getElementById('addCustomerModal');
  //   if (modalElement) {
  //     const modal = new bootstrap.Modal(modalElement);
  //     modal.show();
  //   }
  // }
  // addCustomer() {
  //   // this.khachHangService.addKhachHang(this.newCustomer)
  //   //   .subscribe(
  //   //     (response: ApiResponse<any>) => {
  //   //       if (response.result) {
  //   //         this.customer = response.result;
  //   //         localStorage.setItem('kh', JSON.stringify(response.result));
  //   //         this.router.navigate(['/admin/shopping']);
  //   //         this.hideAddCustomerModal();
  //   //       }
  //   //     }
  //   //   );
  // }

  // hideAddCustomerModal() {
  //   const modalElement = document.getElementById('addCustomerModal');
  //   if (modalElement) {
  //     const modal = bootstrap.Modal.getInstance(modalElement);
  //     if (modal) {
  //       modal.hide();
  //     }
  //   }
  // }

   formatDate(dateString: string): string {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, '0'); // Get day and pad with leading zero if necessary
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month (0-based index, hence the +1) and pad with leading zero if necessary
    const year = date.getFullYear(); // Get full year

    return `${day}/${month}/${year}`; // Return in the desired format (dd/MM/yyyy)
}

}
