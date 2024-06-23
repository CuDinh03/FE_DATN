import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "../model/ApiResponse";
import {ChiTietSanPhamDto} from "../model/chi-tiet-san-pham-dto.model";


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
  themSanPhamChiTiet(sanPhamChiTiet: ChiTietSanPhamDto): Observable<any> {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/add`, sanPhamChiTiet, { headers });
  }

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

  suaSanPhamChiTiet(sanPhamChiTiet: ChiTietSanPhamDto, id : string): Observable<any> {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${this.apiUrl}/update/${id}`, sanPhamChiTiet, { headers });
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

  getChiTietSanPhamById(id: string): Observable<ApiResponse<any>> {

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${id}`);
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
}
