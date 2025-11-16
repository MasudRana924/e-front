import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../baseApi";
import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import type { RootState, AppDispatch } from "../../store"; // Adjust the path to your store


interface User {
  _id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  nid: string;
  role: "USER" | "AGENT" | "ADMIN";
  status?: string;
  auths?: Array<{
    provider: string;
    providerId: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface LoginFormData {
  phoneNumber: string;
  password: string;
}

interface SignupFormData {
  phoneNumber: string;
  email: string;
  password: string;
  name: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Helper function to decode JWT token
const decodeJWT = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      _id: payload.userId,
      email: payload.email,
      role: payload.role,
      name: payload.name || payload.email?.split('@')[0] || 'User',
      phoneNumber: payload.phoneNumber || payload.phone || '',
      nid: payload.nid || payload.nidNumber || ''
    };
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Check if user is already logged in
const getInitialUser = () => {
  const token = localStorage.getItem("authToken");
  if (token) {
    return decodeJWT(token);
  }
  return null;
};

const initialState: AuthState = {
  user: getInitialUser(),
  loading: false,
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData: LoginFormData, { rejectWithValue }) => {
    try {
      const apiData = {
        phone: formData.phoneNumber,
        pin: formData.password,
      };
      
      const response = await api.post("/auth/login", apiData);
      
      // Store token in localStorage if provided
      if (response.data.data.accessToken) {
        localStorage.setItem("authToken", response.data.data.accessToken);
      }
      
      // Decode JWT token to get user information
      const token = response.data.data.accessToken;
      const user = decodeJWT(token);
      
      return {
        ...response.data,
        user: user
      };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Login API Error Details:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        headers: err.response?.headers
      });
      
      let errorMessage = "Login failed";
      
      // Handle JSON error responses
      if (err.response?.data) {
        if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else {
          errorMessage = JSON.stringify(err.response.data);
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for signup
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (formData: SignupFormData, { rejectWithValue }) => {
    try {
      // Map frontend form data to backend API format
      const apiData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phoneNumber,
        pin: formData.password,
        role: formData.role?.toUpperCase() // Convert role to uppercase (USER/AGENT format for backend)
      };
      
      const response = await api.post("/user/register", apiData);
      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("API Error Details:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        headers: err.response?.headers
      });
      
      let errorMessage = "Signup failed";
      
      // Handle JSON error responses
      if (err.response?.data) {
        if (err.response.data.message) {
          // JSON response with message
          errorMessage = err.response.data.message;
        } else if (err.response.data.error) {
          // JSON response with error
          errorMessage = err.response.data.error;
        } else if (typeof err.response.data === 'string') {
          // Plain text response
          errorMessage = err.response.data;
        } else {
          // Other JSON response
          errorMessage = JSON.stringify(err.response.data);
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
      state.loading = false;
      // Clear token from localStorage
      localStorage.removeItem("authToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; // depends on your backend response
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; // depends on your backend response
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data; // Update user with fresh data from API
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});
export const { logout } = authSlice.actions;

export default authSlice.reducer;



// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (profileData: { name?: string; email?: string; profile?: string }, { rejectWithValue }) => {
    try {
      const response = await api.put("/users/me", profileData);
      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Update Profile API Error:", err.response?.data || err.message);
      
      let errorMessage = "Failed to update profile";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Hook to access auth state
export const useAuth = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = useCallback((formData: LoginFormData) => {
    return dispatch(loginUser(formData));
  }, [dispatch]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const updateProfile = useCallback((profileData: { name?: string; email?: string; profile?: string }) => {
    return dispatch(updateUserProfile(profileData));
  }, [dispatch]);

  return { ...auth, login: handleLogin, logout: handleLogout, updateProfile };
};