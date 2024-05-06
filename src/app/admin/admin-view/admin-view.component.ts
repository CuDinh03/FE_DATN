import { Component } from '@angular/core';
import {TaiKhoanDto} from "../../model/tai-khoan-dto.model";
import {TaiKhoanService} from "../../service/TaiKhoanService";

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css']
})
export class AdminViewComponent {
  accounts: TaiKhoanDto[] = [];

  constructor(private userService: TaiKhoanService) { }

  ngOnInit(): void {
    this.getAccounts();
  }

  getAccounts() {
    this.userService.getAllAccounts().subscribe(
      (response: any) => {
        this.accounts = response.result;
      },
      error => {
        console.error('Error fetching accounts:', error);
      }
    );
  }

}
