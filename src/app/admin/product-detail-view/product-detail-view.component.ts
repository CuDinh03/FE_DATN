import { EOF } from '@angular/compiler';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChiTietSanPhamDto } from 'src/app/model/chi-tiet-san-pham-dto.model';
import { AuthenticationService } from 'src/app/service/AuthenticationService';
import { ChatLieuService } from 'src/app/service/ChatLieuService';
import { DanhMucService } from 'src/app/service/DanhMucService';
import { KichThuocService } from 'src/app/service/KichThuocService';
import { MauSacService } from 'src/app/service/MauSacService';
import { SanPhamCTService } from 'src/app/service/SanPhamCTService';
import { SanPhamService } from 'src/app/service/SanPhamService';
import { ThuongHieuService } from 'src/app/service/ThuongHieuService';

@Component({
  selector: 'app-product-detail-view',
  templateUrl: './product-detail-view.component.html',
  styleUrls: ['./product-detail-view.component.css']
})
export class ProductDetailViewComponent {

  page = 0;
  size = 5;
  listSanPhamChiTiet: any[] = [];
  totalElements = 0;
  totalPages: number = 0;

  listSanPham: any[] = [];
  listChatLieu: any[] = [];
  listKichThuoc: any[] = [];
  listMauSac: any[] = [];
  listDanhMuc: any[] = [];
  listThuongHieu: any[] = [];
  sanPhamChiTietID: any;

  chiTietSanPhamFormAdd!: FormGroup;
  chiTietSanPhamFormUpdate!: FormGroup;

  showConfirmationModalAdd: boolean = false;
  showConfirmationModalUpdate: boolean = false;

  constructor(
    private sanPhamCTService: SanPhamCTService,
    private auth: AuthenticationService,
    private sanPhamService: SanPhamService,
    private thuongHieuService: ThuongHieuService,
    private chatLieuService: ChatLieuService,
    private danhMucService: DanhMucService,
    private kichThuocService: KichThuocService,
    private mauSacService: MauSacService,
    private formBuilder: FormBuilder,

  ) { }

  ngOnInit(): void {
    // Khởi tạo form add
    this.chiTietSanPhamFormAdd = this.formBuilder.group({
      ma: ['', Validators.required],  // 
      giaNhap: ['', Validators.required],
      giaBan: ['', Validators.required],
      soLuong: ['', Validators.required],
      sanPham: ['', Validators.required],
      thuongHieu: ['', Validators.required],
      chatLieu: ['', Validators.required],
      danhMuc: ['', Validators.required],
      kichThuoc: ['', Validators.required],
      mauSac: ['', Validators.required]
    });
    // Khởi tạo form update 
    this.chiTietSanPhamFormUpdate = this.formBuilder.group({
      ma: [''],
      giaNhap: [''],
      giaBan: [''],
      // soLuong: [''],
      sanPham: [''],
      thuongHieu: [''],
      chatLieu: [''],
      danhMuc: [''],
      kichThuoc: [''],
      mauSac: ['']
    });

    this.loadSanPhamChiTietByNgayTao();
    this.loadSanPham();
    this.loadThuongHieu();
    this.loadChatLieu();
    this.loadDanhMuc();
    this.loadKichThuoc();
    this.loadMacSac();

  }

  loadSanPhamChiTietByNgayTao(): void {
    this.sanPhamCTService.getSanPhamChiTietSapXepByNGayTao(this.page, this.size)
      .subscribe(response => {
        this.listSanPhamChiTiet = response.result.content;
        this.totalElements = response.result.totalElements;
        this.totalPages = response.result.totalPages;
      });
  }

  onPageChangeSanPhamCT(page: number): void {
    this.page = page;
    this.loadSanPhamChiTietByNgayTao();
  }


