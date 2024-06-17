import {GioHangDto} from "./gio-hang-dto";
import {Voucher} from "./voucher";
import {GioHangChiTietDto} from "./gio-hang-chi-tiet-dto.model";

export interface ThanhToanOnl{
    gioHang: GioHangDto;
    tongTien: number;
    tongTienGiam: number;
    voucher: Voucher;
    ghiChu:string;
    gioHangChiTiet: GioHangChiTietDto[];
}
