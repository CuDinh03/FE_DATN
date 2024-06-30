import {EOF} from '@angular/compiler';
import {AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ChiTietSanPhamDto} from 'src/app/model/chi-tiet-san-pham-dto.model';
import {AuthenticationService} from 'src/app/service/AuthenticationService';
import {ChatLieuService} from 'src/app/service/ChatLieuService';
import {DanhMucService} from 'src/app/service/DanhMucService';
import {KichThuocService} from 'src/app/service/KichThuocService';
import {MauSacService} from 'src/app/service/MauSacService';
import {SanPhamCTService} from 'src/app/service/SanPhamCTService';
import {SanPhamService} from 'src/app/service/SanPhamService';
import {ThuongHieuService} from 'src/app/service/ThuongHieuService';
// @ts-ignore
import * as $ from 'jquery';
import 'select2';
// @ts-ignore
import JQuery from "$GLOBAL$";
import {ApiResponse} from "../../model/ApiResponse";
import {MauSacDto} from "../../model/mau-sac-dto.model";
import {KichThuocDto} from "../../model/kich-thuoc-dto.model";
import {SanPhamDto} from "../../model/san-pham-dto.model";
import {ChatLieuDto} from "../../model/chat-lieu-dto.model";
import {ThuongHieuDto} from "../../model/thuong-hieu-dto.model";
import {DanhMucDto} from "../../model/danh-muc-dto.model";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-product-detail-view',
  templateUrl: './product-detail-view.component.html',
  styleUrls: ['./product-detail-view.component.css']
})
export class ProductDetailViewComponent implements OnInit, AfterViewInit {

