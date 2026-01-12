import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

axios.defaults.withCredentials = true

// Fetch all gigs
export const fetchGigs = createAsyncThunk('gigs/fetchAll', async (search = '', { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API_URL}/api/gigs?search=${search}`)
    return data.gigs
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch gigs')
  }
})

// Fetch single gig
export const fetchGigById = createAsyncThunk('gigs/fetchById', async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API_URL}/api/gigs/${id}`)
    return data.gig
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch gig')
  }
})

// Fetch my gigs
export const fetchMyGigs = createAsyncThunk('gigs/fetchMyGigs', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API_URL}/api/gigs/my-gigs`)
    return data.gigs
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch your gigs')
  }
})

// Create gig
export const createGig = createAsyncThunk('gigs/create', async (gigData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${API_URL}/api/gigs`, gigData)
    return data.gig
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create gig')
  }
})

// Delete gig
export const deleteGig = createAsyncThunk('gigs/delete', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/api/gigs/${id}`)
    return id
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete gig')
  }
})

const gigSlice = createSlice({
  name: 'gigs',
  initialState: {
    gigs: [],
    myGigs: [],
    currentGig: null,
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentGig: (state) => {
      state.currentGig = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all gigs
      .addCase(fetchGigs.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchGigs.fulfilled, (state, action) => {
        state.loading = false
        state.gigs = action.payload
      })
      .addCase(fetchGigs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch single gig
      .addCase(fetchGigById.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchGigById.fulfilled, (state, action) => {
        state.loading = false
        state.currentGig = action.payload
      })
      .addCase(fetchGigById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch my gigs
      .addCase(fetchMyGigs.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchMyGigs.fulfilled, (state, action) => {
        state.loading = false
        state.myGigs = action.payload
      })
      .addCase(fetchMyGigs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create gig
      .addCase(createGig.pending, (state) => {
        state.loading = true
      })
      .addCase(createGig.fulfilled, (state, action) => {
        state.loading = false
        state.gigs.unshift(action.payload)
      })
      .addCase(createGig.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Delete gig
      .addCase(deleteGig.fulfilled, (state, action) => {
        state.myGigs = state.myGigs.filter(gig => gig._id !== action.payload)
      })
  }
})

export const { clearError, clearCurrentGig } = gigSlice.actions
export default gigSlice.reducer