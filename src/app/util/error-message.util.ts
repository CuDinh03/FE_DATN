import { HttpErrorResponse } from '@angular/common/http';

/**
 * Lấy message lỗi từ API (ApiResponse) hoặc fallback.
 * Backend trả { code, message, result } trong body khi lỗi.
 */
export function getApiErrorMessage(error: unknown, fallback: string = 'Đã xảy ra lỗi. Vui lòng thử lại.'): string {
  if (error instanceof HttpErrorResponse && error.error && typeof error.error === 'object') {
    const msg = (error.error as { message?: string }).message;
    if (typeof msg === 'string' && msg.trim()) {
      return msg;
    }
  }
  return fallback;
}
