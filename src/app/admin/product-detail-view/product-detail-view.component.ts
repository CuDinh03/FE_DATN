import {Component, OnInit} from '@angular/core';
import { FormGroup,} from '@angular/forms';
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

  cols!: Column[];

  uploadedFiles: any[] = [];
  listHinhAnhSelect: HinhAnhDto[] = [];
  selectedListSp: ChiTietSanPhamDto[] = [];
  selectedSanPham: SanPhamDto[] = [];
  selectedChatLieu: ChatLieuDto[] = [];
  selectedThuongHieu: ThuongHieuDto[] = [];
  selectedDanhMuc: DanhMucDto[] = [];
  selectedColors: MauSacDto[] = [];
  selectedSizes: KichThuocDto[] = [];
  listChiTietSP: ChiTietSanPhamDto [] = [];
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
  sanPhamChiTietID: any;
  chiTietSanPhamFormAdd!: FormGroup;
  chiTietSanPhamFormUpdate!: FormGroup;

  productDialog: boolean = false;

  product!: ChiTietSanPhamDto;

  selectedProducts!: ChiTietSanPhamDto[] | null;

  submitted: boolean = false;

  statuses!: any[];

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
    private hinhAnhService: HinhAnhService
  ) {
    this.loadMacSac();
  }

  ngOnInit(): void {
    this.loadSanPhamChiTietByNgayTao();
    this.loadSanPham();
    this.loadThuongHieu();
    this.loadChatLieu();
    this.loadDanhMuc();
    this.loadKichThuoc();
    this.loadMacSac();
    this.getCtsp();
    this.loadHinhAnh();
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

  editProduct(product: ChiTietSanPhamDto) {
    this.product = {...product};
    this.productDialog = true;
  }

  deleteProduct(product: ChiTietSanPhamDto) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.sanPham.ten + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.listSanPhamChiTiet = this.listSanPhamChiTiet.filter((val) => val.id !== product.id);
        this.product = {};
        // this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
      }
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }


  saveProduct() {
    this.submitted = true;

    if (this.product.sanPham.ten?.trim()) {
      if (this.product.id) {
        this.listSanPhamChiTiet[this.findIndexById(this.product.id)] = this.product;
        this.sanPhamCTService.suaSanPhamChiTiet(this.product).subscribe({
          next: () => {
            this.loadSanPhamChiTietByNgayTao();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Cập nhật sản phẩm thành công', life: 3000 });
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Cập nhật thất bại', life: 3000 });
            console.error('Update failed', err);
          }
        });
      } else {
        this.product.id = this.createId();
        this.listSanPhamChiTiet.push(this.product);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
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


  getCtsp() {
    this.listChiTietSP = this.selectedListSp;
    console.log('listChiTietSP:' + this.listChiTietSP)
  }


  loadSanPhamChiTietByNgayTao(): void {
    this.sanPhamCTService.getAllSanPhamChiTiet()
      .subscribe(response => {
        this.listSanPhamChiTiet = response.result;
      });
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


  // Lấy sản phẩm chi tiết by ID
  async getChiTietSanPhamById(id: string): Promise<void> {
    this.sanPhamCTService.getChiTietSanPhamById(id)
      .subscribe(res => {
        this.sanPhamChiTietID = res.result;
      }, error => {
        console.error('Lỗi khi lấy sản phẩm chi tiết:', error);
      })
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
          hinhAnh: this.listHinhAnhSelect,
        }
        listSPCT.push(ctsp);
      }
    }

    for (const ctsp of listSPCT) {
      // @ts-ignore
      ctsp.ma = listSPCT.indexOf(ctsp);
    }

    this.selectedListSp = listSPCT;
    this.getCtsp();
    console.log(saveCtspRequest);
  }


  saveListCt(list: ChiTietSanPhamDto[]): void {
    const img: IMG = {
      anhDtoListt: this.listHinhAnhSelect,
      chiTietSanPhamDto: list
    }
    this.sanPhamCTService.saveListCt(img).subscribe(
      (response: ApiResponse<any>) => {


        // this.getCtsp();
        this.loadSanPhamChiTietByNgayTao();
        this.selectedDanhMuc = [];
        this.selectedSanPham = [];
        this.selectedThuongHieu = [];
        this.selectedChatLieu = [];
        this.listChiTietSP = [];
        this.selectedSizes = [];
        this.selectedColors = [];
        this.listHinhAnhSelect = [];
        this.snackBar.open('Lưu danh sách thành công!', 'Đóng', {
          duration: 3000,
          panelClass: ['success-snackbar']
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
  imgList: HinhAnhDto[] = [];

  async onFileChange(event: any, ctsp: any , index:string) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);

      const path = `yt/${file.name}`;
      const uploadTask = await this.fireStorage.upload(path, file);
      const aurl = await uploadTask.ref.getDownloadURL();

      const hinhAnhDto: HinhAnhDto = {
        id: '',
        ma: index.toString(),
        url: aurl,
        chiTietSanPham: ctsp,
        trangThai: 1,
      }

      this.imgList.push(hinhAnhDto)

      if (!ctsp.hinhAnhUrls) {
        ctsp.hinhAnhUrls = [];
      }
      ctsp.hinhAnhUrls.push(aurl);
      console.log(`File uploaded. Download URL: ${aurl}`);
    }

    console.log('saukhi luu anh vao' + this.listChiTietSP.toString())
    this.listHinhAnhSelect = this.imgList;

  }

  confirm() {
    this.confirmationService.confirm({
      header: 'Xác nhận',
      message: 'Bạn chắc chắn muốn thêm biến thể chứ?',
      acceptIcon: 'pi pi-check mr-2',
      rejectIcon: 'pi pi-times mr-2',
      rejectButtonStyleClass: 'p-button-sm',
      acceptButtonStyleClass: 'p-button-outlined p-button-sm',
      accept: () => {
        this.saveListCt(this.listChiTietSP);
        this.messageService.add({severity: 'success', summary: 'Đã xác nhận', detail: 'Xác nhận', life: 3000});
      },
      reject: () => {
        this.messageService.add({severity: 'error', summary: 'Đã huỷ', detail: 'Đã huỷ xác nhận', life: 3000});
      }
    });
  }

  loadHinhAnh() {
    this.hinhAnhService.getAllHinhAnh().subscribe(
      (response: ApiResponse<any>) => {
        this.listHinhAnh = response.result;
        console.log('list ha' + this.listHinhAnh)
      })
  }

}






