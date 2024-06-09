import { MatSnackBar } from '@angular/material/snack-bar';
import { KhachHangService } from './../../service/KhachHangService';
import { GioHangService } from './../../service/GioHangService';
import { GioHangChiTietService } from './../../service/GioHangChiTietService';
import { ApiResponse } from './../../model/ApiResponse';
import { SanPhamCTService } from './../../service/SanPhamCTService';
import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthenticationService} from "../../service/AuthenticationService";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {
  findCiTietSanPham: any = {};
  currentLargeImage: string = ''
  quantity: number = 1;
  khachHang: any;
  gioHang: any
  gioHangChiTiet: any[] = [];

  constructor( private auth: AuthenticationService,
    private router:Router,
    private sanPhamCTService: SanPhamCTService,
    private gioHangChiTietService: GioHangChiTietService,
    private gioHangService: GioHangService,
    private khachHangService: KhachHangService,
    private snackBar: MatSnackBar
    ) {
 }

 ngOnInit(): void {
  this.loadSanPhamChiTiet();
  this.reloadPage();
}

  loadSanPhamChiTiet(): void{
    const storeChiTietSanPham = localStorage.getItem('sanPhamChiTiet');
    if(storeChiTietSanPham){
      const chiTietSanPham = JSON.parse(storeChiTietSanPham)
      this.sanPhamCTService.getChiTietSanPhamById(chiTietSanPham.id)
      .subscribe((response: ApiResponse<any>) =>{
        if(response.result){
          this.findCiTietSanPham = response.result;
          if (this.findCiTietSanPham.hinhAnh && this.findCiTietSanPham.hinhAnh.length > 0) {
            this.currentLargeImage = this.findCiTietSanPham.hinhAnh[0].url;  // Auto-select the first image
          }
        }
      })
    }
  }

  addToCart(): void {
    // Lấy giỏ hàng và chi tiết sản phẩm từ localStorage
    const storeGioHang = localStorage.getItem('gioHang');
    const storeChiTietSanPham = localStorage.getItem('sanPhamChiTiet');
    
    if (storeGioHang && storeChiTietSanPham) {
      const gioHang = JSON.parse(storeGioHang);
      const chiTietSanPham = JSON.parse(storeChiTietSanPham);
      
      if (this.quantity <= 0) {
        this.snackBar.open('Số lượng nhập vào phải lớn hơn 0. Vui lòng nhập lại!', 'Đóng', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        return;
      }
  
      if (this.quantity > chiTietSanPham.soLuong) {
        this.snackBar.open('Số lượng nhập vào vượt quá số lượng còn trong kho. Vui lòng nhập lại!', 'Đóng', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        return;
      }
  
      // Gọi phương thức addProductToCart với id giỏ hàng, id sản phẩm và số lượng
      this.addProductToCart(gioHang.id, chiTietSanPham.id, this.quantity);
    } else {
      console.error('Không tìm thấy giỏ hàng hoặc chi tiết sản phẩm trong localStorage.');
    }
  }

  addProductToCart(idGioHang: string, idSanPhamChiTiet: string, soLuong: number): void {
    this.gioHangChiTietService.addProductToCart(idGioHang, idSanPhamChiTiet, soLuong).subscribe(
      response => {
        this.snackBar.open('Thêm sản phẩm vào giỏ hàng thành công', 'Đóng', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        // Xử lý kết quả ở đây nếu cần
      },
      error => {
        console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
        // Xử lý lỗi ở đây nếu cần
      }
    );
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  updateLargeImage(imageUrl: string): void {
    this.currentLargeImage = imageUrl;
  }

  reloadPage() {
    this.router.navigate([this.router.url]);
  }

//   account: any;
//
//   private token = this.auth.getToken();
//
//
//   constructor(private http: HttpClient, private auth: AuthenticationService, private router:Router, private route: ActivatedRoute) {
//     this.ngOnInit();
//
//   }
//
//   ngOnInit(): void {
//     const id: string | null = this.route.snapshot.paramMap.get('id');
//     if (id !== null) {
//       this.getAccount(id);
//     } else {
//       console.error('ID is null.');
//     }
//     console.log(this.auth.getRole());
//   }
//
//   getAccount(id:string)
// {
//   if (!this.token) {
//     console.error('Token not found or invalid');
//     return;
//   }
//   const headers = {'Authorization': `Bearer ${this.token}`};
//
//   this.http.get<any>(`http://localhost:9091/api/users/${id}`, {headers}).subscribe(
//     response => {
//       this.account = response.result;
//
//       this.router.navigate(['/detail', this.account.id]).then(() => {
//         console.log('Redirected to /detail');
//       }).catch(err => {
//         console.error('Error navigating to /detail:', err);
//       });
//     },
//     error => {
//       console.error('Error getting account:', error);
//     }
//   );
// }
}
