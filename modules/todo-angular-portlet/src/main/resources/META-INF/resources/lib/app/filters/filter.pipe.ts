import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter'
})

export class FilterPipe implements PipeTransform {
    transform(items: any[], searchText: string, searchFilter: string){
        if (items && items.length){
            return items.filter(item =>{
                if (searchText && item.description.toLowerCase().indexOf(searchText.toLowerCase()) === -1){
                    return false;
                }

                if (searchFilter && item.status.toLowerCase().indexOf(searchFilter.toLowerCase()) === -1){
                    return false;
                }

                return true;
            })
        } else {
            return items;
        }
    }
}
