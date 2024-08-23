import {TaiKhoanDto} from "./tai-khoan-dto.model";

export interface NguoiDung {
  id: string;
  ma: string;
  ten: string;
  taiKhoan: TaiKhoanDto;
  email: string;
  sdt: string;
  gioiTinh: boolean;
  ngaySinh: Date;
  diaChi: string;
  ngayTao: Date;
  ngaySua: Date;
  trangThai: number;
}
