import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { ChatLieuDto } from 'src/app/model/chat-lieu-dto.model';
import { KichThuocDto } from 'src/app/model/kich-thuoc-dto.model';
import { AuthenticationService } from 'src/app/service/AuthenticationService';
import { ChatLieuService } from 'src/app/service/ChatLieuService';
import { KichThuocService } from 'src/app/service/KichThuocService';
import { SanPhamCTService } from 'src/app/service/SanPhamCTService';

@Component({
  selector: 'app-shop-category',
  templateUrl: './shop-category.component.html',
  styleUrls: ['./shop-category.component.css']
})
export class ShopCategoryComponent {
  kichThuocList: KichThuocDto[] = [];
  chatLieuList: ChatLieuDto[] = [];
  chiTietSanPham: any[] = [];
  findSanPhamChiTiet: any = {};

  constructor(private auth: AuthenticationService,
    private router: Router,
    private kichThuocService: KichThuocService,
    private chatLieuService: ChatLieuService,
    private sanPhamCTService: SanPhamCTService,

) {
}


ngOnInit(): void {
  this.loadDanhSachSanPham();
}
  
  loadKichThuoc(): void {
    this.kichThuocService.getAllKichThuoc().subscribe(
      (response: ApiResponse<KichThuocDto[]>) => {
        if (response.result) {
          this.kichThuocList = response.result;
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Error loading kich thuoc:', error);
      }
    );
  }

  loadChatLieu(): void {
    this.chatLieuService.getAllChatLieu().subscribe(
      (response: ApiResponse<ChatLieuDto[]>) => {
        if (response.result) {
          this.chatLieuList = response.result;
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Error loading chat lieu:', error);
      }
    );
  }

  findSanPhamById(id: string): void {
    this.sanPhamCTService.getChiTietSanPhamById(id).
    subscribe(
        (response: ApiResponse<any>) => {
          if (response.result) {
            this.findSanPhamChiTiet = response.result
            localStorage.setItem('sanPhamChiTiet', JSON.stringify(response.result))
            this.router.navigate(['/san-pham']);
          }
        })
  }

  loadDanhSachSanPham(): void {
    this.sanPhamCTService.getAllSanPhamChiTiet().subscribe(
        (response: ApiResponse<any>) => {
          if (response.result && response.result.length > 0) {
            // Nếu có hóa đơn chi tiết, gán danh sách vào biến và đặt noProductsFound là false
            this.chiTietSanPham = response.result;

          } else {
            console.log(response);
          }
        },
        (error: HttpErrorResponse) => {
        }
    );
  }
}
