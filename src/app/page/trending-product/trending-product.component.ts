import { Component } from '@angular/core';
import {AuthenticationService} from "../../service/AuthenticationService";
import {Router} from "@angular/router";

@Component({
  selector: 'app-trending-product',
  templateUrl: './trending-product.component.html',
  styleUrls: ['./trending-product.component.css']
})
export class TrendingProductComponent {

  constructor( private auth: AuthenticationService, private router:Router) {
  }




}
