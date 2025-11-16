import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../baseApi";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { useCallback } from "react";

interface UserStats {
  balance: number;
  totalTransactions: number;
  transactionTypeStats: {
    "add-money": number;
    "send-money": number;
    "cash-out": number;
  };
  walletStatus: "active" | "inactive";
}

interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
      error?: string;
    } | string;
    headers?: Record<string, string>;
  };
  message?: string;
}

// interface UserStatsResponse {
//   success: boolean;
//   message: string;
//   data: UserStats;
// }

interface BalanceResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    balance: number;
    status: string;
  };
}

interface DashboardState {
  loading: boolean;
  error: string | null;
  userStats: UserStats;
  balance: number;
  balanceStatus: string;
  balanceLoading: boolean;
  balanceError: string | null;
}

const initialState: DashboardState = {
  loading: false,
  error: null,
  userStats: {
    balance: 0,
    totalTransactions: 0,
    transactionTypeStats: {
      "add-money": 0,
      "send-money": 0,
      "cash-out": 0
    },
    walletStatus: "inactive"
  },
  balance: 0,
  balanceStatus: "ACTIVE",
  balanceLoading: false,
  balanceError: null
};

// Async thunk for fetching user stats
export const fetchUserStats = createAsyncThunk(
  "dashboard/fetchUserStats",
  async (_, { rejectWithValue }) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await api.get("/transactions/user-stats", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (err: unknown) {
      const error = err as ApiError;
      
      console.error("Fetch User Stats API Error Details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        headers: error.response?.headers
      });
      
      let errorMessage = "Failed to fetch user stats";
      
      // Handle JSON error responses
      if (error.response?.data) {
        if (typeof error.response.data === 'object' && error.response.data !== null) {
          if ('message' in error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if ('error' in error.response.data && error.response.data.error) {
            errorMessage = error.response.data.error;
          } else {
            errorMessage = JSON.stringify(error.response.data);
          }
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for fetching wallet balance
export const fetchBalance = createAsyncThunk(
  "dashboard/fetchBalance",
  async (_, { rejectWithValue }) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await api.get<BalanceResponse>("/wallet/balance", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (err: unknown) {
      const error = err as ApiError;
      
      console.error("Fetch Balance API Error Details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        headers: error.response?.headers
      });
      
      let errorMessage = "Failed to fetch balance";
      
      // Handle JSON error responses
      if (error.response?.data) {
        if (typeof error.response.data === 'object' && error.response.data !== null) {
          if ('message' in error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if ('error' in error.response.data && error.response.data.error) {
            errorMessage = error.response.data.error;
          } else {
            errorMessage = JSON.stringify(error.response.data);
          }
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    resetUserStats(state) {
      state.userStats = initialState.userStats;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.loading = false;
        state.userStats = action.payload.data || initialState.userStats;
        state.error = null;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Reset to initial state on error
        state.userStats = initialState.userStats;
      })
      .addCase(fetchBalance.pending, (state) => {
        state.balanceLoading = true;
        state.balanceError = null;
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.balanceLoading = false;
        state.balance = action.payload.data.balance;
        state.balanceStatus = action.payload.data.status;
        state.balanceError = null;
      })
      .addCase(fetchBalance.rejected, (state, action) => {
        state.balanceLoading = false;
        state.balanceError = action.payload as string;
        state.balance = 0;
      });
  },
});

export const { clearError, resetUserStats } = dashboardSlice.actions;

export default dashboardSlice.reducer;

// Hook to access dashboard state
export const useDashboard = () => {
  const dashboard = useSelector((state: RootState) => state.dashboard);
  const dispatch = useDispatch<AppDispatch>();

  const handleFetchUserStats = useCallback(() => {
    return dispatch(fetchUserStats());
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleResetUserStats = useCallback(() => {
    dispatch(resetUserStats());
  }, [dispatch]);

  const handleFetchBalance = useCallback(() => {
    return dispatch(fetchBalance());
  }, [dispatch]);

  return { 
    ...dashboard, 
    fetchUserStats: handleFetchUserStats,
    fetchBalance: handleFetchBalance,
    clearError: handleClearError,
    resetUserStats: handleResetUserStats
  };
};
