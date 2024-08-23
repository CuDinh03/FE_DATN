import {HinhAnhDto} from "./hinh-anh-dto.model";
import {SanPhamDto} from "./san-pham-dto.model";
import {ThuongHieuDto} from "./thuong-hieu-dto.model";
import {ChatLieuDto} from "./chat-lieu-dto.model";
import {DanhMucDto} from "./danh-muc-dto.model";
import {KichThuocDto} from "./kich-thuoc-dto.model";
import {MauSacDto} from "./mau-sac-dto.model";

export interface ChiTietSanPhamDto {
    id?: string;
    ma?: string;
    sanPham?: SanPhamDto;
    thuongHieu?: ThuongHieuDto;
    chatLieu?: ChatLieuDto;
    danhMuc?: DanhMucDto;
    kichThuoc?: KichThuocDto;
    mauSac?: MauSacDto;
    soLuong?: number;
    giaNhap?: number;
    giaBan?: number;
    ngayNhap?: Date;
    ngayTao?: Date;
    ngaySua?: Date;
    trangThai?: number;
  HinhAnh?: HinhAnhDto[];
}
