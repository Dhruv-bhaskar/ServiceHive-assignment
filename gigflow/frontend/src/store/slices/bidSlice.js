import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

axios.defaults.withCredentials = true;

// Submit bid
export const submitBid = createAsyncThunk(
  "bids/submit",
  async (bidData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/bids`, bidData);
      return data.bid;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to submit bid"
      );
    }
  }
);

// Fetch bids for a gig (owner only)
export const fetchBidsForGig = createAsyncThunk(
  "bids/fetchForGig",
  async (gigId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/bids/${gigId}`);
      return data.bids;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch bids"
      );
    }
  }
);

// Fetch my bids
export const fetchMyBids = createAsyncThunk(
  "bids/fetchMyBids",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/bids/my-bids/all`);
      return data.bids;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch your bids"
      );
    }
  }
);

// Hire freelancer
export const hireFreelancer = createAsyncThunk(
  "bids/hire",
  async (bidId, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(`${API_URL}/api/bids/${bidId}/hire`);
      return data.bid;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to hire freelancer"
      );
    }
  }
);

const bidSlice = createSlice({
  name: "bids",
  initialState: {
    bids: [],
    myBids: [],
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit bid
      .addCase(submitBid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitBid.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Bid submitted successfully";
      })
      .addCase(submitBid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch bids for gig
      .addCase(fetchBidsForGig.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBidsForGig.fulfilled, (state, action) => {
        state.loading = false;
        state.bids = action.payload;
      })
      .addCase(fetchBidsForGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch my bids
      .addCase(fetchMyBids.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyBids.fulfilled, (state, action) => {
        state.loading = false;
        state.myBids = action.payload;
      })
      .addCase(fetchMyBids.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Hire freelancer
      .addCase(hireFreelancer.pending, (state) => {
        state.loading = true;
      })
      .addCase(hireFreelancer.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Freelancer hired successfully";
        // Update bids list
        state.bids = state.bids.map((bid) =>
          bid._id === action.payload._id
            ? action.payload
            : bid.status === "pending"
            ? { ...bid, status: "rejected" }
            : bid
        );
      })
      .addCase(hireFreelancer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess } = bidSlice.actions;
export default bidSlice.reducer;
