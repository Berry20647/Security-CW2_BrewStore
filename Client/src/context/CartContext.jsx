import React, { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cart")) || [],
};

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART":
      const exists = state.cartItems.find(item => item.id === action.payload.id && item.weight === action.payload.weight);
      if (exists) {
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.id === action.payload.id && item.weight === action.payload.weight
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }],
        };
      }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cartItems: state.cartItems.filter(item => !(item.id === action.payload.id && item.weight === action.payload.weight)),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.id === action.payload.id && item.weight === action.payload.weight
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case "UPDATE_WEIGHT":
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.id === action.payload.id && item.weight === action.payload.oldWeight
            ? {
                ...item,
                weight: action.payload.newWeight,
                totalPrice: Math.round(item.pricePerGram * action.payload.newWeight),
              }
            : item
        ),
      };

    case "CLEAR_CART":
      return {
        ...state,
        cartItems: [],
      };

    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  const addToCart = (item) => dispatch({ type: "ADD_TO_CART", payload: item });
  const removeFromCart = (id, weight) => dispatch({ type: "REMOVE_FROM_CART", payload: { id, weight } });
  const updateQuantity = (id, weight, quantity) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, weight, quantity } });
  const updateWeight = (id, oldWeight, newWeight) =>
    dispatch({ type: "UPDATE_WEIGHT", payload: { id, oldWeight, newWeight } });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  return (
    <CartContext.Provider
      value={{ cartItems: state.cartItems, addToCart, removeFromCart, updateQuantity, updateWeight, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
