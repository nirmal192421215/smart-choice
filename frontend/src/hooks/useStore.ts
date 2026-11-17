import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, User, Order } from '../types';

export interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const calcTotals = (items: CartItem[]) => ({
  totalItems: items.reduce((sum, item) => sum + (item.quantity || 1), 0),
  totalAmount: items.reduce(
    (sum, item) => sum + ((item.salePrice ?? item.price) * (item.quantity || 1)),
    0
  ),
});

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalAmount: 0,
      addItem: (newItem) => {
        const existingIndex = get().items.findIndex(
          (item) =>
            item.productId === newItem.productId &&
            item.color === newItem.color &&
            item.variantId === newItem.variantId &&
            item.customDestinationUrl === newItem.customDestinationUrl
        );

        let nextItems: CartItem[];
        if (existingIndex > -1) {
          nextItems = get().items.map((item, idx) =>
            idx === existingIndex
              ? {
                  ...item,
                  quantity: item.quantity + (newItem.quantity || 1),
                  subtotal: (item.salePrice ?? item.price) * (item.quantity + (newItem.quantity || 1)),
                }
              : item
          );
        } else {
          nextItems = [
            ...get().items,
            {
              ...newItem,
              quantity: newItem.quantity || 1,
              subtotal: (newItem.salePrice ?? newItem.price) * (newItem.quantity || 1),
            },
          ];
        }

        const totals = calcTotals(nextItems);
        set({ items: nextItems, ...totals });
      },
      removeItem: (itemId) => {
        const nextItems = get().items.filter((item) => item.id !== itemId);
        set({ items: nextItems, ...calcTotals(nextItems) });
      },
      updateQuantity: (itemId, quantity) => {
        const validQty = Math.max(1, quantity);
        const nextItems = get().items.map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity: validQty,
                subtotal: (item.salePrice ?? item.price) * validQty,
              }
            : item
        );
        set({ items: nextItems, ...calcTotals(nextItems) });
      },
      clearCart: () => set({ items: [], totalItems: 0, totalAmount: 0 }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.items)) {
          const totals = calcTotals(state.items);
          state.totalItems = totals.totalItems;
          state.totalAmount = totals.totalAmount;
        }
      },
    }
  )
);

export interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: Pick<User, 'id' | 'name' | 'email'>) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useUser = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      login: (userData) =>
        set({
          user: {
            ...userData,
            role: 'customer',
            addresses: [],
            createdAt: new Date().toISOString(),
          },
          isAuthenticated: true,
          isLoading: false,
        }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),
      setUser: (userData) => set({ user: userData, isAuthenticated: !!userData }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export interface OrdersStore {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status'], paymentStatus?: Order['paymentStatus']) => void;
  clearOrders: () => void;
}

export const useOrders = create<OrdersStore>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => set({ orders: [order, ...get().orders] }),
      updateOrderStatus: (orderId, status, paymentStatus) =>
        set({
          orders: get().orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status,
                  ...(paymentStatus ? { paymentStatus } : {}),
                  updatedAt: new Date().toISOString(),
                }
              : o
          ),
        }),
      clearOrders: () => set({ orders: [] }),
    }),
    {
      name: 'orders-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);