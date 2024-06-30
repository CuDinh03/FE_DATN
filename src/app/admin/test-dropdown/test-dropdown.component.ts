import {Component} from '@angular/core';

@Component({
  selector: 'app-test-dropdown',
  templateUrl: './test-dropdown.component.html',
  styleUrls: ['./test-dropdown.component.css']
})
export class TestDropdownComponent {
  dropdownList: { item_id: number; item_text: string; }[] = [];
  selectedItems: { item_id: number; item_text: string; }[] = [];
  dropdownSettings: any = {};

  ngOnInit() {
    this.dropdownList = [
      {item_id: 1, item_text: 'Mumbai'},
      {item_id: 2, item_text: 'Bangaluru'},
      {item_id: 3, item_text: 'Pune'},
      {item_id: 4, item_text: 'Navsari'},
      {item_id: 5, item_text: 'New Delhi'}
    ];
    this.selectedItems = [
      {item_id: 3, item_text: 'Pune'},
      {item_id: 4, item_text: 'Navsari'}
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  onItemSelect(item: any) {
    console.log(item);
  }

  onSelectAll(items: any) {
    console.log(items);
  }
}
