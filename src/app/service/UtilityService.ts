import { Injectable } from '@angular/core';
import {ChiTietSanPhamDto} from "../model/chi-tiet-san-pham-dto.model";

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  sanitizeObject(obj: any): any {
    const seen = new WeakSet();

    function stripCircularReferences(value: any): any {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return; // Loại bỏ thuộc tính vòng lặp
        }
        seen.add(value);
        for (const key in value) {
          if (Object.prototype.hasOwnProperty.call(value, key)) {
            value[key] = stripCircularReferences(value[key]);
          }
        }
      }
      return value;
    }

    return stripCircularReferences(obj);
  }


   removeHinhAnhProperty(list: ChiTietSanPhamDto[]): ChiTietSanPhamDto[] {
    return list.map(item => {
      const { hinhAnh, ...rest } = item; // Tách thuộc tính HinhAnh ra khỏi đối tượng
      return rest; // Trả về đối tượng mới không có thuộc tính HinhAnh
    });
  }
}
