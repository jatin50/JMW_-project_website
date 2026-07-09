import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosClient.js";

export const registerUser = createAsyncThunk("user/register", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/users/register", payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Registration failed");
  }
});

export const loginUser = createAsyncThunk("user/login", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/users/login", payload);
    return data.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

export const logoutUser = createAsyncThunk("user/logout", async (_, { rejectWithValue }) => {
  try {
    await api.post("/users/logout");
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Logout failed");
  }
});

// call this once on app load to check if the user has a valid session (cookie)
export const fetchCurrentUser = createAsyncThunk("user/fetchCurrent", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/users/me");
    return data.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Not logged in");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    isAuthenticated: false,
    status: "idle", // idle | loading | succeeded | failed
    error: null,
    authChecked: false, // becomes true once fetchCurrentUser has resolved/rejected on app load
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUser = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(registerUser.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(registerUser.fulfilled, (state) => { state.status = "succeeded"; })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null;
        state.isAuthenticated = false;
      })

      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        state.authChecked = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.currentUser = null;
        state.isAuthenticated = false;
        state.authChecked = true;
      });
  },
});

export default userSlice.reducer;