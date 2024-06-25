import { Injectable } from '@angular/core';
import { Product } from '../model/product.model';



@Injectable({
  providedIn: 'root'
})
export class CartService {

  items: Product[] = [];

  apiUrl = 'http://localhost:9091/gio-hang-chi-tiet';

  constructor() { }

  addToCart(product: Product) {
    this.items.push(product);
  }

  getItems(): Product[] {
    return this.items;
  }

  clearCart():Product[] {
    this.items = [];
    return this.items;
  }

  removeFromCart(productId: number) {
    this.items = this.items.filter(item => item.id !== productId);
  }

}