import { Pipe, PipeTransform } from '@angular/core';
import { filter } from 'rxjs/operators';

@Pipe({
    name: 'filter',
    pure: false
})



export class FilterPipe implements PipeTransform {
    transform(value: any[], filterString: string): any {
        if (value.length === 0 || filterString === '') { return value; }
        const resultArray = [];
        for (const item of value) {
            if (item.hasOwnProperty('title') && JSON.stringify(item.title).includes(filterString))
                resultArray.push(item);
            else {
                if (JSON.stringify(item).includes(filterString))
                    resultArray.push(item);
            }
        }
        return resultArray;
    }
}