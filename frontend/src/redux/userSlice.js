import { createSlice } from "@reduxjs/toolkit";

const getInitialUser = () => {
  try {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (err) {
    console.error("Failed to parse user from sessionStorage:", err);
    sessionStorage.removeItem("user");
    return null;
  }
};

const initialState = {
  currentUser: getInitialUser(),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.currentUser = action.payload;
      sessionStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.currentUser = null;
      sessionStorage.removeItem("user");
    },
    setUser: (state, action) => {
      state.currentUser = action.payload;
      sessionStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
});

export const { loginSuccess, logout, setUser } = userSlice.actions;
export default userSlice.reducer;
