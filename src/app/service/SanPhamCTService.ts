import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "../model/ApiResponse";
import {ChiTietSanPhamDto} from "../model/chi-tiet-san-pham-dto.model";
import {KichThuocDto} from "../model/kich-thuoc-dto.model";
import {SanPhamDto} from "../model/san-pham-dto.model";
import {DanhMucDto} from "../model/danh-muc-dto.model";
import {ChatLieuDto} from "../model/chat-lieu-dto.model";
import {ThuongHieuDto} from "../model/thuong-hieu-dto.model";
import {MauSacDto} from "../model/mau-sac-dto.model";
import {FilterSanPhamRequest} from "../model/FilterSanPhamRequest";
import {IMG} from "../model/IMG";



@Injectable({
  providedIn: 'root'
})

export class SanPhamCTService {

  apiUrl = 'http://localhost:9091/api/chi-tiet-san-pham';

  constructor(private http: HttpClient) {}

  search(keyword: string, page: number, size: number): Observable<any> {
    let params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.apiUrl}/search`, { params });
  }

  getSanPhamChiTietSapXepByNGayTao(page: number, size: number): Observable<ApiResponse<any>> {

    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('size', size.toString());

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/all/sap-xep-ngay-tao`, { params });
  }

  remove(id:string): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/delete/${id}`, { headers });
  }

  // Get chitietSanPham by id
  getChiTietSanPhamById(id: string): Observable<ApiResponse<any>> {

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }

  getChiTietSanPhamByIdKH(id: string): Observable<ApiResponse<any>> {

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${id}` );
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

  suaSanPhamChiTiet(sanPhamChiTiet: ChiTietSanPhamDto): Observable<any> {


    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${this.apiUrl}/update`, sanPhamChiTiet, { headers });
  }

  // Thêm sản phẩm chi tiết
  themSanPhamChiTiet(sanPhamChiTiet: ChiTietSanPhamDto): Observable<any> {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/add`, sanPhamChiTiet, { headers });
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


  saveChiTietSanPham(saveCtspRequest: {
    kichThuocList: KichThuocDto[];
    sanPham: SanPhamDto ;
    danhMuc: DanhMucDto ;
    chatLieu: ChatLieuDto ;
    thuongHieu: ThuongHieuDto;
    mauSacList: MauSacDto[]
  }): Observable<ApiResponse<any>> {
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


  // saveListCt(list: any[]): Observable<ApiResponse<any>> {
  //   const token = localStorage.getItem('token');
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${token}`,
  //     'Content-Type': 'application/json'
  //   });
  //
  //   return this.http.post<ApiResponse<any>>(`${this.apiUrl}/saveListCt`, list, { headers });
  // }

  filterSanPham(request: FilterSanPhamRequest, page: number, size: number): Observable<ApiResponse<any>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/filter`, request, { params });
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
