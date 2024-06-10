import { DecimalPipe } from "@angular/common";

export interface HoaDonDto {
  id: string;
  ma: string;
  tongTien:string;
  tongTienGiam: string;
  voucher: string;
  khachHangId: string;
  nhanVienId: string;
  ngayTao: Date;
  ngaySua: Date;
  trangThai: boolean;
}
  
  