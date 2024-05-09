import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthenticationService} from "../../service/AuthenticationService";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {

  account: any;

  private token = this.auth.getToken();


  constructor(private http: HttpClient, private auth: AuthenticationService, private router:Router, private route: ActivatedRoute) {
    this.ngOnInit();

  }

  ngOnInit(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.getAccount(id);
    } else {
      console.error('ID is null.');
    }
    console.log(this.auth.getRole());
  }

  getAccount(id:string)
{
  if (!this.token) {
    console.error('Token not found or invalid');
    return;
  }
  const headers = {'Authorization': `Bearer ${this.token}`};

  this.http.get<any>(`http://localhost:9091/api/users/${id}`, {headers}).subscribe(
    response => {
      this.account = response.result;

      this.router.navigate(['/detail', this.account.id]).then(() => {
        console.log('Redirected to /detail');
      }).catch(err => {
        console.error('Error navigating to /detail:', err);
      });
    },
    error => {
      console.error('Error getting account:', error);
    }
  );
}
}
