import { EOF } from '@angular/compiler';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  chiTietSanPhamForm!: FormGroup;
  showConfirmationModal: boolean = false;

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
    // Khởi tạo form
    this.chiTietSanPhamForm = this.formBuilder.group({
      ma: [''],
      giaNhap: [''],
      giaBan: [''],
      soLuong: [''],
      sanPham: [''],
      thuongHieu: [''],
      chatLieu: [''],
      danhMuc: [''],
      kichThuoc: [''],
      mauSac: ['']
    });

    this.loadSanPhamChiTiet();
    this.loadSanPham();
    this.loadThuongHieu();
    this.loadChatLieu();
    this.loadDanhMuc();
    this.loadKichThuoc();
    this.loadMacSac();

  }

  loadSanPhamChiTiet(): void {
    this.sanPhamCTService.getSanPhamChiTiet(this.page, this.size)
      .subscribe(response => {
        this.listSanPhamChiTiet = response.result.content;
        this.totalElements = response.result.totalElements;
        this.totalPages = response.result.totalPages;
      });
  }

  onPageChangeSanPhamCT(page: number): void {
    this.page = page;
    this.loadSanPhamChiTiet();
  }

  updateTrangThai(id: string): void {
    this.sanPhamCTService.updateTrangThaiById(id).subscribe(
      res => {
        this.loadSanPhamChiTiet();
      }
    );
  }

  // San pham
  loadSanPham(): void {
    this.sanPhamService.getAll().subscribe(
      response => {
        this.listSanPham = response.result;
      }
    )
  }
  // thuong hieu
  loadThuongHieu(): void {
    this.thuongHieuService.getAll().subscribe(
      response => {
        this.listThuongHieu = response.result;
      }
    )
  }
  // Chat Lieu 
  loadChatLieu(): void {
    this.chatLieuService.getAll().subscribe(
      response => {
        this.listChatLieu = response.result;
      }
    )
  }
  // Danh muc
  loadDanhMuc(): void {
    this.danhMucService.getAllDanhMuc().subscribe(
      response => {
        this.listDanhMuc = response.result;
      }
    )
  }
  // Kich thuoc
  loadKichThuoc(): void {
    this.kichThuocService.getAll().subscribe(
      response => {
        this.listKichThuoc = response.result;
      }
    )
  }
  // Mau sac
  loadMacSac(): void {
    this.mauSacService.getAll().subscribe(
      response => {
        this.listMauSac = response.result;
      }
    )
  }


  saveProduct() {
    // xử lý lấy data call api
    if (this.chiTietSanPhamForm.valid) {
      // lay ra value form 
      // const: bien k the thay doi
      const formValues = this.chiTietSanPhamForm.value;
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
          this.loadSanPhamChiTiet;
          this.showConfirmationModal = false;
          alert("Thêm sản phẩm chi tiết thành công!");
        }, error => {
          console.error('Thêm chi tiết sản phẩm thất bại!', error);
          alert('Thêm chi tiết sản phẩm thất bại!');
        }
      )
      // nếu thành công thì get lại list

      // loadSanPhamChiTiet();
      // this.showConfirmationModal = false;

      // nếu thất bại...
    }
  }

  cancelSave() {
    // Đóng modal 
    this.showConfirmationModal = false;
  }

  viewFormAddProduct() {
    // Mở modal 
    this.showConfirmationModal = true;
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

