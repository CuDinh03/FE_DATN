import {KhachHangDto} from "./khachHangDto";

export interface GioHangDto{
    id:string;
    ma:string;
    khachHang: KhachHangDto;
    ngayTao: Date;
    ngaySua: Date;
    trangThai: number;

}