  selectedSanPham: SanPhamDto | undefined;
  selectedChatLieu: ChatLieuDto | undefined;
  selectedThuongHieu: ThuongHieuDto | undefined;
  selectedDanhMuc: DanhMucDto | undefined;
  selectedColors: string[] = [];
  selectedSizes: string[] = [];
  availableColors: string[] = [];
  availableSizes: string[] = [];
  listChiTietSP: any [] = [];
  @ViewChild('colorsSelect') colorsSelect: ElementRef | undefined;
  @ViewChild('sizeSelect') sizeSelect: ElementRef | undefined;
  page = 0;
  size = 5;
  listSanPhamChiTiet: any[] = [];
  totalElements = 0;
  totalPages: number = 0;
  listSanPham: SanPhamDto[] = [];
  listChatLieu: ChatLieuDto[] = [];
  listKichThuoc: KichThuocDto[] = [];
  listMauSac: MauSacDto[] = [];
  listDanhMuc: DanhMucDto[] = [];
  listThuongHieu: ThuongHieuDto[] = [];
  sanPhamChiTietID: any;
  chiTietSanPhamFormAdd!: FormGroup;
  chiTietSanPhamFormUpdate!: FormGroup;
  sanPhamForm!: FormGroup; // Khai báo sanPhamForm là một FormGroup
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
    private router: Router,
    private snackBar: MatSnackBar
  ) {
  }

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


    this.sanPhamForm = this.formBuilder.group({
      sanPham: [''],     // FormControl cho loại sản phẩm
      thuongHieu: [''],  // FormControl cho thương hiệu
      chatLieu: [''],    // FormControl cho chất liệu
      danhMuc: [''],     // FormControl cho danh mục
      kichThuoc: [''],   // FormControl cho kích thước
      mauSac: ['']       // FormControl cho màu sắc
    });
    this.loadSanPhamChiTietByNgayTao();
    this.loadSanPham();
    this.loadThuongHieu();
    this.loadChatLieu();
    this.loadDanhMuc();
    this.loadKichThuoc();
    this.loadMacSac();
  }


  getCtsp() {
    this.sanPhamCTService.getCtsp().subscribe(
      (response: ApiResponse<any>) => {
        this.listChiTietSP = response.result;
        console.log('Show chi tiết sản phẩm thành công', response);
      },
      (error) => {
        console.error('Có lỗi xảy ra khi lấy chi tiết sản phẩm', error);
      }
    );
  }

  ngAfterViewInit(): void {
    // @ts-ignore
    const $colors = $(this.colorsSelect.nativeElement);
    // @ts-ignore
    const $sizes = $(this.sizeSelect.nativeElement);

    $colors.select2({
      placeholder: 'Chọn màu sắc'
    });

    $sizes.select2({
      placeholder: 'Chọn Size'
    });

    $colors.on('change', (event: JQuery.TriggeredEvent) => {
      const selectedColor = $colors.val() as string;
      if (selectedColor && !this.selectedColors.includes(selectedColor)) {
        this.selectedColors.push(selectedColor);
        this.updateSelectedColors();
      }
      // Reset select2 để có thể chọn tiếp mục khác
      $colors.val(null).trigger('change');
    });

    $sizes.on('change', (event: JQuery.TriggeredEvent) => {
      const selectedSize = $sizes.val() as string;
      if (selectedSize && !this.selectedSizes.includes(selectedSize)) {
        this.selectedSizes.push(selectedSize);
        this.updateSelectedSizes();
      }
      // Reset select2 để có thể chọn tiếp mục khác
      $sizes.val(null).trigger('change');
    });
  }

  updateSelectedSizes(): void {
    const $sizeList = $('#sizeList');
    $sizeList.empty();
    this.selectedSizes.forEach(size => {
      $sizeList.append('<li>' + size + '</li>');
    });
  }

  updateSelectedColors(): void {
    const $colorList = $('#colorList');
    $colorList.empty();
    this.selectedColors.forEach(color => {
      $colorList.append('<li>' + color + '</li>');
    });
  }

  removeColor(color: string): void {
    const index = this.selectedColors.indexOf(color);
    if (index !== -1) {
      this.selectedColors.splice(index, 1);
      this.updateSelectedColors();
    }
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
        sanPham: {id: formValues.sanPham}, // Chuyển đổi ID thành đối tượng
        thuongHieu: {id: formValues.thuongHieu},
        chatLieu: {id: formValues.chatLieu},
        danhMuc: {id: formValues.danhMuc},
        kichThuoc: {id: formValues.kichThuoc},
        mauSac: {id: formValues.mauSac},
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
        control.markAsTouched({onlySelf: true});
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

        sanPham: {id: formValues.sanPham}, // Chuyển đổi ID thành đối tượng
        thuongHieu: {id: formValues.thuongHieu},
        chatLieu: {id: formValues.chatLieu},
        danhMuc: {id: formValues.danhMuc},
        kichThuoc: {id: formValues.kichThuoc},
        mauSac: {id: formValues.mauSac},

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

  async viewFormUpdateProduct(id: string): Promise<void> {
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
    this.chatLieuService.getAllChatLieu().subscribe(
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
        for (const kt of this.listKichThuoc) {
          this.availableSizes.push(kt.ten)
        }

      }
    )
  }

  // Mau sac
  loadMacSac(): void {
    this.mauSacService.getAll().subscribe(
      response => {
        this.listMauSac = response.result;
        for (const responseElement of this.listMauSac) {
          this.availableColors.push(responseElement.ten)
        }
      }
    )
  }

  get f() {
    return this.chiTietSanPhamFormAdd.controls;
  }

  // Các hàm xử lý khi select thay đổi
  onSanPhamChange(): void {
    const sanPhamId = this.sanPhamForm.value.sanPham;
    this.sanPhamCTService.getChiTietSanPhamById(sanPhamId)
      .subscribe(response => {
        this.listSanPhamChiTiet = response.result; // Cập nhật lại dữ liệu khi thay đổi sản phẩm
      });
  }

  onThuongHieuChange(): void {
    const thuongHieuId = this.sanPhamForm.value.thuongHieu;
    this.sanPhamCTService.getSPCTByThuongHieuId(thuongHieuId)
      .subscribe(response => {
        this.listSanPhamChiTiet = response.result; // Cập nhật lại dữ liệu khi thay đổi thương hiệu
      });
  }

  onChatLieuChange(): void {
    const chatLieuId = this.sanPhamForm.value.chatLieu;
    this.sanPhamCTService.getSPCTByChatLieuId(chatLieuId)
      .subscribe(response => {
        this.listSanPhamChiTiet = response.result; // Cập nhật lại dữ liệu khi thay đổi chất liệu
      });
  }

  onDanhMucChange(): void {
    const danhMucId = this.sanPhamForm.value.danhMuc;
    this.sanPhamCTService.getSPCTByDanhMucId(danhMucId)
      .subscribe(response => {
        this.listSanPhamChiTiet = response.result; // Cập nhật lại dữ liệu khi thay đổi danh mục
      });
  }

  onKichThuocChange(): void {
    const kichThuocId = this.sanPhamForm.value.kichThuoc;
    this.sanPhamCTService.getSPCTByKichThuocId(kichThuocId)
      .subscribe(response => {
        this.listSanPhamChiTiet = response.result; // Cập nhật lại dữ liệu khi thay đổi kích thước
      });
  }

  onMauSacChange(): void {
    const mauSacId = this.sanPhamForm.value.mauSac;
    this.sanPhamCTService.getSPCTByMauSacId(mauSacId)
      .subscribe(response => {
        this.listSanPhamChiTiet = response.result; // Cập nhật lại dữ liệu khi thay đổi màu sắc
      });
  }

  selectedMauSacArray: MauSacDto[] = [];
  selectedKichThuocArray: KichThuocDto[] = [];
  sanPham: SanPhamDto | undefined;
  chatLieu: ChatLieuDto | undefined;
  thuongHieu: ThuongHieuDto | undefined;
  danhMuc: DanhMucDto | undefined;

  // @ts-ignore
  selectedSp(): SanPhamDto {
    for (const sp of this.listSanPham) {
      if (this.selectedSanPham?.id === sp.id) {
        return sp;
      }
    }
  }  // @ts-ignore
  selectedCl(): ChatLieuDto {
    for (const cl of this.listChatLieu) {
      if (this.selectedChatLieu?.id === cl.id) {
        return cl;
      }
    }
  }  // @ts-ignore
  selectedTh(): ThuongHieuDto {
    for (const th of this.listThuongHieu) {
      if (this.selectedThuongHieu?.id === th.id) {
        return th;
      }
    }
  }  // @ts-ignore
  selectedDm(): DanhMucDto {
    for (const dm of this.listDanhMuc) {
      if (this.selectedDanhMuc?.id === dm.id) {
        return dm;
      }
    }
  }

  selectedMauSac(): MauSacDto[] {
    for (const ms of this.listMauSac) {
      for (const slms of this.selectedColors) {
        if (ms.ten === slms) {
          this.selectedMauSacArray.push(ms)
        }
      }
    }
    return this.selectedMauSacArray;
  }

  selectedSize(): KichThuocDto[] {
    for (const kt of this.listKichThuoc) {
      for (const slkt of this.selectedSizes) {
        if (kt.ten === slkt) {
          this.selectedKichThuocArray.push(kt)
        }
      }
    }
    return this.selectedKichThuocArray;
  }

  addChiTietSanPham() {
    const saveCtspRequest = {
      sanPham: this.selectedSp(),
      mauSacList: this.selectedMauSac(),
      chatLieu: this.selectedCl(),
      danhMuc: this.selectedDm(),
      thuongHieu: this.selectedTh(),
      kichThuocList: this.selectedSize()
    }
    console.log(saveCtspRequest)
    this.sanPhamCTService.saveChiTietSanPham(saveCtspRequest).subscribe(
      (response: ApiResponse<any>) => {

        console.log('Lưu chi tiết sản phẩm thành công', response);
        this.router.navigate(['/admin/san-pham-chi-tiet']);
        this.getCtsp();
      },
      (error) => {
        console.error('Có lỗi xảy ra khi lưu chi tiết sản phẩm', error);
      }
    );
  }

  saveListCt(list: any[]): void {
    this.sanPhamCTService.saveListCt(list).subscribe(
      (response: ApiResponse<any>) => {

        this.listChiTietSP = [];
        this.selectedSizes = [];
        this.selectedColors = [];
        this.getCtsp();
        this.loadSanPhamChiTietByNgayTao();

        this.router.navigate(['/admin/san-pham-chi-tiet']).then(() => {
          this.snackBar.open('Lưu danh sách thành công!', 'Đóng', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        }).catch(err => {
          console.error('Lỗi chuyển hướng đến /admin/san-pham-chi-tiet:', err);
        });
      },
      (error) => {
        console.error('Có lỗi xảy ra khi lưu danh sách', error);
        // Handle error scenario
        this.snackBar.open('Có lỗi xảy ra khi lưu danh sách!', 'Đóng', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    );
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



