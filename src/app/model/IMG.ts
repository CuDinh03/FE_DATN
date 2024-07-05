import {HinhAnhDto} from "./hinh-anh-dto.model";
import {ChiTietSanPhamDto} from "./chi-tiet-san-pham-dto.model";

export interface IMG{
  list?: HinhAnhDto[];
  chiTietSanPhamDto?: ChiTietSanPhamDto;
}
