import {HinhAnhDto} from "./hinh-anh-dto.model";

export interface ChiTietSanPhamDto {
    id?: string;
    ma?: string;
    sanPham?: any;
    thuongHieu?: any;
    chatLieu?: any;
    danhMuc?: any;
    kichThuoc?: any;
    mauSac?: any;
    soLuong?: number;
    giaNhap?: number;
    giaBan?: number;
    ngayNhap?: Date;
    ngayTao?: Date;
    ngaySua?: Date;
    trangThai?: number;
  HinhAnh?: HinhAnhDto[];
}
