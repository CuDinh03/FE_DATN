import { DecimalPipe } from "@angular/common";

export interface HoaDonDto {
  id: string;
  ma: string;
  tongTien:string;
  tongTienGiam: number;
  voucher: string;
  ghiChu: string;
  khachHangId: string;
  nhanVienId: string;
  ngayTao: Date;
  ngaySua?: Date;
  trangThai: number;
}
