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
 *
 * Three things persist, under three keys so a corrupt value in one can't take
 * the others down with it: the cart, the save-for-later shelf, and the applied
 * promo code. The promo code is only ever a *hint* — `/api/checkout` re-derives
 * the discount from `@/lib/cart/pricing`, so editing it in devtools buys
 * nothing.
 */

const STORAGE_KEY = "shopoholics.cart.v2";
const SAVED_STORAGE_KEY = "shopoholics.saved.v1";
const PROMO_STORAGE_KEY = "shopoholics.promo.v1";
const MAX_QUANTITY = 99;
const MAX_LINES = 50;
const MAX_SAVED_LINES = 50;

type CartState = Record<string, CartEntry>;

interface CartStore {
  items: CartState;
  saved: CartState;
}

type CartAction =
  | { type: "HYDRATE"; payload: CartStore }
  | { type: "ADD"; item: CartItem; count: number }
  | { type: "REMOVE"; id: string }
  | { type: "INCREMENT"; id: string; count: number }
  | { type: "DECREMENT"; id: string; count: number }
  | { type: "SET_QUANTITY"; id: string; quantity: number }
  | { type: "SAVE_FOR_LATER"; id: string }
  | { type: "MOVE_TO_CART"; id: string }
  | { type: "REMOVE_SAVED"; id: string }
  | { type: "CLEAR" };

const clampQuantity = (n: number) => Math.min(Math.max(Math.trunc(n), 1), MAX_QUANTITY);

const omit = (state: CartState, id: string): CartState => {
  const { [id]: _removed, ...rest } = state;
  return rest;
};

function reducer(state: CartStore, action: CartAction): CartStore {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;

    case "ADD": {
      const existing = state.items[action.item.id];
      if (!existing && Object.keys(state.items).length >= MAX_LINES) return state;
      return {
        // Adding something back to the cart retires it from the shelf, so the
        // same product can never occupy both lists at once.
        saved: omit(state.saved, action.item.id),
        items: {
          ...state.items,
          [action.item.id]: {
            ...action.item,
            quantity: clampQuantity((existing?.quantity ?? 0) + action.count),
          },
        },
      };
    }

    case "INCREMENT": {
      const existing = state.items[action.id];
      if (!existing) return state;
      return {
        ...state,
        items: {
          ...state.items,
          [action.id]: { ...existing, quantity: clampQuantity(existing.quantity + action.count) },
        },
      };
    }

    case "DECREMENT": {
      const existing = state.items[action.id];
      if (!existing) return state;
      const next = existing.quantity - action.count;
      if (next < 1) return { ...state, items: omit(state.items, action.id) };
      return {
        ...state,
        items: { ...state.items, [action.id]: { ...existing, quantity: next } },
      };
    }

    case "SET_QUANTITY": {
      const existing = state.items[action.id];
      if (!existing) return state;
      if (action.quantity < 1) return { ...state, items: omit(state.items, action.id) };
      return {
        ...state,
        items: {
          ...state.items,
          [action.id]: { ...existing, quantity: clampQuantity(action.quantity) },
        },
      };
    }

    case "REMOVE":
      return { ...state, items: omit(state.items, action.id) };

    case "SAVE_FOR_LATER": {
      const existing = state.items[action.id];
      if (!existing) return state;
      if (
        !state.saved[action.id] &&
        Object.keys(state.saved).length >= MAX_SAVED_LINES
      ) {
        return state;
      }
      return {
        items: omit(state.items, action.id),
        saved: { ...state.saved, [action.id]: existing },
      };
    }

    case "MOVE_TO_CART": {
      const existing = state.saved[action.id];
      if (!existing) return state;
      const inCart = state.items[action.id];
      if (!inCart && Object.keys(state.items).length >= MAX_LINES) return state;
      return {
        saved: omit(state.saved, action.id),
        items: {
          ...state.items,
          [action.id]: {
            ...existing,
            quantity: clampQuantity((inCart?.quantity ?? 0) + existing.quantity),
          },
        },
      };
    }

    case "REMOVE_SAVED":
      return { ...state, saved: omit(state.saved, action.id) };

    case "CLEAR":
      // The shelf deliberately survives checkout — those items were never
      // bought, so clearing them would be data loss, not cleanup.
      return { ...state, items: {} };

    default:
      return state;
  }
}

/** Defensive read — a corrupt or stale localStorage entry must not break the app. */
function readStoredEntries(key: string): CartState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(key);
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

