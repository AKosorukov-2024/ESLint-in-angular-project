import { Component, OnInit, inject, signal } from '@angular/core';
import { SignalrService } from '../services/signalr.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Laptop, LaptopView, Order } from '../model/data';
import { laptopStore, LaptopFilter } from '../store/laptop-store';


@Component({
  selector: 'app-laptop-orders',
  imports: [FormsModule, CommonModule],
  templateUrl: './laptop-orders.component.html',
  styleUrl: './laptop-orders.component.css'
})
export class LaptopOrdersComponent implements OnInit {
  public laptopList: Laptop[] = [];
  public orderId?: string;
  public orderList: Order[] = [];
  public orderListVisible = false;
  private _laptopOrder = new Map<string, number>();
  private _groupMembers = new Map<string, boolean>();
  private _isInGroup = false;
  private _htmlAddToGroup: HTMLInputElement = document.createElement('input');
  private _laptopFilter: HTMLSelectElement = document.createElement('select');
  private _store = inject(laptopStore);
  private _filter = signal('All');

  constructor(private signalrService: SignalrService) {
  }

  public get isConnected(): boolean {

    if (this.signalrService.getHubConnection().state == 'Connected') {
      return true;
    }
    this.laptopList = [];
    return false;
  }

  public get isFilterDisabled(): boolean {

    if (this._store.laptopViewlist().length > 0) {
      return false;
    }
    return true;
  }

  ngOnInit(): void {
    this._htmlAddToGroup = document.getElementById('addToGroup') as HTMLInputElement;
    this._laptopFilter = document.getElementById('laptopFilter') as HTMLSelectElement;

    this.connectSignalR();
  }


public connectSignalR(): void {

  this.signalrService.connect().then(() => {

    this.getLaptopList();


    this.signalrService.getHubConnection().on('receiveLaptopList',
      (items: Laptop[]) => {
        this.laptopList = items;
      });

   this.signalrService.getHubConnection().on('groupMember',
      (groupMember: boolean) => {
        this._htmlAddToGroup.checked = groupMember;
        if (this.orderId) {
          this._groupMembers.set(this.orderId, groupMember);
        }
      });      

    this.signalrService.getHubConnection().on('receiveOrder',
      (laptopViewList: LaptopView[]) => {
        this._laptopOrder.clear();
        if (laptopViewList.length > 0) {
          this.orderId = laptopViewList[0].orderId;
        }
        this.initializeControls();
        for (const laptop of laptopViewList) {
          const inputElement = document.getElementById('input' + laptop.laptopId) as HTMLInputElement;
          const checkBox = document.getElementById('check' + laptop.laptopId) as HTMLInputElement;
          inputElement.value = laptop.qty.toString();
          checkBox.checked = true;
          this._laptopOrder.set(laptop.laptopId, laptop.qty);
        }
        this._store.updateState(laptopViewList);

        this.orderTable();
      });

    this.signalrService.getHubConnection().on('orderCreated',
      (orderId: string) => {
        this.orderId = orderId;
      })

      this.signalrService.getHubConnection().on('receiveorderList',
        (items: Order[]) => {
          this.orderList = items;
        });      
  });
  }

  public createOrder(): void {
    this.checkConnection();
    this.initializeControls();
    this._laptopOrder.clear();
    this.orderListVisible = false;
    this._htmlAddToGroup.checked = false;
    this._laptopFilter.selectedIndex = 0;
    this._filter.set('All');
    this._store.updateFilter(this._filter() as LaptopFilter);
    this._store.updateState([]);

    this.orderTable();
    this.signalrService.createOrder();
  }

  public getOrderList(): void {
    this.checkConnection();
    this.orderListVisible = true;
    this.signalrService.getOrderList();
  }

  public addRemoveLaptop(laptopId: string): void {

    const inputElement = document.getElementById('input' + laptopId) as HTMLInputElement;

    const checkBox = document.getElementById('check' + laptopId) as HTMLInputElement;
    if (checkBox.checked && +inputElement.value > 0) {

      this._laptopOrder.set(laptopId, +inputElement.value);
    } else {
      this._laptopOrder.delete(laptopId);
    }
  }

