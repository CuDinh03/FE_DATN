import {HoaDonChiTietDto} from "./hoa-don-chi-tiet.model";
import {HoaDonDto} from "./hoa-don-dto.model";
import {NguoiDung} from "./NguoiDung";


export interface HoaDonSua {
  hoaDonChiTiet: HoaDonChiTietDto[]
  hoaDon: HoaDonDto
  nguoiDung: NguoiDung
}
