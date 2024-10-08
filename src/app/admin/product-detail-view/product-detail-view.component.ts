import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators,} from '@angular/forms';
import {ChiTietSanPhamDto} from 'src/app/model/chi-tiet-san-pham-dto.model';
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
import {ConfirmationService, MessageService} from 'primeng/api';
import {MatSnackBar} from "@angular/material/snack-bar";
import {HinhAnhService} from "../../service/HinhAnhService";
import {HinhAnhDto} from "../../model/hinh-anh-dto.model";
import {IMG} from "../../model/IMG";
import {UtilityService} from "../../service/UtilityService";
import {debounceTime, distinctUntilChanged, Subject, switchMap} from "rxjs";

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-product-detail-view',
  templateUrl: './product-detail-view.component.html',
  styleUrls: ['./product-detail-view.component.css'],

})
export class ProductDetailViewComponent implements OnInit {

  @ViewChild('editModal') editModal!: ElementRef;
  @ViewChild('submitEdit') submitEdit!: ElementRef;

  cols!: Column[];
  selectedSanPhamChiTiet: ChiTietSanPhamDto = {};
  listHinhAnhSelect: HinhAnhDto[] = [];
  selectedListSp: ChiTietSanPhamDto[] = [];
  selectedSanPham: SanPhamDto[] = [];
  selectedChatLieu: ChatLieuDto[] = [];
  selectedThuongHieu: ThuongHieuDto[] = [];
  selectedDanhMuc: DanhMucDto[] = [];
  selectedColors: MauSacDto[] = [];
  selectedSizes: KichThuocDto[] = [];
  listChiTietSP: any [] = [];
  page = 0;
  size = 5;
  listSanPhamChiTiet: ChiTietSanPhamDto[] = [];
  totalElements = 0;
  totalPages: number = 0;
  listSanPham: SanPhamDto[] = [];
  listChatLieu: ChatLieuDto[] = [];
  listKichThuoc: KichThuocDto[] = [];
  listMauSac: MauSacDto[] = [];
  listDanhMuc: DanhMucDto[] = [];
  listThuongHieu: ThuongHieuDto[] = [];
  listHinhAnh: HinhAnhDto[] = [];
  chiTietSanPhamFormAdd!: FormGroup;
  productDialog: boolean = false;
  product!: ChiTietSanPhamDto;
  selectedProducts!: ChiTietSanPhamDto[] | null;
  submitted: boolean = false;
  statuses!: any[];
  sanPhamChiTiet: any = {};
  currentSlideNew: { [page: number]: { [key: string]: number } } = {};
  productForm: FormGroup;
  searchTerm: string = '';
  searchSubject: Subject<string> = new Subject();
  customerForm!: FormGroup;
  submitted2 = false;

