import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiUrl = 'http://localhost:9091/api/auth/log-in';


  constructor(private http: HttpClient) {
  }

  login(tenDangNhap: string, matKhau: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, {tenDangNhap, matKhau});
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    // Kiểm tra xem token có tồn tại trong localStorage không
    return !!localStorage.getItem('token');
  }

  getRole(): string | null {
    const token = localStorage.getItem('token');

    console.log(token)
    if (!token) {
      return null;
    }
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    return decodedToken.scope;
  }
  
  logout(): void {
    // Xoá token khi đăng xuất
    localStorage.removeItem('token');
  }
}
