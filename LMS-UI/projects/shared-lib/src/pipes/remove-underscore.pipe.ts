import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeUnderscore'
})
export class RemoveUnderscorePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';
    return value.replace(/_/g, ' ');
  }

}
