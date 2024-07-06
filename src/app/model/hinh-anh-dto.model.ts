import {ChiTietSanPhamDto} from "./chi-tiet-san-pham-dto.model";

export interface HinhAnhDto{
    id: string;
    ma?: string;
    url: string;
  chiTietSanPham:ChiTietSanPhamDto;
    trangThai: number;
}
