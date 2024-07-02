import {KhachHangDto} from "./khachHangDto";
import {HoaDonChiTietDto} from "./hoa-don-chi-tiet.model";

export interface DanhGiaDto {
  khachHang: KhachHangDto
  hoaDonChiTiet: HoaDonChiTietDto
  tieuDe: string
  noiDung: string
  diem: number
  trangThai: number;
}