  public sendOrder(): void {
    this.checkConnection();
    if (this.orderId) {
      this._store.sendOrder(this.orderId, this._laptopOrder, this._isInGroup);
    } else {
      alert('Please create Order.')
    }
  }

  public deleteOrderList() {
    this.checkConnection();
    if (this.orderId) {
      if (confirm('Are you sure you want to delete this order?: \n' + this.orderId) == true) {
        this._store.deleteLaptopOrderList(this.orderId, this._isInGroup);
      } 
    }
  }
  
  public addToGroup(): void {
    if (this.signalrService.getHubConnection().state == 'Disconnected'
      || !this.orderId) {
      this._htmlAddToGroup.checked = false;
      return;
    }

    this._isInGroup = false;
    if (this._htmlAddToGroup.checked) {
      this._isInGroup = true;
    }
    if (this.orderId) {
      this.signalrService.addToGroup(this.orderId, this._isInGroup);
    }
  }

  public onSelect(orderId: string): void {
    this.checkConnection();
    this.orderId = orderId;
    this.orderListVisible = false;
    const groupMember = this._groupMembers.get(orderId)
    this._htmlAddToGroup.checked = false;
    this._laptopFilter.selectedIndex = 0;
    this._filter.set('All');
    this._store.updateFilter(this._filter() as LaptopFilter);
    if (groupMember) {
      this._htmlAddToGroup.checked = groupMember;
    }

    this.getlaptopOrderList();
  }

  public selectFilter() {
    const i = this._laptopFilter.selectedIndex;
    this._filter = signal(this._laptopFilter.options[i].text);
    this._store.updateFilter(this._filter() as LaptopFilter);
    this.orderTable();
  }

  private getlaptopOrderList() {
    this.checkConnection();
    if (this.orderId) {
      this._store.getLaptopOrderList(this.orderId, this._isInGroup);
    }
  }

  private getLaptopList(): void {
    this.signalrService.getLaptopList();
  }

  private initializeControls(): void {
    for (const laptop of this.laptopList) {
      const inputElement = document.getElementById('input' + laptop.laptopId) as HTMLInputElement;
      const checkBox = document.getElementById('check' + laptop.laptopId) as HTMLInputElement;
      inputElement.value = '0';
      checkBox.checked = false;
    }
  }

  private checkConnection() {
    if (this.signalrService.getHubConnection().state == 'Disconnected') {
      this.connectSignalR();
    }
  }

  private orderTable(): void {

    const orderTable = document.getElementById('orderTable');
    if (!orderTable) {
      return;
    }
    orderTable.replaceChildren();
    if (this._store.filteredLaptopList().length == 0) {
      return;
    }

    const tbl = document.createElement('table');
    tbl.setAttribute('id', 'listTable');

    const tblBody = document.createElement('tbody');

    // get all field names from the object
    const fields: string[] = Object.getOwnPropertyNames(this._store.filteredLaptopList()[0]);
    const row = document.createElement('tr');
    for (const field of fields) {
      // create a <td> element 
      const cell = document.createElement('td');
      // get field's value in the cellText

      const cellText = document.createTextNode(field);
      cell.appendChild(cellText);
      cell.setAttribute('align', 'center');
      cell.setAttribute('font-weight', '900');
      row.appendChild(cell);
    }

    // add the row to the end of the table body
    tblBody.appendChild(row);

    for (const laptop of this._store.filteredLaptopList()) {
      // create a table row
      const row = document.createElement('tr');
      for (const field of fields) {
        // create a <td> element 
        const cell = document.createElement('td');
        // get field's value in the cellText

        const cellText = document.createTextNode(eval(`{laptop.${field}}`));
        cell.appendChild(cellText);
        row.appendChild(cell);
      }

      // add the row to the end of the table body
      tblBody.appendChild(row);
    }

    // put the <tbody> in the <table>
    tbl.appendChild(tblBody);
    // sets the border attribute of tbl to '2'
    tbl.setAttribute('border', '2');
    tbl.setAttribute('align', 'center');
    tbl.setAttribute('margin', '0px auto');
    // appends <table> into <body>
    orderTable.appendChild(tbl);
  }
}
