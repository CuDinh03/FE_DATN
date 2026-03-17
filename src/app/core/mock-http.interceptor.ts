import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';
import { getMockResponseByUrl } from '../../testing/mock-api.data';

/**
 * Interceptor trả về dữ liệu giả lập khi environment.useMockData === true.
 * Dùng để test FE (giỏ hàng, thanh toán, lịch sử đơn, chi tiết đơn) khi chưa chạy backend.
 */
export const mockHttpInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  if (!environment.useMockData || !req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }
  const mock = getMockResponseByUrl(req.url, req.method);
  if (mock) {
    return of(new HttpResponse({ status: 200, body: mock }));
  }
  return next(req);
};
