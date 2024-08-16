import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DanhMucDto } from 'src/app/model/danh-muc-dto.model';
import { DanhMucService } from 'src/app/service/DanhMucService';
import { TaiKhoanService } from 'src/app/service/TaiKhoanService';
import { AuthenticationService } from 'src/app/service/AuthenticationService';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorCode } from 'src/app/model/ErrorCode';
import { ChatLieuDto } from 'src/app/model/chat-lieu-dto.model';
import { ChatLieuService } from 'src/app/service/ChatLieuService';

@Component({
  selector: 'app-chatlieu-view',
  templateUrl: './chatlieu-view.component.html',
  styleUrls: ['./chatLieu-view.component.css']
})
export class ChatLieuViewComponent implements OnInit{

  chatLieu: any[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  showSuccessAlert = false;
  pageSize = 5;
  startFrom = 1;
  submitted = false;
  errorMessage: string = '';
  chatLieuForm: FormGroup; 
  id: string;
  successMessage = '';
  selectedChatLieu: ChatLieuDto | null = null;
  isEditMode = false;


  constructor(private apiService: ChatLieuService, private formBuilder: FormBuilder,

    private router: Router,private auth: AuthenticationService, 
    private route: ActivatedRoute) {
      this.chatLieuForm = this.formBuilder.group({
        ten: ['', [Validators.required]],
        ma: [''],
        id: [''],
        trangThai: ['',Validators.required]
      });
  
      this.id = this.route.snapshot.params['id'];
     }

     ngOnInit(): void {
      this.loadChatLieu();
      if (this.id) {
        this.findById(this.id);
      }
    }
  
    get f() {
      return this.chatLieuForm.controls;
    }
  
    onSubmit(): void {
      this.submitted = true;
      if (this.chatLieuForm.invalid) {
        return;
      }
      if (this.isEditMode) {
        this.updateChatLieu();
      } else {
        this.createChatLieu();
      }
    }
  
    loadChatLieu(): void {
      this.apiService.getChatLieu(this.currentPage, this.pageSize)
        .subscribe(response => {
          this.chatLieu = response.result.content;
          this.totalElements = response.result.totalElements;
          this.totalPages = response.result.totalPages;
        });
    }
  
    onPageChange(page: number): void {
      this.currentPage = page;
      this.loadChatLieu();
    }
  
    createChatLieu(): void {
      this.submitted = true;
      if (this.chatLieuForm.invalid) {
        return;
      }
      const chatLieuData: ChatLieuDto = this.chatLieuForm.value;
      this.apiService.createChatLieu(chatLieuData)
        .subscribe(
          (data: ApiResponse<ChatLieuDto>) => {
            this.showSuccessAlert = true;
            this.successMessage = 'Thêm thành công'
            this.loadChatLieu();
            setTimeout(() => this.showSuccessAlert = false, 3000); // Tự động ẩn sau 3 giây
            this.chatLieuForm.reset();
            this.isEditMode = false;
            console.log(data);
            
          },
          (error: HttpErrorResponse) => {
            this.handleError(error);
          }
        );
    }
  
    updateChatLieu(): void {
      this.submitted = true;
      if (this.chatLieuForm.invalid) {
        return;
      }
      const chatLieuData: ChatLieuDto = this.chatLieuForm.value;
      this.apiService.updateChatLieu(chatLieuData.id, chatLieuData).subscribe(
        () => {
          this.showSuccessAlert = true;
          this.successMessage = 'Sửa thành công'
          this.loadChatLieu();
          setTimeout(() => this.showSuccessAlert = false, 3000); // Tự động ẩn sau 3 giây
          this.chatLieuForm.reset();
          this.isEditMode = false; // Đặt lại chế độ
        },
        (error: HttpErrorResponse) => {
          this.handleError(error);
        }
      );
    }
  
    
  
    findById(id: string): void {
      this.apiService.findById(id)
        .subscribe(
          (response: ApiResponse<ChatLieuDto>) => {
            this.chatLieuForm.patchValue({
              id: response.result.id,
              ma: response.result.ma,
              ten: response.result.ten,
              trangThai: response.result.trangThai.toString() // Chuyển đổi boolean thành string
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
      if (error.error.code === ErrorCode.PASSWORD_INVALID) {
        this.errorMessage = 'Mã chất liệu không được để trống';
      } else {
        this.errorMessage = 'Đã xảy ra lỗi, vui lòng thử lại sau.';
      }
    }
  
    logout(): void {
      this.auth.logout();
      this.router.navigate(['/log-in']).then(() => {
        console.log('Redirected to /log-in');
      }).catch(err => {
        console.error('Error navigating to /log-in:', err);
      });
    }
  
    delete(id: any): void {
      this.apiService.deleteChatLieu(id).subscribe(() => {
        this.loadChatLieu();
        this.router.navigate(['/admin/chat-lieu']);
      });
    }
  
    openChatLieu(id: any): void {
      this.apiService.openChatLieu(id).subscribe(() => {
        this.loadChatLieu();
        this.router.navigate(['/admin/chat-lieu']);
      });
    }
  
    closeSuccessAlert(): void {
      this.showSuccessAlert = false;
    }
}
