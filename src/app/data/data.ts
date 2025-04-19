export interface Laptop {
  laptopId: string;
  name: string;
  price: number;
  description: string;
  imageRef: string;
}

export interface LaptopView {
  orderId: string;
  laptopId: string;
  name: string;
  price: number;
  imageRef: string;
  status: string;
  qty: number;
  createdDate: Date;
}

export interface Order {
  orderId: string;
  status: string;
  createdDate: string;
}


