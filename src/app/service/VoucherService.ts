import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiResponse} from "../model/ApiResponse";

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



}
