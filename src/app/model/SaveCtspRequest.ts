import {SanPhamDto} from "./san-pham-dto.model";
import {MauSacDto} from "./mau-sac-dto.model";
import {ChatLieuDto} from "./chat-lieu-dto.model";
import {DanhMucDto} from "./danh-muc-dto.model";
import {KichThuocDto} from "./kich-thuoc-dto.model";
import {ThuongHieuDto} from "./thuong-hieu-dto.model";

export interface SaveCtspRequest {
  sanPham: SanPhamDto;
  mauSacList: MauSacDto[];
  chatLieu: ChatLieuDto;
  danhMuc: DanhMucDto;
  thuongHieu: ThuongHieuDto;
  kichThuocList: KichThuocDto[];
}