  saveProduct() {
    // xử lý lấy data call api
    if (this.chiTietSanPhamFormAdd.valid) {
      // const: bien k the thay doi
      // lay ra value form 
      const formValues = this.chiTietSanPhamFormAdd.value;
      const chiTietSanPhamDto: ChiTietSanPhamDto = {
        ...formValues,
        sanPham: { id: formValues.sanPham }, // Chuyển đổi ID thành đối tượng
        thuongHieu: { id: formValues.thuongHieu },
        chatLieu: { id: formValues.chatLieu },
        danhMuc: { id: formValues.danhMuc },
        kichThuoc: { id: formValues.kichThuoc },
        mauSac: { id: formValues.mauSac },
      };

      this.sanPhamCTService.themSanPhamChiTiet(chiTietSanPhamDto).subscribe(
        response => {
          console.log('Thêm chi tiết sản phẩm thành công!', response);
          this.loadSanPhamChiTietByNgayTao();
          this.showConfirmationModalAdd = false;
          alert("Thêm sản phẩm chi tiết thành công!");
        }, error => {
          console.error('Thêm chi tiết sản phẩm thất bại!', error);
          alert('Thêm chi tiết sản phẩm thất bại!');
        }
      )
    } else {
      this.markTheElement(this.chiTietSanPhamFormAdd);
  }
}

markTheElement(formGroup: FormGroup): void {
  Object.keys(formGroup.controls).forEach(filed => {
    const control = formGroup.get(filed);
    if (control instanceof FormGroup) {
      this.markTheElement(control);
    } else if (control) {
      control.markAsTouched({ onlySelf: true });
    }
  });
}


  // Lấy sản phẩm chi tiết by ID
 async getChiTietSanPhamById(id: string): Promise<void> {
    this.sanPhamCTService.getChiTietSanPhamById(id)
      .subscribe(res => {
        this.sanPhamChiTietID = res.result;
      }, error => {
        console.error('Lỗi khi lấy sản phẩm chi tiết:', error);
      })
  }


  updateProduct() {

    if (this.chiTietSanPhamFormAdd.valid) {
      // const: bien k the thay doi
      // lay ra value form 
      const formValues = this.chiTietSanPhamFormUpdate.value;

      const chiTietSanPhamDto: ChiTietSanPhamDto = {
        id: this.sanPhamChiTietID?.id,
        ma: formValues.ma,

        sanPham: { id: formValues.sanPham }, // Chuyển đổi ID thành đối tượng
        thuongHieu: { id: formValues.thuongHieu },
        chatLieu: { id: formValues.chatLieu },
        danhMuc: { id: formValues.danhMuc },
        kichThuoc: { id: formValues.kichThuoc },
        mauSac: { id: formValues.mauSac },

        soLuong: this.sanPhamChiTietID?.soLuong,
        giaNhap: formValues.giaNhap,
        giaBan: formValues.giaBan,

        ngayNhap: this.sanPhamChiTietID?.ngayNhap,
        ngayTao: this.sanPhamChiTietID?.ngayTao,
        ngaySua: new Date(),

        trangThai: this.sanPhamChiTietID?.trangThai,
        hinhAnh: this.sanPhamChiTietID?.hinhAnh,
      };

      this.sanPhamCTService.suaSanPhamChiTiet(chiTietSanPhamDto, this.sanPhamChiTietID?.id).subscribe(
        response => {
          console.log('Sửa chi tiết sản phẩm thành công!', response);
          this.loadSanPhamChiTietByNgayTao();
          this.showConfirmationModalUpdate = false;
          alert("Sửa sản phẩm chi tiết thành công!");
        }, error => {
          console.error('Sửa chi tiết sản phẩm thất bại!', error);
          alert('Sửa chi tiết sản phẩm thất bại!');
        }
      )

    }
  }

  // ĐÓNG MỞ MODEL 
  cancelSaveAdd() {
    // Đóng modal 
    this.showConfirmationModalAdd = false;
  }

  viewFormAddProduct() {
    // Mở modal 
    this.showConfirmationModalAdd = true;
  }

  cancelSaveUpdate() {
    // Đóng modal 
    this.showConfirmationModalUpdate = false;
  }

 async viewFormUpdateProduct(id: string): Promise<void>  {
    await this.getChiTietSanPhamById(id);
    // Mở modal 
    // lấy ra index của sản phẩm chi tiết theo id 
    const index = this.listSanPhamChiTiet.findIndex(e => e.id == id);
    // lấy ra giá trị theo index 
    const value = this.listSanPhamChiTiet[index];
    // fill value form 
    this.fillValueToForm(value);
    this.showConfirmationModalUpdate = true;
  }

