import { createSlice } from "@reduxjs/toolkit";

// Initialize from sessionStorage (per tab)
let initialUser = null;

try {
  const userSession = sessionStorage.getItem("user");
  if (userSession) {
    initialUser = JSON.parse(userSession);
  }
} catch (error) {
  console.error("Error parsing session user:", error);
  sessionStorage.removeItem("user");
  initialUser = null;
}

const userSlice = createSlice({
  name: "user",
  initialState: { currentUser: initialUser },
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
