import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {TaiKhoanService} from "../../service/TaiKhoanService";
import { HttpClient } from "@angular/common/http";
import {AuthenticationService} from "../../service/AuthenticationService";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, of} from "rxjs";
import {ApiResponse} from "../../model/ApiResponse";
import {HoaDonService} from "../../service/HoaDonService";
import {HoaDonChiTietService} from "../../service/HoaDonChiTietService";
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css']
})
export class AdminViewComponent  {

}
