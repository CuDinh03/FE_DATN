import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiResponse} from "../model/ApiResponse";
import {Voucher} from "../model/voucher";

@Injectable({
    providedIn: 'root'
})
export class VoucherService{

    apiUrl : string ='http://localhost:9091/api/voucher';

    constructor(private http:HttpClient) {
    }

    getVouchers(page: number, size: number): Observable<ApiResponse<any>>{
        const token:string| null = localStorage.getItem('token');

        const headers= new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        let params = new HttpParams();
        params = params.append('page', page.toString());
        params = params.append('size', size.toString());
        return  this.http.get<ApiResponse<any>>(`${this.apiUrl}/all`,{params,headers})
    }

    getVoucherByid(id:string): Observable<ApiResponse<any>>{
        const token:string| null = localStorage.getItem('token');

        const  headers= new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${id}`,{headers})
    }

    getListVoucher() :Observable<ApiResponse<any>>{
        const token:string| null = localStorage.getItem('token');
        const headers= new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/allVouchers`,{headers})

    }

  createVoucher(voucher: Voucher): Observable<ApiResponse<Voucher>> {
    const token = localStorage.getItem('token');

    // Thêm token vào header của yêu cầu
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<ApiResponse<Voucher>>(`${this.apiUrl}` +'/create', voucher, { headers });
  }



  deleteVoucher(id: string): Observable<ApiResponse<void>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`, {headers});
  }

  openVoucher(id: string): Observable<ApiResponse<void>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/open/${id}`, {headers});
  }


  findById(id: string): Observable<ApiResponse<Voucher>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ApiResponse<Voucher>>(`${this.apiUrl}/${id}`, {headers});
  }

  updateVoucher(id: string, voucherData: Voucher): Observable<ApiResponse<void>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}`, voucherData, { headers });
  }



}
