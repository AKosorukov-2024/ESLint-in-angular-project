import { Injectable } from '@angular/core';
import {HubConnection, HubConnectionBuilder} from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private readonly _hubConnection: HubConnection;
  constructor() {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7217/orderHub')
      .build();
  }

  getHubConnection(): HubConnection {
    return this._hubConnection;
  }

  async connect(): Promise<void> {
    try {
      await this._hubConnection.start();
      console.log('SignalR connected');
    } catch (error) {
      
      console.error('SignalR connection error:', error);
      alert(error);
    }
  }

  async getLaptopList(): Promise<void> {
    try {
      await this._hubConnection.invoke('GetLaptopList');
    } catch (error) {
      console.error('Error invoking GetLaptopList:', error);
      alert(error);
    }
  }

  async createOrder(): Promise<void> {
    try {
      await this._hubConnection.invoke('CreateOrder');
    } catch (error) {
      console.error('Error invoking CreateOrder:', error);
      alert(error);
    }
  }

  async getOrderList(): Promise<void> {
    try {
      await this._hubConnection.invoke('GetOrderList');
    } catch (error) {
      console.error('Error invoking GetOrderList:', error);
      alert(error);
    }
  }

  async getLaptopOrderList(orderId: string, isInGroup: boolean): Promise<void> {
    try {
      await this._hubConnection.invoke('GetLaptopOrderList', orderId, isInGroup);
    } catch (error) {
      console.error('Error invoking GetOrderList:', error);
      alert(error);
    }
  }

  async deleteLaptopOrderList(orderId: string, isInGroup: boolean): Promise<void> {
    try {
      await this._hubConnection.invoke('DeleteOrder', orderId, isInGroup);
    } catch (error) {
      console.error('Error invoking GetOrderList:', error);
      alert(error);
    }
  }

  async sendOrder(orderId: string, totalOrder: Map<string, number>, isInGroup: boolean): Promise<void> {

    const obj = Object.fromEntries(totalOrder);
    const totalOrderSerialized = JSON.stringify(obj);

    try {
      await this._hubConnection.invoke('DeleteOrder', orderId, isInGroup);
    } catch (error) {
      console.error('Error invoking DeleteOrder:', error);
      alert(error);
    }
    try {
        await this._hubConnection.invoke('SendOrder', orderId, totalOrderSerialized, isInGroup);
	
    } catch (error) {
      console.error('Error invoking SendOrder:', error);
      alert(error);
    }
  }
  
  async addToGroup(orderId: string, addToGroup: boolean): Promise<void> {
    try {
      await this._hubConnection.invoke('AddToGroup', orderId, addToGroup);
    } catch (error) {
      console.error('Error invoking AddToGroup:', error);
      alert(error);
    }
  }
}
