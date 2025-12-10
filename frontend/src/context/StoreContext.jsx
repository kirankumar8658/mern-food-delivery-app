import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  // State Initialization
  const [cartItem, setCartItem] = useState({}); // Initialize as empty object
  const url = "https://food-delivery-backend-1ksm.onrender.com";
  const [token, setToken] = useState("");
  const [food_list, setFood_list] = useState([]);

  // API: Add Item to Cart
  const addToCart = async (itemId) => {
    if (!cartItem[itemId]) {
      setCartItem((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItem((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    // Sync with backend only if token is available
    if (token) {
      await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { token } }
      );
    }
  };

  // API: Remove Item from Cart
  const removeFromCart = async (itemId) => {
    setCartItem((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    // Sync with backend only if token is available
    if (token) {
      await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { token } }
      );
    }
  };

  // API: Fetch All Food Items
  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    setFood_list(response.data.data);
  };

  // API: Load User Cart Data (FIXED: Accepts token argument)
  const loadCartData = async (accessToken) => {
    const response = await axios.get(url + "/api/cart/get", {
      headers: { token: accessToken },
    });
    setCartItem(response.data.cartData);
  };

  // Utility: Calculate Total Cart Amount
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItem) {
      if (cartItem[item] > 0) {
        // Find item details from the list
        let itemInfo = food_list.find((product) => product._id === item);
        // Safety check in case itemInfo is undefined
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItem[item];
        }
      }
    }
    return totalAmount;
  };

  // Effect: Load Food List and User Data on Mount
  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const storedToken = localStorage.getItem("token"); // Get token once
      if (storedToken) {
        setToken(storedToken);
        // Call loadCartData with the retrieved token for immediate use
        await loadCartData(storedToken);
      }
    }
    loadData();
  }, []); // Runs once on component mount

  const logout = () => {
    // 1. Remove the token from localStorage
    localStorage.removeItem("token");

    // 2. Clear the token state
    setToken("");

    // 3. CRUCIAL FIX: Clear the local cart state immediately
    setCartItem({});
  };

  const contextValue = {
    food_list,
    cartItem,
    setCartItem,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    logout,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;
