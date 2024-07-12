import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'maskValue'
})
export class MaskValuePipe implements PipeTransform {
  transform(value: string, visibleStart: number = 0, visibleEnd: number = 0): string {
    if (!value) return value;
    const length = value.length;
    const maskedSection = '*'.repeat(length - visibleStart - visibleEnd);
    return `${value.substring(0, visibleStart)}${maskedSection}${value.substring(length - visibleEnd)}`;
  }
}
