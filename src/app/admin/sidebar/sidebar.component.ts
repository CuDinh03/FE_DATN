import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

const PRODUCT_ROUTES = [
  '/admin/san-pham-chi-tiet',
  '/admin/san-pham',
  '/admin/danh-muc',
  '/admin/mau-sac',
  '/admin/chat-lieu',
  '/admin/hinh-anh',
  '/admin/kich-thuoc',
  '/admin/thuong-hieu'
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  isProductMenuOpen = false;
  private sub?: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateProductMenuFromRoute(this.router.url);
    this.sub = this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe(e => this.updateProductMenuFromRoute(e.urlAfterRedirects));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  toggleProductMenu(): void {
    this.isProductMenuOpen = !this.isProductMenuOpen;
  }

  private updateProductMenuFromRoute(url: string): void {
    const isProductRoute = PRODUCT_ROUTES.some(r => url.startsWith(r));
    this.isProductMenuOpen = isProductRoute;
  }
}
