"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, CartEntry } from "@/types";

/**
 * A deliberately small replacement for `use-shopping-cart`, which was
 * Stripe-shaped: it required a Stripe publishable key and keyed entries by
 * `price_id`. Entries here are keyed by product slug, so cart links resolve to
 * real product pages and the server can re-price a cart from the ids alone.
 *
 * Prices are WHOLE NAIRA. Conversion to kobo happens server-side only.
 */

const STORAGE_KEY = "shopoholics.cart.v2";
const MAX_QUANTITY = 99;
const MAX_LINES = 50;

type CartState = Record<string, CartEntry>;

type CartAction =
  | { type: "HYDRATE"; payload: CartState }
  | { type: "ADD"; item: CartItem; count: number }
  | { type: "REMOVE"; id: string }
  | { type: "INCREMENT"; id: string; count: number }
  | { type: "DECREMENT"; id: string; count: number }
  | { type: "CLEAR" };

const clampQuantity = (n: number) => Math.min(Math.max(Math.trunc(n), 1), MAX_QUANTITY);

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;

    case "ADD": {
      const existing = state[action.item.id];
      if (!existing && Object.keys(state).length >= MAX_LINES) return state;
      return {
        ...state,
        [action.item.id]: {
          ...action.item,
          quantity: clampQuantity((existing?.quantity ?? 0) + action.count),
        },
      };
    }

    case "INCREMENT": {
      const existing = state[action.id];
      if (!existing) return state;
      return {
        ...state,
        [action.id]: { ...existing, quantity: clampQuantity(existing.quantity + action.count) },
      };
    }

    case "DECREMENT": {
      const existing = state[action.id];
      if (!existing) return state;
      const next = existing.quantity - action.count;
      if (next < 1) {
        const { [action.id]: _removed, ...rest } = state;
        return rest;
      }
      return { ...state, [action.id]: { ...existing, quantity: next } };
    }

    case "REMOVE": {
      const { [action.id]: _removed, ...rest } = state;
      return rest;
    }

    case "CLEAR":
      return {};

    default:
      return state;
  }
}

/** Defensive read — a corrupt or stale localStorage entry must not break the app. */
function readStoredCart(): CartState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};

    const result: CartState = {};
    for (const value of Object.values(parsed as Record<string, unknown>)) {
      const entry = value as Partial<CartEntry>;
      if (typeof entry?.id !== "string" || !entry.id) continue;
      if (typeof entry.name !== "string") continue;
      if (typeof entry.price !== "number" || !Number.isFinite(entry.price)) continue;
      result[entry.id] = {
        id: entry.id,
        name: entry.name,
        description: typeof entry.description === "string" ? entry.description : "",
        price: entry.price,
        image: typeof entry.image === "string" ? entry.image : "",
        quantity: clampQuantity(Number(entry.quantity) || 1),
      };
    }
    return result;
  } catch {
    return {};
  }
}

interface CartContextValue {
  cartDetails: CartState;
  cartCount: number;
  /** Whole Naira. */
  totalPrice: number;
  addItem: (item: CartItem, count?: number) => void;
  removeItem: (id: string) => void;
  incrementItem: (id: string, count?: number) => void;
  decrementItem: (id: string, count?: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  /** Opens the cart sheet — replaces use-shopping-cart's handleCartClick. */
  handleCartClick: () => void;
  /** False until localStorage has been read; gate cart-dependent UI on it. */
  isHydrated: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  // Starts empty on both the server render and the client's first render —
  // reading localStorage during init is exactly what causes hydration mismatch.
  const [cartDetails, dispatch] = useReducer(reducer, {});
  const [isHydrated, setIsHydrated] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    dispatch({ type: "HYDRATE", payload: readStoredCart() });
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Guarded: without this the empty initial state overwrites the saved cart.
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartDetails));
    } catch {
      // Quota exceeded or storage disabled — the in-memory cart still works.
    }
  }, [cartDetails, isHydrated]);

  const addItem = useCallback((item: CartItem, count = 1) => {
    dispatch({ type: "ADD", item, count });
  }, []);
  const removeItem = useCallback((id: string) => dispatch({ type: "REMOVE", id }), []);
  const incrementItem = useCallback(
    (id: string, count = 1) => dispatch({ type: "INCREMENT", id, count }),
    []
  );
  const decrementItem = useCallback(
    (id: string, count = 1) => dispatch({ type: "DECREMENT", id, count }),
    []
  );
  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);
  const handleCartClick = useCallback(() => setCartOpen(true), []);

  const { cartCount, totalPrice } = useMemo(() => {
    let count = 0;
    let total = 0;
    for (const entry of Object.values(cartDetails)) {
      count += entry.quantity;
      total += entry.price * entry.quantity;
    }
    return { cartCount: count, totalPrice: total };
  }, [cartDetails]);

  const value = useMemo<CartContextValue>(
    () => ({
      cartDetails,
      cartCount,
      totalPrice,
      addItem,
      removeItem,
      incrementItem,
      decrementItem,
      clearCart,
      isCartOpen,
      setCartOpen,
      handleCartClick,
      isHydrated,
    }),
    [
      cartDetails,
      cartCount,
      totalPrice,
      addItem,
      removeItem,
      incrementItem,
      decrementItem,
      clearCart,
      isCartOpen,
      handleCartClick,
      isHydrated,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
