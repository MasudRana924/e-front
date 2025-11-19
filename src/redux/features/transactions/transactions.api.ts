import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../baseApi";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { useCallback } from "react";

interface SendMoneyRequest {
  receiverPhone: string;
  amount: string;
  pin: string;
}

interface SendMoneyResponse {
  message: string;
  data: {
    senderBalance: number | null;
  };
}

interface AddMoneyRequest {
  amount: string;
  pin: string;
}

interface AddMoneyResponse {
  message: string;
  data: {
    balance: number;
  };
}

interface CashOutRequest {
  agentPhone: string;
  amount: string;
  pin: string;
}

interface CashOutResponse {
  message: string;
  remainingBalance: number | null;
}

interface CashInRequest {
  userPhone: string;
  amount: string;
  pin: string;
}

interface CashInResponse {
  message: string;
  data?: {
    balance?: number;
  };
}

interface WithdrawMoneyRequest {
  amount: string;
  pin: string;
  receiverWallet: string;
}

interface WithdrawMoneyResponse {
  message: string;
  data?: {
    balance?: number;
  };
}

interface TransactionHistoryItem {
  _id: string;
  type: "add-money" | "send-money";
  amount: number;
  receiver: string;
  sender?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
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

// interface TransactionHistoryResponse {
//   success: boolean;
//   message: string;
//   data: TransactionHistoryItem[];
// }

interface TransactionState {
  loading: boolean;
  error: string | null;
  lastTransaction: SendMoneyResponse | null;
  lastDeposit: AddMoneyResponse | null;
  lastCashOut: CashOutResponse | null;
  lastCashIn: CashInResponse | null;
  lastWithdraw: WithdrawMoneyResponse | null;
  transactionHistory: TransactionHistoryItem[];
  historyLoading: boolean;
}

const initialState: TransactionState = {
  loading: false,
  error: null,
  lastTransaction: null,
  lastDeposit: null,
  lastCashOut: null,
  lastCashIn: null,
  lastWithdraw: null,
  transactionHistory: [],
  historyLoading: false,
};

// Async thunk for sending money
export const sendMoney = createAsyncThunk(
  "transactions/sendMoney",
  async (formData: SendMoneyRequest, { rejectWithValue }) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const apiData = {
        amount: Number(formData.amount),
        receiverPhone: formData.receiverPhone,
        pin: formData.pin,
      };

      const response = await api.post("/wallet/send-money", apiData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      return response.data;
    } catch (err: unknown) {
      const error = err as ApiError;
      
      console.error("Send Money API Error Details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        headers: error.response?.headers
      });
      
      let errorMessage = "Failed to send money";
      
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

// Async thunk for adding money
export const addMoney = createAsyncThunk(
  "transactions/addMoney",
  async (formData: AddMoneyRequest, { rejectWithValue }) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const apiData = {
        amount: Number(formData.amount),
        pin: formData.pin,
      };

      const response = await api.post("/wallet/add-money", apiData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      return response.data;
    } catch (err: unknown) {
      const error = err as ApiError;
      
      console.error("Add Money API Error Details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        headers: error.response?.headers
      });
      
      let errorMessage = "Failed to add money";
      
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

// Async thunk for cash out
export const cashOut = createAsyncThunk(
  "transactions/cashOut",
  async (formData: CashOutRequest, { rejectWithValue }) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const apiData = {
        pin: formData.pin,
        amount: Number(formData.amount),
        agentPhone: formData.agentPhone,
      };

      const response = await api.post("/wallet/user-cash-out", apiData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      return response.data;
    } catch (err: unknown) {
      const error = err as ApiError;
      
      console.error("Cash Out API Error Details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        headers: error.response?.headers
      });
      
      let errorMessage = "Failed to cash out";
      
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

// Async thunk for cash in
export const cashIn = createAsyncThunk(
  "transactions/cashIn",
  async (formData: CashInRequest, { rejectWithValue }) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const apiData = {
        userPhone: formData.userPhone,
        amount: Number(formData.amount),
        pin: formData.pin,
      };

      const response = await api.post("/wallet/cash-in", apiData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      return response.data;
    } catch (err: unknown) {
      const error = err as ApiError;
      
      console.error("Cash In API Error Details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        headers: error.response?.headers
      });
      
      let errorMessage = "Failed to cash in";
      
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

// Async thunk for withdrawing money
export const withdrawMoney = createAsyncThunk(
  "transactions/withdrawMoney",
  async (formData: WithdrawMoneyRequest, { rejectWithValue }) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const apiData = {
        amount: Number(formData.amount),
        pin: formData.pin,
        receiverWallet: formData.receiverWallet,
      };

      const response = await api.post("/wallet/withdraw", apiData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      return response.data;
    } catch (err: unknown) {
      const error = err as ApiError;
      
      console.error("Withdraw Money API Error Details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        headers: error.response?.headers
      });
      
      let errorMessage = "Failed to withdraw money";
      
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

// Async thunk for fetching transaction history
export const fetchTransactionHistory = createAsyncThunk(
  "transactions/fetchTransactionHistory",
  async (_, { rejectWithValue }) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await api.get("/transactions/history", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (err: unknown) {
      const error = err as ApiError;
      
      console.error("Fetch Transaction History API Error Details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        headers: error.response?.headers
      });
      
      let errorMessage = "Failed to fetch transaction history";
      
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

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearLastTransaction(state) {
      state.lastTransaction = null;
    },
    clearLastDeposit(state) {
      state.lastDeposit = null;
    },
    clearLastCashOut(state) {
      state.lastCashOut = null;
    },
    clearLastCashIn(state) {
      state.lastCashIn = null;
    },
    clearLastWithdraw(state) {
      state.lastWithdraw = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMoney.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMoney.fulfilled, (state, action) => {
        state.loading = false;
        state.lastTransaction = action.payload;
        state.error = null;
      })
      .addCase(sendMoney.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addMoney.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMoney.fulfilled, (state, action) => {
        state.loading = false;
        state.lastDeposit = action.payload;
        state.error = null;
      })
      .addCase(addMoney.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(cashOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cashOut.fulfilled, (state, action) => {
        state.loading = false;
        state.lastCashOut = action.payload;
        state.error = null;
      })
      .addCase(cashOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(cashIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cashIn.fulfilled, (state, action) => {
        state.loading = false;
        state.lastCashIn = action.payload;
        state.error = null;
      })
      .addCase(cashIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(withdrawMoney.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(withdrawMoney.fulfilled, (state, action) => {
        state.loading = false;
        state.lastWithdraw = action.payload;
        state.error = null;
      })
      .addCase(withdrawMoney.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTransactionHistory.pending, (state) => {
        state.historyLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactionHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.transactionHistory = action.payload.data;
        state.error = null;
      })
      .addCase(fetchTransactionHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearLastTransaction, clearLastDeposit, clearLastCashOut, clearLastCashIn, clearLastWithdraw } = transactionSlice.actions;

export default transactionSlice.reducer;

// Hook to access transaction state
export const useTransactions = () => {
  const transactions = useSelector((state: RootState) => state.transactions);
  const dispatch = useDispatch<AppDispatch>();

  const handleSendMoney = useCallback((formData: SendMoneyRequest) => {
    return dispatch(sendMoney(formData));
  }, [dispatch]);

  const handleAddMoney = useCallback((formData: AddMoneyRequest) => {
    return dispatch(addMoney(formData));
  }, [dispatch]);

  const handleCashOut = useCallback((formData: CashOutRequest) => {
    return dispatch(cashOut(formData));
  }, [dispatch]);

  const handleCashIn = useCallback((formData: CashInRequest) => {
    return dispatch(cashIn(formData));
  }, [dispatch]);

  const handleWithdrawMoney = useCallback((formData: WithdrawMoneyRequest) => {
    return dispatch(withdrawMoney(formData));
  }, [dispatch]);

  const handleFetchTransactionHistory = useCallback(() => {
    return dispatch(fetchTransactionHistory());
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleClearLastTransaction = useCallback(() => {
    dispatch(clearLastTransaction());
  }, [dispatch]);

  const handleClearLastDeposit = useCallback(() => {
    dispatch(clearLastDeposit());
  }, [dispatch]);

  const handleClearLastCashOut = useCallback(() => {
    dispatch(clearLastCashOut());
  }, [dispatch]);

  const handleClearLastCashIn = useCallback(() => {
    dispatch(clearLastCashIn());
  }, [dispatch]);

  const handleClearLastWithdraw = useCallback(() => {
    dispatch(clearLastWithdraw());
  }, [dispatch]);

  return { 
    ...transactions, 
    sendMoney: handleSendMoney,
    addMoney: handleAddMoney,
    cashOut: handleCashOut,
    cashIn: handleCashIn,
    withdrawMoney: handleWithdrawMoney,
    fetchTransactionHistory: handleFetchTransactionHistory,
    clearError: handleClearError,
    clearLastTransaction: handleClearLastTransaction,
    clearLastDeposit: handleClearLastDeposit,
    clearLastCashOut: handleClearLastCashOut,
    clearLastCashIn: handleClearLastCashIn,
    clearLastWithdraw: handleClearLastWithdraw
  };
};
