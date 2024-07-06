import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {DanhMucDto} from "../../model/danh-muc-dto.model";
import {DanhMucService} from "../../service/DanhMucService";
import {AuthenticationService} from "../../service/AuthenticationService";
import {ApiResponse} from "../../model/ApiResponse";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-category',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.css']
})
export class CategoryViewComponent implements OnInit {
  danhMucDialog: boolean = false;

  danhMuc: DanhMucDto|undefined;
  category!: DanhMucDto;
  danhMucs: DanhMucDto[]=[];
  first = 0;
  rows = 10;
  loading = true;
  submitted = false;
  danhMucForm: FormGroup;
  id: string;
  successMessage = '';
  selectedDanhMuc: DanhMucDto | null = null;
  isEditMode = false;
  currentPage = 0;
  totalElements = 0;
  totalPages = 0;
   pageSize =0;
  categoryDialog: boolean = false;


  constructor(
    private apiService: DanhMucService,
    private formBuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private auth: AuthenticationService,
    private route: ActivatedRoute
  ) {
    this.danhMucForm = this.formBuilder.group({
      ten: ['', [Validators.required]],
      ma: [''],
      id: [''],
      trangThai: ['', [Validators.required]]
    });

    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.loadDanhMuc();
    if (this.id) {
      this.findById(this.id);
    }
  }

  get f() {
    return this.danhMucForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.danhMucForm.invalid) {
      return;
    }
    if (this.isEditMode) {
      this.updateDanhMuc();
    } else {
      this.createDanhMuc();
    }
  }

  loadDanhMuc(): void {
    this.loading = true;
    this.apiService.getAllDanhMuc()
      .subscribe(response => {
        this.danhMucs = response.result;
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadDanhMuc();
  }

  createDanhMuc(): void {
    this.submitted = true;
    if (this.danhMucForm.invalid) {
      return;
    }
    const danhMucData: DanhMucDto = this.danhMucForm.value;
    this.apiService.createDanhMuc(danhMucData)
      .subscribe(
        (data: ApiResponse<DanhMucDto>) => {
          this.successMessage = 'Thêm thành công';
          this.loadDanhMuc();
          setTimeout(() => this.successMessage = '', 3000);
          this.danhMucForm.reset();
          this.isEditMode = false;
        },
        (error: HttpErrorResponse) => {
          this.handleError(error);
        }
      );
  }

  updateDanhMuc(): void {
    this.submitted = true;
    if (this.danhMucForm.invalid) {
      return;
    }
    const danhMucData: DanhMucDto = this.danhMucForm.value;
    this.apiService.updateDanhMuc(danhMucData).subscribe(
      () => {
        this.successMessage = 'Sửa thành công';
        this.loadDanhMuc();
        setTimeout(() => this.successMessage = '', 3000);
        this.danhMucForm.reset();
        this.isEditMode = false;
      },
      (error: HttpErrorResponse) => {
        this.handleError(error);
      }
    );
  }

  findById(id: string): void {
    this.apiService.findById(id)
      .subscribe(
        (response: ApiResponse<DanhMucDto>) => {
          this.danhMucForm.patchValue({
            id: response.result.id,
            ma: response.result.ma,
            ten: response.result.ten,
            trangThai: response.result.trangThai.toString()
          });
          this.isEditMode = true;
        },
        (error: HttpErrorResponse) => {
          this.handleError(error);
        }
      );
  }

  handleError(error: HttpErrorResponse): void {
    console.error(error);
    // Xử lý lỗi ở đây
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.loadDanhMuc();
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadDanhMuc();
  }

  isLastPage(): boolean {
    return this.danhMucs ? this.first === this.danhMucs.length - this.rows : true;
  }

  isFirstPage(): boolean {
    return this.danhMucs ? this.first === 0 : true;
  }

  // @ts-ignore
  getSeverity(trangThai: number) {
    switch (trangThai) {
      case 0:
        return 'danger';
      case 1:
        return 'success';
    }
  }


  openNew() {
    // this.danhMuc = {};
    this.submitted = false;
    this.categoryDialog = true;
  }

  editCategory(danhMuc: DanhMucDto) {
    this.danhMuc = { ...danhMuc };
    this.categoryDialog = true;
  }

  hideDialog() {
    this.categoryDialog = false;
    this.submitted = false;
  }

  saveCategory() {
    // this.submitted = true;
    //
    // if (this.danhMuc.ten?.trim()) {
    //   if (this.danhMuc.id) {
    //     // Update danh mục
    //     this.apiService.updateDanhMuc(this.danhMuc.id, this.danhMuc).subscribe(
    //       () => {
    //         this.loadDanhMuc();
    //         this.messageService.add({
    //           severity: 'success',
    //           summary: 'Thành công',
    //           detail: 'Cập nhật danh mục thành công',
    //           life: 3000
    //         });
    //       },
    //       (error: HttpErrorResponse) => {
    //         this.handleError(error);
    //       }
    //     );
    //   } else {
    //     // Tạo mới danh mục
    //     this.apiService.createDanhMuc(this.danhMuc).subscribe(
    //       () => {
    //         this.loadDanhMuc();
    //         this.messageService.add({
    //           severity: 'success',
    //           summary: 'Thành công',
    //           detail: 'Tạo danh mục thành công',
    //           life: 3000
    //         });
    //       },
    //       (error: HttpErrorResponse) => {
    //         this.handleError(error);
    //       }
    //     );
    //   }
    //
    //   this.categoryDialog = false;
    //   this.danhMuc = {};
    // }
  }




    updateStatus(danhMuc: DanhMucDto): void {
        // // Cập nhật ngay lập tức giá trị trangThai trên frontend
        // danhMuc.trangThai = Number(!danhMuc.trangThai);

        // Tạo một bản sao của danhMuc với giá trị trangThai được chuyển đổi thành Integer
        const updatedDanhMuc = {
            ...danhMuc,
            trangThai: danhMuc.trangThai ? 1 : 0
        };

        this.apiService.updateDanhMuc(updatedDanhMuc).subscribe(
            () => {
                this.messageService.add({severity: 'success', summary: 'Thành công', detail: 'Cập nhật trạng thái thành công!', life: 3000});
                // Không cần load lại danh sách vì đã cập nhật trạng thái ngay lập tức
            },
            (error) => {
                this.messageService.add({severity: 'error', summary: 'Lỗi', detail: 'Cập nhật trạng thái thất bại!', life: 3000});
                // Phục hồi trạng thái nếu cập nhật thất bại
                danhMuc.trangThai = Number(!danhMuc.trangThai);
            }
        );
    }
}
