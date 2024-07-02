import {HoaDonDto} from "./hoa-don-dto.model";
import {ChiTietSanPhamDto} from "./chi-tiet-san-pham-dto.model";

export interface HoaDonChiTietDto {
  id: string;
  gioHang: HoaDonDto;
  chiTietSanPham: ChiTietSanPhamDto;
  soLuong: number;
  ngayTao: Date;
  ngaySua: Date;
  trangThai: boolean;
  giaBan: number;
}
