/**
 * Dữ liệu giả lập cho test luồng: Giỏ hàng, Thanh toán, Lịch sử đơn, Chi tiết đơn.
 * Dùng cho unit test hoặc MockHttpInterceptor khi chạy FE không cần backend.
 */
import { ApiResponse } from '../app/model/ApiResponse';
import { environment } from '../environments/environment';

/** Khách hàng mẫu (findUsername) */
export const MOCK_KHACH_HANG = {
  id: 'kh-mock-001',
  ten: 'Nguyễn Văn Test',
  email: 'test@example.com',
  sdt: '0901234567',
  diaChi: '123 Đường Test, Q.1, TP.HCM',
  gioiTinh: 1,
  ngaySinh: '1990-01-15',
  trangThai: 1,
  taiKhoan: { id: 'tk-001', tenDangNhap: 'customer1' }
};

/** Giỏ hàng mẫu (findByKhachHang) */
export const MOCK_GIO_HANG = {
  id: 'gh-mock-001',
  khachHang: MOCK_KHACH_HANG,
  ngayTao: '2025-03-01T10:00:00',
  trangThai: 1
};

/** Một chi tiết giỏ hàng / chi tiết đơn */
function mockCt(id: string, tenSp: string, ma: string, gia: number, sl: number, url?: string) {
  return {
    id,
    chiTietSanPham: {
      id: `ctsp-${id}`,
      sanPham: { id: 'sp-1', ten: tenSp, ma },
      mauSac: { id: 'ms-1', ten: 'Đen' },
      kichThuoc: { id: 'kt-1', ten: 'M' },
      soLuong: 100,
      giaBan: gia
    },
    soLuong: sl,
    donGia: gia,
    hinhAnh: url ? [{ id: 'ha-1', url }] : []
  };
}

/** Chi tiết giỏ hàng (getAllByKhachHang với id = id gio hang) */
export const MOCK_GIO_HANG_CHI_TIET: any[] = [
  mockCt('ghct-001', 'Áo thun nam basic', 'ATN001', 199000, 2, 'https://picsum.photos/200/200?1'),
  mockCt('ghct-002', 'Quần jean slim', 'QJ002', 349000, 1, 'https://picsum.photos/200/200?2')
];

/** Hóa đơn mẫu (getHoaDonById / findHoaDonByIdKhachHang) */
export const MOCK_HOA_DON = {
  id: 'hd-mock-001',
  ma: 'HD250316001',
  khachHang: MOCK_KHACH_HANG,
  ngayTao: '2025-03-16T08:00:00',
  trangThai: 1,
  tongTien: 747000,
  ghiChu: '',
  diaChiGiaoHang: '123 Đường Test, Q.1, TP.HCM',
  sdtNhanHang: '0901234567',
  phuongThucThanhToan: { id: 'pttt-1', ten: 'Chuyển khoản' }
};

/** Chi tiết hóa đơn (getAllByKhachHang với id = id hoa don) */
export const MOCK_HOA_DON_CHI_TIET: any[] = [
  mockCt('hdct-001', 'Áo thun nam basic', 'ATN001', 199000, 2, 'https://picsum.photos/200/200?1'),
  mockCt('hdct-002', 'Quần jean slim', 'QJ002', 349000, 1, 'https://picsum.photos/200/200?2')
];

/** Danh sách hóa đơn theo khách hàng (findHoaDonByIdKhachHang) */
export const MOCK_LIST_HOA_DON = [
  { ...MOCK_HOA_DON, id: 'hd-mock-001', ma: 'HD250316001', trangThai: 4 },
  { ...MOCK_HOA_DON, id: 'hd-mock-002', ma: 'HD250316002', trangThai: 1 },
  { ...MOCK_HOA_DON, id: 'hd-mock-003', ma: 'HD250315001', trangThai: 3 }
];

/** Hóa đơn theo trạng thái (getHoaDonsByTrangThaiAndKhachHang) */
export const MOCK_HOA_DON_BY_TRANG_THAI: Record<number, any[]> = {
  0: [],
  1: [MOCK_LIST_HOA_DON[1]],
  2: [],
  3: [MOCK_LIST_HOA_DON[2]],
  4: [MOCK_LIST_HOA_DON[0]],
  5: []
};

/** Hóa đơn theo mã + khách (getHoaDonByMaKH) */
export const MOCK_HOA_DON_BY_MA: Record<string, any> = {
  'HD250316001': { ...MOCK_HOA_DON, id: 'hd-mock-001', ma: 'HD250316001' },
  'HD250316002': { ...MOCK_HOA_DON, id: 'hd-mock-002', ma: 'HD250316002' }
};

/** Trả về ApiResponse chuẩn */
export function mockApiResponse<T>(result: T, message = 'OK'): ApiResponse<T> {
  return { code: 200, message, result };
}

/** Map URL -> mock response (dùng trong interceptor) */
export function getMockResponseByUrl(url: string, method: string): ApiResponse<any> | null {
  if (method !== 'GET') return null;
  const base = environment.apiUrl;
  if (url.includes(`${base}/khs/findUsername/`)) return mockApiResponse(MOCK_KHACH_HANG);
  if (url.includes(`${base}/gio-hang/findByKhachHang/`)) return mockApiResponse(MOCK_GIO_HANG);
  if (url.includes(`${base}/gio-hang-chi-tiet/allKh/`)) return mockApiResponse(MOCK_GIO_HANG_CHI_TIET);
  if (url.includes(`${base}/hoa-don/byTrangThaiAndKhachHang`)) {
    const m = url.match(/trangThai=(\d+)/);
    const trangThai = m ? parseInt(m[1], 10) : 0;
    return mockApiResponse(MOCK_HOA_DON_BY_TRANG_THAI[trangThai] ?? []);
  }
  if (url.includes(`${base}/hoa-don/findByKhachHang/`)) return mockApiResponse(MOCK_LIST_HOA_DON);
  if (url.includes(`${base}/hoa-don/findHDMaAndKhachHang/`)) {
    const ma = url.split('/').pop()?.split('?')[0] || '';
    return mockApiResponse(MOCK_HOA_DON_BY_MA[ma] ?? null);
  }
  if (url.includes(`${base}/hoa-don/`) && !url.includes('/find/') && !url.includes('/all')) {
    const pathId = url.replace(base + '/hoa-don/', '').split('?')[0];
    if (pathId && pathId.length > 5 && !pathId.includes('find')) return mockApiResponse({ ...MOCK_HOA_DON, id: pathId });
  }
  if (url.includes(`${base}/hoa-don-chi-tiet/allKh/`)) return mockApiResponse(MOCK_HOA_DON_CHI_TIET);
  if (url.includes(`${base}/hoa-don-chi-tiet/`) && !url.includes('/allKh/')) {
    const id = url.split('/').pop()?.split('?')[0];
    if (id) return mockApiResponse({ ...MOCK_HOA_DON_CHI_TIET[0], id, hoaDon: MOCK_HOA_DON });
  }
  return null;
}
