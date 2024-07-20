import { DecimalPipe } from "@angular/common";
import {NguoiDung} from "./NguoiDung";
import {KhachHangDto} from "./khachHangDto";
import {Voucher} from "./voucher";

export interface HoaDonDto {
  id: string;
  ma: string;
  tongTien:string;
  tongTienGiam: number;
  voucher: Voucher;
  ghiChu: string;
  khachHang: KhachHangDto;
  nhanVien: NguoiDung;
  ngayTao: Date;
  ngaySua: Date;
  trangThai: number;
}