  constructor(
    private sanPhamCTService: SanPhamCTService,
    private sanPhamService: SanPhamService,
    private thuongHieuService: ThuongHieuService,
    private chatLieuService: ChatLieuService,
    private danhMucService: DanhMucService,
    private kichThuocService: KichThuocService,
    private mauSacService: MauSacService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fireStorage: AngularFireStorage,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private hinhAnhService: HinhAnhService,
    private utilityService: UtilityService,
    private fb: FormBuilder,
  ) {
    this.loadMacSac();
    this.productForm = this.fb.group({
      sanPham: ['', Validators.required],
      danhMuc: ['', Validators.required],
      chatLieu: ['', Validators.required],
      mauSac: ['', Validators.required],
      kichThuoc: ['', Validators.required],
      soLuong: [0, Validators.required],
      giaNhap: [0, Validators.required],
      giaBan: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.sanPhamCTService.search(term, this.page, this.size))
    ).subscribe(response => {
      this.listChiTietSP = response.result.content;
      this.totalElements = response.result.totalElements;
      this.totalPages = response.result.totalPages;
    });
    this.loadSanPham();
    this.loadThuongHieu();
    this.loadChatLieu();
    this.loadDanhMuc();
    this.loadKichThuoc();
    this.loadMacSac();
    // this.getCtsp();
    this.loadHinhAnh();
    this.loadSanPhamChiTietByNgayTao();

    if (this.selectedSanPhamChiTiet) {
      this.productForm.patchValue({
        // @ts-ignore

        sanPham: this.selectedSanPhamChiTiet.sanPham,
        // @ts-ignore

        danhMuc: this.selectedSanPhamChiTiet.danhMuc, // Giả sử bạn lưu trữ ID
        // @ts-ignore

        chatLieu: this.selectedSanPhamChiTiet.chatLieu,
        // @ts-ignore

        mauSac: this.selectedSanPhamChiTiet.mauSac,
        // @ts-ignore

        kichThuoc: this.selectedSanPhamChiTiet.kichThuoc,
        soLuong: this.selectedSanPhamChiTiet.soLuong,
        giaNhap: this.selectedSanPhamChiTiet.giaNhap,
        giaBan: this.selectedSanPhamChiTiet.giaBan
      });
    }
  }



  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }


  showModalEdit(): void {
    if (this.editModal && this.editModal.nativeElement) {
      this.editModal.nativeElement.classList.add('show');
      this.editModal.nativeElement.style.display = 'block';
    }
  }

  closeModalEdit(): void {
    if (this.editModal && this.editModal.nativeElement) {
      this.editModal.nativeElement.classList.remove('show');
      this.editModal.nativeElement.style.display = 'none';
    }
  }

  loadSanPhamChiTietByNgayTao(): void {
    this.sanPhamCTService.getSanPhamChiTietSapXepByNGayTao(this.page, this.size)
      .subscribe(response => {
        this.listChiTietSP = response.result.content;
        this.totalElements = response.result.totalElements;
        this.totalPages = response.result.totalPages;

        // Khởi tạo currentSlideNew cho các sản phẩm trên trang hiện tại
        if (!this.currentSlideNew[this.page]) {
          this.currentSlideNew[this.page] = this.listChiTietSP.reduce((acc, sanPham) => {
            acc[sanPham.ma] = 0; // Khởi tạo slide đầu tiên cho mỗi sản phẩm
            return acc;
          }, {} as { [key: string]: number });
        } else {
          // Đảm bảo rằng trạng thái hiện tại của slide cho các sản phẩm đã được giữ lại
          this.listChiTietSP.forEach(sanPham => {
            if (!(sanPham.ma in this.currentSlideNew[this.page])) {
              this.currentSlideNew[this.page][sanPham.ma] = 0;
            }
          });
        }
      });
  }

  prevSlide(ma: string): void {
    const sanPham = this.listChiTietSP.find(sp => sp.ma === ma);
    if (sanPham && sanPham.hinhAnh && sanPham.hinhAnh.length > 0) {
      if (this.currentSlideNew[this.page]) {
        const currentSlides = this.currentSlideNew[this.page];
        currentSlides[ma] = (currentSlides[ma] > 0)
          ? currentSlides[ma] - 1
          : sanPham.hinhAnh.length - 1;
      }
    }
  }

  nextSlide(ma: string): void {
    const sanPham = this.listChiTietSP.find(sp => sp.ma === ma);
    if (sanPham && sanPham.hinhAnh && sanPham.hinhAnh.length > 0) {
      if (this.currentSlideNew[this.page]) {
        const currentSlides = this.currentSlideNew[this.page];
        currentSlides[ma] = (currentSlides[ma] < sanPham.hinhAnh.length - 1)
          ? currentSlides[ma] + 1
          : 0;
      }
    }
  }


  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.listSanPhamChiTiet = this.listSanPhamChiTiet.filter((val) => !this.selectedProducts?.includes(val));
        this.selectedProducts = null;
        this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
      }
    });
  }

  saveProduct() {
    this.submitted = true;

    if (this.selectedSanPhamChiTiet?.sanPham?.ten?.trim()) {
      if (this.selectedSanPhamChiTiet?.id) {
        this.listSanPhamChiTiet[this.findIndexById(this.selectedSanPhamChiTiet?.id)] = this.selectedSanPhamChiTiet;
        this.sanPhamCTService.suaSanPhamChiTiet(this.selectedSanPhamChiTiet).subscribe({
          next: () => {
            this.loadSanPhamChiTietByNgayTao();
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Cập nhật sản phẩm thành công',
              life: 3000
            });
          },
          error: (err) => {
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Cập nhật thất bại', life: 3000});
            console.error('Update failed', err);
          }
        });
      } else {
        this.selectedSanPhamChiTiet.id = this.createId();
        this.listSanPhamChiTiet.push(this.selectedSanPhamChiTiet);
        this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000});
      }

      this.listSanPhamChiTiet = [...this.listSanPhamChiTiet];
      this.productDialog = false;
      this.product = {};
    }
  }


  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.listSanPhamChiTiet.length; i++) {
      if (this.listSanPhamChiTiet[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  // @ts-ignore
  getSeverity(status: number) {
    switch (status) {
      case 1:
        return 'success';
      case 0:
        return 'warning';
      case 2:
        return 'danger';
    }
  }

  onPageChangeSanPhamCT(page: number): void {
    this.page = page;
    this.loadSanPhamChiTietByNgayTao();
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

    const listSPCT: ChiTietSanPhamDto[] = [];

    for (const ms of saveCtspRequest.mauSacList) {
      for (const size of saveCtspRequest.kichThuocList) {
        const ctsp: ChiTietSanPhamDto = {
          ma: "",
          sanPham: saveCtspRequest.sanPham,
          thuongHieu: saveCtspRequest.thuongHieu,
          chatLieu: saveCtspRequest.chatLieu,
          danhMuc: saveCtspRequest.danhMuc,
          kichThuoc: size,
          mauSac: ms,
          soLuong: 0,
          giaNhap: 0,
          giaBan: 0,
          trangThai: 1,
          // HinhAnh: this.listHinhAnhSelect,
        }
        listSPCT.push(ctsp);
      }
    }

    for (const ctsp of listSPCT) {
      // @ts-ignore
      ctsp.ma = listSPCT.indexOf(ctsp);
    }

    this.selectedListSp = listSPCT;
    // this.getCtsp();
    console.log(saveCtspRequest);
  }


  saveListCt(list: any[]): void {
    const listSp = this.utilityService.removeHinhAnhProperty(list);

    const img: IMG = {
      anhDtoListt: this.listHinhAnhSelect,
      chiTietSanPhamDto: listSp
    }
    this.sanPhamCTService.saveListCt(img).subscribe(
      (response: ApiResponse<any>) => {
        // this.getCtsp();
        this.selectedDanhMuc = [];
        this.selectedSanPham = [];
        this.selectedThuongHieu = [];
        this.selectedChatLieu = [];
        this.selectedListSp = []
        // this.listChiTietSP = [];
        this.selectedSizes = [];
        this.selectedColors = [];
        this.listHinhAnhSelect = [];
        this.snackBar.open('Lưu danh sách thành công!', 'Đóng', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.loadSanPhamChiTietByNgayTao();
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

  imgList: HinhAnhDto[] = [];


  async onFileChange(event: any, ctsp: ChiTietSanPhamDto, index: string) {
    // Kiểm tra sự kiện và tệp
    if (!event || !event.files) {
      console.error('Event or files are undefined');
      return;
    }

    const files = event.files;
    for (let file of files) {
      try {
        // Tải lên hình ảnh
        const path = `yt/${file.name}`;
        const uploadTask = await this.fireStorage.upload(path, file);
        const aurl = await uploadTask.ref.getDownloadURL();

        // Tạo đối tượng hình ảnh
        const hinhAnhDto: HinhAnhDto = {
          id: '',
          ma: index.toString(),
          url: aurl,
          trangThai: 1,
        };

        // Thêm vào imgList
        this.imgList.push(hinhAnhDto);

        // Kiểm tra và khởi tạo mảng HinhAnh nếu chưa tồn tại
        if (!ctsp.hinhAnh) {
          ctsp.hinhAnh = [];
        }

        // Thêm URL vào danh sách hình ảnh của ctsp
        // @ts-ignore
        ctsp.HinhAnh.push(hinhAnhDto);

        console.log(`File uploaded. Download URL: ${aurl}`);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    // Cập nhật danh sách hình ảnh đã chọn
    console.log('Danh sách hình ảnh sau khi lưu: ' + this.listChiTietSP.toString());
    this.listHinhAnhSelect = this.imgList;
  }


  removeImage(ctsp: any, index: number) {
    // Xóa URL hình ảnh khỏi danh sách của ctsp
    if (ctsp.HinhAnh && ctsp.HinhAnh.length > index) {
      ctsp.HinhAnh.splice(index, 1);
    }

    // Xóa đối tượng hình ảnh khỏi imgList nếu cần
    this.imgList = this.imgList.filter(img => img.url !== ctsp.HinhAnh[index]);

    console.log('Hình ảnh đã xóa khỏi danh sách:', this.imgList);
  }


  confirm() {
    const confirmed = window.confirm('Bạn chắc chắn muốn thêm biến thể chứ?');
    if (confirmed) {
      this.saveListCt(this.selectedListSp);
      this.snackBar.open('Thêm biến thể thành công!', 'Đóng', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    } else {
      alert('Đã huỷ xác nhận');
    }
  }


  loadHinhAnh() {
    this.hinhAnhService.getAllHinhAnh().subscribe(
      (response: ApiResponse<any>) => {
        this.listHinhAnh = response.result;
        console.log('list ha' + this.listHinhAnh)
      })
  }

  delete(id: string): void {
    this.sanPhamCTService.remove(id).subscribe(
      response => {
        if (response) {
          this.snackBar.open('Xóa sản phẩm thành công!', 'Đóng', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        } else {
          this.snackBar.open('Xóa thất bại!', 'Đóng', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      },
      error => {
        // ('Xảy ra lỗi khi xóa!');
        // Xử lý lỗi nếu cần
      }
    );
  }

  openEditModal(sanPhamChiTiet: ChiTietSanPhamDto): void {
    this.selectedSanPhamChiTiet = { ...sanPhamChiTiet }; // Sử dụng spread operator để sao chép đối tượng
    console.log(this.selectedSanPhamChiTiet)
    this.productForm.patchValue({
      // @ts-ignore
      sanPham: this.selectedSanPhamChiTiet.sanPham,
      danhMuc: this.selectedSanPhamChiTiet.danhMuc, // Giả sử bạn lưu trữ ID
      chatLieu: this.selectedSanPhamChiTiet.chatLieu,
      mauSac: this.selectedSanPhamChiTiet.mauSac,
      kichThuoc: this.selectedSanPhamChiTiet.kichThuoc,
      soLuong: this.selectedSanPhamChiTiet.soLuong,
      giaNhap: this.selectedSanPhamChiTiet.giaNhap,
      giaBan: this.selectedSanPhamChiTiet.giaBan
    });
    // Đảm bảo danh sách các tùy chọn (danh mục, chất liệu,...) đã được tải
    this.showModalEdit()
    console.log(this.productForm)
  }


  updateProduct(): void {
    if (this.productForm.valid) {
      const updatedProduct1 = this.productForm.value;

      const updatedProduct = {
        id : this.selectedSanPhamChiTiet.id,
        ma: this.selectedSanPhamChiTiet.ma,
        sanPham : updatedProduct1.sanPham,
        chatLieu: updatedProduct1.chatLieu,
        danhMuc: updatedProduct1.danhMuc,
        kichThuoc: updatedProduct1.kichThuoc,
        mauSac: updatedProduct1.mauSac,
        soLuong: updatedProduct1.soLuong,
        giaNhap: updatedProduct1.giaNhap,
        giaBan: updatedProduct1.giaBan,
        hinhAnh : this.selectedSanPhamChiTiet.hinhAnh
      }

      console.log(updatedProduct)
      this.sanPhamCTService.suaSanPhamChiTiet(updatedProduct).subscribe({
        next: (response) => {
          this.snackBar.open('Sửa sản phẩm thành công!', 'Đóng', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadSanPhamChiTietByNgayTao();
          this.closeModalEdit();
        },
        error: (err) => {
          this.snackBar.open('Có lỗi sảy ra!', 'Đóng', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        }
      });
    }
  }

}
