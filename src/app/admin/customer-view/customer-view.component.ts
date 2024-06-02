import { Component } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../service/AuthenticationService";
import {KhachHangService} from "../../service/KhachHangService";

@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.css']
})
export class CustomerViewComponent {

  customers: any[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 5;
  startFrom = 1;
  submitted = false;
  errorMessage: string = '';
  customerForm: FormGroup;

  constructor(private apiService: KhachHangService, private formBuilder: FormBuilder,
              private router: Router, private auth: AuthenticationService) {

    this.customerForm = this.formBuilder.group({
    });

  };
  ngOnInit(): void {
    this.loadVoucher();
  }

  get f(){
    return this.customerForm.controls;
  }

  loadVoucher():void{
    this.apiService.getKhs(this.currentPage, this.pageSize)
      .subscribe(response => {
        this.customers = response.result.content;
        this.totalElements = response.result.totalElements;
        this.totalPages = response.result.totalPages;
        console.log("view khs");
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadVoucher();
  }
  createVoucher(){

  }


}
