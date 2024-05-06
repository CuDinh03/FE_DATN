import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-authentication-login',
  templateUrl: './authentication-login.component.html',
  styleUrls: ['./authentication-login.component.css']
})
export class AuthenticationLoginComponent {
  username: string | undefined;
  password: string | undefined;
  constructor(private http: HttpClient) {}

  onSubmit(username: HTMLInputElement, password: HTMLInputElement) {
    const formData = { tenDangNhap: username, matKhau: password };
    this.http.post<any>('http://localhost:9091/api/auth/log-in', formData)
      .subscribe(response => {
        console.log(response);
        localStorage.setItem('token', response.result.token);
      }, error => {
        console.error(error);
      });
  }
}
