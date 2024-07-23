import { GioHangChiTietDto } from 'src/app/model/gio-hang-chi-tiet-dto.model';
import { HoaDonDto } from './hoa-don-dto.model';
export interface ThanhToanDto {
    hoaDonDto: HoaDonDto;
    gioHangChiTietDtoList: GioHangChiTietDto[];

  }
