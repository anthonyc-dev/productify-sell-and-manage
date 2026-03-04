import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "productify_cart";

const loadCart = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.selectedColor === action.payload.selectedColor,
      );
      if (existing) {
        return state.map((item) => {
          if (item.productId === action.payload.productId) {
            const newQuantity = item.quantity + (action.payload.quantity || 1);
            return {
              ...item,
              quantity:
                newQuantity > item.inventory ? item.inventory : newQuantity,
            };
          }
          return item;
        });
      }
      if (action.payload.inventory <= 0) return state;
      return [
        ...state,
        {
          ...action.payload,
          quantity: action.payload.quantity || 1,
        },
      ];
    }
    case "REMOVE_ITEM":
      return state.filter((item) => item.productId !== action.payload);
    case "UPDATE_QUANTITY":
      return state.map((item) => {
        if (
          item.productId === action.payload.productId &&
          item.selectedColor === action.payload.selectedColor
        ) {
          const newQuantity = action.payload.quantity;
          const boundedQuantity = Math.max(
            1,
            Math.min(newQuantity, item.inventory),
          );
          return { ...item, quantity: boundedQuantity };
        }
        return item;
      });
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, [], loadCart);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addItem = (product, selectedColor = null, quantity = 1) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        productId: product.id,
        title: product.title,
        imageUrl: product.imageUrl,
        price: product.price,
        inventory: product.inventory,
        selectedColor,
        quantity,
        sellerName: product.user?.name || "Unknown",
      },
    });
  };

  const removeItem = (productId) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId });
  };

  const updateQuantity = (productId, selectedColor, quantity) => {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { productId, selectedColor, quantity },
    });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
