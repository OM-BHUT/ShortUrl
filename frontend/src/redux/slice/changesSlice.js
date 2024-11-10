import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = [];

// Handlers
function addUrlHandler(state, action) {
    state.push(action.payload);
}

function removeUrlHandler(state, action) {
    const index = state.findIndex(url => url.shortId === action.payload);
    if (index !== -1) {
        state.splice(index, 1);
    }
}

function increaseViewCount(state, action) {

    const urlIndex = state.findIndex(url => url.shortId === action.payload.shortId);
    if (urlIndex !== -1) {
        state[urlIndex].details = action.payload.details;  // Update the entire details array
    }
}




// Thunks
export const fetchUrls = createAsyncThunk('fetchUrls', async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKENDURL}/api/shortUrl`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error fetching URLs:', error);
        throw error;
    }
});

// Slice
export const changesSlice = createSlice({
    name: 'shortUrls',
    initialState,
    reducers: {
        addUrl: addUrlHandler,
        deleteUrl: removeUrlHandler,
        incrementViewCount: increaseViewCount,
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUrls.fulfilled, (state, action) => {
            return action.payload;
        });
        builder.addCase(fetchUrls.rejected, (state, action) => {
            console.error('Error in fetchUrls:', action.error);
        });
    }
});

// Exports
export const { addUrl, deleteUrl, incrementViewCount } = changesSlice.actions;
export default changesSlice.reducer;