  fillValueToForm(spct: any) {
    this.chiTietSanPhamFormUpdate.patchValue({
      ma: spct.ma,
      giaNhap: spct.giaNhap,
      giaBan: spct.giaBan,
      // soLuong: [''],
      sanPham: spct.sanPham.id,
      thuongHieu: spct.thuongHieu.id,
      chatLieu: spct.chatLieu.id,
      danhMuc: spct.danhMuc.id,
      kichThuoc: spct.kichThuoc.id,
      mauSac: spct.mauSac.id,
    })
  }



  // Phương thức này sẽ được gọi khi bạn thay đổi tùy chọn trong select
  onSelectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    // Thực hiện hành động tương ứng với giá trị được chọn
    this.handleSelection(selectedValue);
  }

  // Phương thức để xử lý giá trị được chọn
  handleSelection(value: string): void {
    if (value === '5') {
      // Thực hiện hành động khi chọn "5"
      this.size = 5;
      this.loadSanPhamChiTietByNgayTao();
    } else if (value === '10') {
      // Thực hiện hành động khi chọn "10"
      this.size = 10;
      this.loadSanPhamChiTietByNgayTao();
    } else if (value === '15') {
      // Thực hiện hành động khi chọn "15"
      this.size = 15;
      this.loadSanPhamChiTietByNgayTao();
    }
  }


  // Phương thức hiển thị hộp thoại xác nhận và gọi updateTrangThai nếu người dùng xác nhận
  confirmAndUpdate(id: string): void {
    const confirmed = window.confirm('Bạn có chắc chắn muốn cập nhật trạng thái không?');
    if (confirmed) {
      this.updateTrangThai(id);
    }
  }

  // UPDATE TRANG THAI SPCT
  updateTrangThai(id: string): void {
    this.sanPhamCTService.updateTrangThaiById(id).subscribe(
      res => {
        this.loadSanPhamChiTietByNgayTao();
        alert('Xóa sản phẩm chi tiết thành công!')
      }
    );
  }


  // San pham
  loadSanPham(): void {
    this.sanPhamService.getAllSanPhamDangHoatDong().subscribe(
      response => {
        this.listSanPham = response.result;
      }
    )
  }
  // thuong hieu
  loadThuongHieu(): void {
    this.thuongHieuService.getAllThuongHieuDangHoatDong().subscribe(
      response => {
        this.listThuongHieu = response.result;
      }
    )
  }
  // Chat Lieu 
  loadChatLieu(): void {
    this.chatLieuService.getAllChatLieuDangHoatDong().subscribe(
      response => {
        this.listChatLieu = response.result;
      }
    )
  }
  // Danh muc
  loadDanhMuc(): void {
    this.danhMucService.getAllDanhMucDangHoatDong().subscribe(
      response => {
        this.listDanhMuc = response.result;
      }
    )
  }
  // Kich thuoc
  loadKichThuoc(): void {
    this.kichThuocService.getAllKichThuocDangHoatDong().subscribe(
      response => {
        this.listKichThuoc = response.result;
      }
    )
  }
  // Mau sac
  loadMacSac(): void {
    this.mauSacService.getAllMauSacDangHoatDong().subscribe(
      response => {
        this.listMauSac = response.result;
      }
    )
  }

  get f() {
    return this.chiTietSanPhamFormAdd.controls;
  }
}




// deleteSanPham(id: string): Observable<ApiResponse<void>> {
//   const token = localStorage.getItem('token');
//   const headers = new HttpHeaders({
//     'Authorization': `Bearer ${token}`
//   });

//   return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`, {headers});
// }

// delete(id: any): void {
//   this.sanPhamCTService.deleteSanPham(id).subscribe(() => {
//     this.loadSanPhamChiTiet();
//     this.router.navigate(['/admin/san-pham']);
//   });
// }

// openSanPham(id: any): void {
//   this.sanPhamCTService.openSanPham(id).subscribe(() => {
//     this.loadSanPhamChiTiet();
//     this.router.navigate(['/admin/san-pham']);
//   });
// }

