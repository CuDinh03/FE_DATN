import {Component, OnInit} from '@angular/core';
import {TaiKhoanService} from "../../service/TaiKhoanService";
import {KhachHangDto} from "../../model/khachHangDto";
import {KhachHangService} from 'src/app/service/KhachHangService';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgxSpinnerService} from "ngx-spinner";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  taiKhoanInfo: KhachHangDto | undefined;
  idTaiKhoan: any;
  myInfo!: KhachHangDto;
  thongTinKhachHang: any;
  khachHang!: KhachHangDto;
  formKhachHang!: FormGroup;
  isEdit: boolean = false;
  isEditEmail: boolean = false;
  isEditSDT: boolean = false;
  showUpdateEmailModal: boolean = false;
  showUpdateSDTModal: boolean = false;
  private tasksCompleted = 0;


  constructor(
    private taiKhoanService: TaiKhoanService,
    private khachHangService: KhachHangService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit(): void {
    this.spinner.show();
    this.initFormKhachHang();
    this.getMyInfo();
  }

  getMyInfo(): void {
    this.taiKhoanService.getMyInfo().subscribe(
      response => {
        this.myInfo = response.result;
        if (this.myInfo && this.myInfo.id) {
          this.khachHang = this.myInfo;
          // @ts-ignore
          this.khachHang.ngaySinh = this.formatDate(this.khachHang.ngaySinh);

          this.fillValueToForm(this.khachHang);
        }
        this.taskCompleted();
      },
      error => {
        console.error('Lỗi khi lấy thông tin tài khoản:', error);
        this.taskCompleted();
      }
    );
  }
  initFormKhachHang(): void {
    this.formKhachHang = this.formBuilder.group({
      ten: ['', Validators.required],
      email: ['', Validators.required],
      sdt: ['', Validators.required],
      gioiTinh: ['', Validators.required],
      ngaySinh: ['', Validators.required],
      diaChi: ['', Validators.required],
      taiKhoan: ['', Validators.required],
    });
    this.taskCompleted();
  }

  private taskCompleted(): void {
    this.tasksCompleted++;
    if (this.tasksCompleted >= 2) {
      this.spinner.hide();
    }
  }


  // Lấy Thông tin khách hàng từ id tài khoản đang đăng nhập

  // getKHByIdTaiKhoan(idTaiKhoan: string): void {
  //   this.khachHangService.getKhachHangByIdTaiKhoan(idTaiKhoan)
  //     .subscribe(response => {
  //       this.taiKhoanInfo = response.result?.taiKhoan;
  //       this.khachHang = response.result;
  //       if (this.khachHang) {
  //         this.khachHang.ngaySinh = this.formatDate(this.khachHang.ngaySinh);
  //       }
  //     }, error => {
  //       console.error('Lỗi khi lấy thông tin khách hàng:', error);
  //     });
  // }


  statusTransition() {
    this.isEdit = !this.isEdit;
    // Bat nut edit => fill value form

    if (this.isEdit) {
      this.fillValueToForm(this.khachHang);
    }
  }


//   initFormKhachHang(): void {
//     this.formKhachHang = this.formBuilder.group({
//       ten: ['', Validators.required],
//       email: ['', Validators.required],
//       sdt: ['', Validators.required],
//       gioiTinh: ['', Validators.required],
//       diaChi: ['', Validators.required]
//     });
//   }


  // 3. fill value form
  fillValueToForm(khachHang: any): void {
    this.formKhachHang.patchValue({
      ten: khachHang.ten,
      // email: this.obfuscateEmail(this.khachHang.email),
      // sdt: this.obfuscatePhone(this.khachHang.sdt),
      email: khachHang.email,
      sdt: khachHang.sdt,
      gioiTinh: khachHang.gioiTinh,
      ngaySinh: khachHang.ngaySinh,
      diaChi: khachHang.diaChi,
      taiKhoan: khachHang.taiKhoan
    });
  }


  update(): void {
    // nhập đúng validate
    if (this.formKhachHang.valid) {
      // lay ra value form
      // const: bien k the thay doi

      const formValue = this.formKhachHang.value;

      let dataKhachHang = {
        ten: formValue.ten,
        ngaySinh: formValue.ngaySinh,
        gioiTinh: formValue.gioiTinh,
        sdt: formValue.sdt,
        email: formValue.email,
        diaChi: formValue.diaChi,
        taiKhoan: formValue.taiKhoan,
        ngayTao: this.taiKhoanInfo?.ngayTao,
        ma: this.taiKhoanInfo?.ma
      }
      this.khachHangService.suaKhachHang(this.khachHang.id, dataKhachHang).subscribe(
        res => {

          this.khachHang = res.result;
          // @ts-ignore
          this.khachHang.ngaySinh = this.formatDate(this.khachHang.ngaySinh);
          this.isEdit = false;
          alert("Cập nhật thành công");
        }, error => {
          console.log(error);
          alert("Cập nhật thất bại");
        }
      )
    }
  }

  confirmUpdate() {
    if (window.confirm('Bạn có chắc chắn muốn cập nhật thông tin không?')) {
      this.update();
    }
  }

  get f() {
    return this.formKhachHang.controls;
  }

  changeEditEmail() {
    this.isEditEmail = true;
  }

  changeEditSDT() {
    this.isEditSDT = true;
  }


  formatDate(isoString: string): string {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}


// Lấy id tài khoản đang đăng nhập + Lấy ra thông tin khách hàng
// getKhachHangByIdTaiKhoan(): void {
//   const token = localStorage.getItem('token');
//   const headers = new HttpHeaders({
//     'Authorization': `Bearer ${token}`
//   });

//   this.taiKhoanService.getMyInfo() // => ID tài khoản, username, chucVu
//     .subscribe(response => {
//       // taiKhoanInfo : khachHangDto
//       // this.taiKhoanInfo = response.result;
//       // idTaiKhoanDangDangNhap
//       this.idTaiKhoan = response.result.id;
//       // Sau khi lấy thành công idTaiKhoan, lấy thông tin khách hàng
//       // this.getKHByIdTaiKhoan(this.idTaiKhoan);
//     }, error => {
//       console.error('Lỗi khi lấy id tài khoản:', error);
//     });
// }