function readStoredPromo(): string {
  if (typeof window === "undefined") return "";
  try {
    return (window.localStorage.getItem(PROMO_STORAGE_KEY) ?? "").trim().toUpperCase();
  } catch {
    return "";
  }
}

function writeStored(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Quota exceeded or storage disabled — the in-memory cart still works.
  }
}

interface CartContextValue {
  cartDetails: CartState;
  cartCount: number;
  /** Distinct product lines, as opposed to total units. */
  lineCount: number;
  /** Whole Naira. */
  totalPrice: number;
  addItem: (item: CartItem, count?: number) => void;
  removeItem: (id: string) => void;
  incrementItem: (id: string, count?: number) => void;
  decrementItem: (id: string, count?: number) => void;
  setItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  /** Save-for-later shelf, keyed by slug exactly like the cart. */
  savedDetails: CartState;
  savedCount: number;
  saveForLater: (id: string) => void;
  moveToCart: (id: string) => void;
  removeSaved: (id: string) => void;
  /** Normalized (upper-case, trimmed). A hint only — the server re-validates. */
  promoCode: string;
  setPromoCode: (code: string) => void;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  /** Opens the cart sheet — replaces use-shopping-cart's handleCartClick. */
  handleCartClick: () => void;
  /** False until localStorage has been read; gate cart-dependent UI on it. */
  isHydrated: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

const EMPTY_STORE: CartStore = { items: {}, saved: {} };

export function CartProvider({ children }: { children: ReactNode }) {
  // Starts empty on both the server render and the client's first render —
  // reading localStorage during init is exactly what causes hydration mismatch.
  const [store, dispatch] = useReducer(reducer, EMPTY_STORE);
  const [promoCode, setPromoCodeState] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    dispatch({
      type: "HYDRATE",
      payload: {
        items: readStoredEntries(STORAGE_KEY),
        saved: readStoredEntries(SAVED_STORAGE_KEY),
      },
    });
    setPromoCodeState(readStoredPromo());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Guarded: without this the empty initial state overwrites the saved cart.
    if (!isHydrated) return;
    writeStored(STORAGE_KEY, JSON.stringify(store.items));
    writeStored(SAVED_STORAGE_KEY, JSON.stringify(store.saved));
  }, [store, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    writeStored(PROMO_STORAGE_KEY, promoCode);
  }, [promoCode, isHydrated]);

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
  const setItemQuantity = useCallback(
    (id: string, quantity: number) => dispatch({ type: "SET_QUANTITY", id, quantity }),
    []
  );
  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
    // The promo code belongs to the basket that just checked out — leaving it
    // set would silently re-apply a spent discount to the next order.
    setPromoCodeState("");
  }, []);
  const saveForLater = useCallback((id: string) => dispatch({ type: "SAVE_FOR_LATER", id }), []);
  const moveToCart = useCallback((id: string) => dispatch({ type: "MOVE_TO_CART", id }), []);
  const removeSaved = useCallback((id: string) => dispatch({ type: "REMOVE_SAVED", id }), []);
  const handleCartClick = useCallback(() => setCartOpen(true), []);

  const setPromoCode = useCallback((code: string) => {
    setPromoCodeState(code.trim().toUpperCase());
  }, []);

  const { cartCount, totalPrice, lineCount } = useMemo(() => {
    let count = 0;
    let total = 0;
    let lines = 0;
    for (const entry of Object.values(store.items)) {
      count += entry.quantity;
      total += entry.price * entry.quantity;
      lines += 1;
    }
    return { cartCount: count, totalPrice: total, lineCount: lines };
  }, [store.items]);

  const savedCount = useMemo(() => Object.keys(store.saved).length, [store.saved]);

  const value = useMemo<CartContextValue>(
    () => ({
      cartDetails: store.items,
      cartCount,
      lineCount,
      totalPrice,
      addItem,
      removeItem,
      incrementItem,
      decrementItem,
      setItemQuantity,
      clearCart,
      savedDetails: store.saved,
      savedCount,
      saveForLater,
      moveToCart,
      removeSaved,
      promoCode,
      setPromoCode,
      isCartOpen,
      setCartOpen,
      handleCartClick,
      isHydrated,
    }),
    [
      store.items,
      store.saved,
      cartCount,
      lineCount,
      totalPrice,
      savedCount,
      addItem,
      removeItem,
      incrementItem,
      decrementItem,
      setItemQuantity,
      clearCart,
      saveForLater,
      moveToCart,
      removeSaved,
      promoCode,
      setPromoCode,
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
