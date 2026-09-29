import { createContext, useContext, useMemo, useState, type FC, type ReactNode } from 'react';

export interface CartItem {
  productName: string;
  category: string;
  qty: number;
  unit: string;
  minQty: number;
  price: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
}

interface CartContextValue {
  items: CartItem[];
  customer: CustomerDetails;
  sheetOpen: boolean;
  addItem: (name: string, category: string, qty: number, unit: string, minQty?: number, price?: number) => void;
  removeItem: (index: number) => void;
  updateQty: (index: number, qty: number) => void;
  setCustomer: (field: keyof CustomerDetails, value: string) => void;
  clearCart: () => void;
  openSheet: () => void;
  closeSheet: () => void;
}

const emptyCustomer: CustomerDetails = { name: '', phone: '', address: '' };

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [customer, setCustomerState] = useState<CustomerDetails>(emptyCustomer);
  const [sheetOpen, setSheetOpen] = useState(false);

  const value = useMemo<CartContextValue>(() => ({
    items,
    customer,
    sheetOpen,
    addItem: (name, category, qty, unit, minQty = 1, price = 0) => {
      const floor = minQty;
      setItems((current) => {
        const existing = current.findIndex(
          (item) => item.productName === name && item.unit === unit,
        );
        if (existing >= 0) {
          return current.map((item, index) =>
            index === existing ? { ...item, qty: item.qty + qty, price } : item,
          );
        }
        return [
          ...current,
          { productName: name, category, qty: Math.max(floor, qty), unit, minQty: floor, price },
        ];
      });
    },
    removeItem: (index) => {
      setItems((current) => current.filter((_, i) => i !== index));
    },
    updateQty: (index, qty) => {
      setItems((current) =>
        current.map((item, i) => {
          if (i !== index) return item;
          return { ...item, qty: Math.max(item.minQty, qty) };
        }),
      );
    },
    setCustomer: (field, fieldValue) => {
      setCustomerState((current) => ({ ...current, [field]: fieldValue }));
    },
    clearCart: () => {
      setItems([]);
      setCustomerState(emptyCustomer);
    },
    openSheet: () => setSheetOpen(true),
    closeSheet: () => setSheetOpen(false),
  }), [items, customer, sheetOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook lives with the provider so cart state stays in one module.
// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
