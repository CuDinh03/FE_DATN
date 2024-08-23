import { Component } from '@angular/core';
import {Observable} from "rxjs";
import {ApiResponse} from "../model/ApiResponse";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent {
  apiURL: string = 'http://localhost:8080/api/book';
  list: [] = []

constructor(private http: HttpClient) {
}
  getList() :Observable<any>{
    return this.http.get(`${this.apiURL}`)
  }

  ngOnInit(): void {
    this.loadList();
  }

  loadList(){
    this.getList().subscribe(response => {
      this.list = response
    })
  }

}
