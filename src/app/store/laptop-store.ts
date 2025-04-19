import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { LaptopView } from '../model/data';
import { SignalrService } from '../services/signalr.service';

export type LaptopFilter = 'All' | 'Asus' | 'Core' | 'HP' | 'Lenovo' | 'Office';
export interface LaptopState {
  laptopViewlist: LaptopView[];
  isLoading: boolean;
  filter: LaptopFilter;
}

const initialState: LaptopState = {
  laptopViewlist: [],
  isLoading: false,
  filter: 'All'
}

export const laptopStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (store, signalrService = inject(SignalrService)) => (
      {
        async getLaptopOrderList(orderId: string, isInGroup: boolean) {
          patchState(store, { isLoading: true });

          await signalrService.getLaptopOrderList(orderId, isInGroup);
        },

        async sendOrder(orderId: string, laptopOrder: Map<string, number>, isInGroup: boolean) {
          patchState(store, { isLoading: true });
          await signalrService.sendOrder(orderId, laptopOrder, isInGroup);
        },

        async deleteLaptopOrderList(orderId: string, isInGroup: boolean) {
          patchState(store, { isLoading: true });
          await signalrService.deleteLaptopOrderList(orderId, isInGroup);
          patchState(store, (state) => ({
            laptopViewlist: state.laptopViewlist.filter(order => order.orderId !== orderId)
          }));
          patchState(store, { isLoading: false });
        },

        updateState(laptopViewlist: LaptopView[]) {
          patchState(store, { laptopViewlist, isLoading: false })
        },

        async updateFilter(filter: LaptopFilter) {
          patchState(store, { filter });
        }

      }
    )
  ),
  withComputed(
    (state) => ({
      filteredLaptopList: computed(() => {
        const laptopViewList = state.laptopViewlist();
         switch (state.filter()) {
          case 'Asus':
            return laptopViewList.filter(laptop => laptop.name.includes('Asus'));
          case 'Core':
            return laptopViewList.filter(laptop => laptop.name.includes('Core'));
          case 'HP':
            return laptopViewList.filter(laptop => laptop.name.includes('HP'));
          case 'Lenovo':
            return laptopViewList.filter(laptop => laptop.name.includes('Lenovo'));
          case 'Office':
            return laptopViewList.filter(laptop => laptop.name.includes('Office'));
          default:
            return laptopViewList;
        }
      })
    })
  )
);
