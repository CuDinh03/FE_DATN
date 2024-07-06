import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "../model/ApiResponse";
import {ChiTietSanPhamDto} from "../model/chi-tiet-san-pham-dto.model";
import {SaveCtspRequest} from "../model/SaveCtspRequest";
import {KichThuocDto} from "../model/kich-thuoc-dto.model";
import {SanPhamDto} from "../model/san-pham-dto.model";
import {DanhMucDto} from "../model/danh-muc-dto.model";
import {ChatLieuDto} from "../model/chat-lieu-dto.model";
import {ThuongHieuDto} from "../model/thuong-hieu-dto.model";
import {MauSacDto} from "../model/mau-sac-dto.model";
import {HinhAnhDto} from "../model/hinh-anh-dto.model";
import {IMG} from "../model/IMG";


@Injectable({
  providedIn: 'root'
})

export class SanPhamCTService {

  apiUrl = 'http://localhost:9091/api/chi-tiet-san-pham';

  constructor(private http: HttpClient) {}

  getSanPhamChiTietSapXepByNGayTao(page: number, size: number): Observable<ApiResponse<any>> {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('size', size.toString());

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/all/sap-xep-ngay-tao`, { params, headers });
  }

  // Get chitietSanPham by id
  getChiTietSanPhamById(id: string): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${id}`, { headers });
  }


  // Update trạng thái hoạt động => dừng HĐ
  updateTrangThaiById(id: string): Observable<ApiResponse<any>> {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const options = {
      headers: headers,
      responseType: 'text' as 'json'
    };

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/updateTrangThai/${id}`, options);
  }

  // Thêm sản phẩm chi tiết
  themSanPhamChiTiet(sanPhamChiTiet: ChiTietSanPhamDto): Observable<any> {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/add`, sanPhamChiTiet, { headers });
  }

  // Sửa sản phẩm chi tiết
  suaSanPhamChiTiet(sanPhamChiTiet: ChiTietSanPhamDto): Observable<any> {


    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${this.apiUrl}/update`, sanPhamChiTiet, { headers });
  }


  getSanPhamChiTiet(page: number, size: number): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');

    // Thêm token vào header của yêu cầu
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('size', size.toString());

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/all`, { params, headers });
  }


  getAllSanPhamChiTiet(): Observable<ApiResponse<any>> {

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getAll`,);
  }

  getAllMauSacByMa(ma: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/findAllMauSacByMaCTSP/${ma}`);
  }

  getAllKichThuocByMa(ma: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/findAllKichThuocByMaCTSP/${ma}`);
  }

  findChiTietSanPhamByMauSacAndKichThuoc(ma: string, kichThuocId: string, mauSacId: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/findChiTietSanPhamByMauSacAndKichThuoc/${ma}`, {
      params: {
        kichThuoc: kichThuocId,
        mauSac: mauSacId
      }
    });
  }

  findChiTietSanPhamByKichThuoc(ma: string, kichThuocId: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/findSanPhamByKichThuoc/${ma}`, {
      params: {
        kichThuoc: kichThuocId,
      }
    });
  }

  // TÌM KIẾM
  getSPCTBySanPhamId(id: string): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getBySanPhamId/${id}`, { headers });
  }

  getSPCTByChatLieuId(id: string): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getByChatLieuId/${id}`, { headers });
  }

  getSPCTByDanhMucId(id: string): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getByDanhMucId/${id}`, { headers });
  }

  getSPCTByKichThuocId(id: string): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getByKichThuocId/${id}`, { headers });
  }

  getSPCTByMauSacId(id: string): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getByMauSacId/${id}`, { headers });
  }

  getSPCTByThuongHieuId(id: string): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getByThuongHieuId/${id}`, { headers });
  }


    saveChiTietSanPham(saveCtspRequest: { kichThuocList: KichThuocDto[]; sanPham: SanPhamDto | undefined; danhMuc: DanhMucDto | undefined; chatLieu: ChatLieuDto | undefined; thuongHieu: ThuongHieuDto | undefined; mauSacList: MauSacDto[] }): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/saveAllSp`, saveCtspRequest, { headers });
  }

  getCtsp(): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/getCtsp`, { headers });
  }


  saveListCt(ctsp:IMG): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/saveListCt`, ctsp , { headers });
  }



}
