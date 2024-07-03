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
import {AngularFireStorage} from "@angular/fire/compat/storage";
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
export class ProductDetailViewComponent implements OnInit {


  selectedSanPham: SanPhamDto[] = [];
  selectedChatLieu: ChatLieuDto[] = [];
  selectedThuongHieu: ThuongHieuDto[] = [];
  selectedDanhMuc: DanhMucDto[] = [];
  selectedColors: MauSacDto[] = [];
  selectedSizes: KichThuocDto[] = [];
  listChiTietSP: any [] = [];
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
    private snackBar: MatSnackBar,
    private fireStorage: AngularFireStorage
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

  logSelectedColors(): void {
    console.log('Selected Colors:', this.selectedColors);
  }

  // Log selected sizes
  logSelectedSizes(): void {
    console.log('Selected Sizes:', this.selectedSizes);
  }

  get f() {
    return this.chiTietSanPhamFormAdd.controls;
  }

  // @ts-ignore
  selectedSp(): SanPhamDto | undefined {
    return this.selectedSanPham.length > 0 ? this.selectedSanPham[0] : undefined;
  }

  selectedCl(): ChatLieuDto | undefined {
    return this.selectedChatLieu.length > 0 ? this.selectedChatLieu[0] : undefined;
  }

  selectedTh(): ThuongHieuDto | undefined {
    return this.selectedThuongHieu.length > 0 ? this.selectedThuongHieu[0] : undefined;
  }

  selectedDm(): DanhMucDto | undefined {
    return this.selectedDanhMuc.length > 0 ? this.selectedDanhMuc[0] : undefined;
  }

  selectedMauSac(): MauSacDto[] {
    return this.listMauSac.filter(ms => this.selectedColors.some(selMs => selMs.id === ms.id));
  }

  selectedSize(): KichThuocDto[] {
    return this.listKichThuoc.filter(kt => this.selectedSizes.some(selSize => selSize.id === kt.id));
  }

  addChiTietSanPham() {
    const saveCtspRequest = {
      sanPham: this.selectedSp(),
      mauSacList: this.selectedMauSac(),
      chatLieu: this.selectedCl(),
      danhMuc: this.selectedDm(),
      thuongHieu: this.selectedTh(),
      kichThuocList: this.selectedSize()
    };

    this.sanPhamCTService.saveChiTietSanPham(saveCtspRequest).subscribe(
      (response: ApiResponse<any>) => {
        console.log('Lưu chi tiết sản phẩm thành công', response);
        this.snackBar.open('Lưu chi tiết sản phẩm thành công', 'Đóng', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/admin/san-pham-chi-tiet']);
        this.getCtsp();
      },
      (error) => {
        console.error('Có lỗi xảy ra khi lưu chi tiết sản phẩm', error);
        this.snackBar.open('Có lỗi xảy ra khi lưu danh sách!', 'Đóng', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    );
  }


  saveListCt(list: any[]): void {
    this.sanPhamCTService.saveListCt(list).subscribe(
      (response: ApiResponse<any>) => {

        this.selectedDanhMuc = [];
        this.selectedSanPham = [];
        this.selectedThuongHieu = [];
        this.selectedChatLieu = [];
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

  async onFileChange(event: any, ctsp: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const path = `yt/${file.name}`;
        const uploadTask = await this.fireStorage.upload(path, file);
        const url = await uploadTask.ref.getDownloadURL();
        console.log(`File ${i + 1} uploaded. Download URL: ${url}`);

        // Thêm URL ảnh vào danh sách hình ảnh của sản phẩm chi tiết hiện tại
        if (!ctsp.hinhAnhUrls) {
          ctsp.hinhAnhUrls = [];
        }
        ctsp.hinhAnhUrls.push(url);
      }
    }
  }

  // submit(): void {
  //     if (this.selectedImage != null) {
  //         const filePath = this.selectedImage.name;
  //         const fileRef = this.storage.ref(filePath);
  //         this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(finalize
  //         (() => (fileRef.getDownloadURL().subscribe(url => {
  //             let image: img = {id: 0, name: "", status: 1};
  //             image.name = url;
  //             this.listPicture.push(image);
  //             console.log(this.listPicture);
  //         })))).subscribe((data) => {
  //         });
  //     }
  // }


}

