import {MauSacDto} from "./mau-sac-dto.model";
import {DanhMucDto} from "./danh-muc-dto.model";
import {KichThuocDto} from "./kich-thuoc-dto.model";

export interface FilterSanPhamRequest {
  danhMuc: DanhMucDto | null;
  mauSac: MauSacDto | null;
  kichThuoc: KichThuocDto | null;
}
