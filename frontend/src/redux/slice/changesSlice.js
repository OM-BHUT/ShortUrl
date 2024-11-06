import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

const initialState = [];

function addUrlHandler(state,action){
    state.push(action.payload);
}

function removeUrlHandler(state , action){
    state = state.filter(url => action.payload.shortId!==url.shortId);
}
export const fetchUrls = createAsyncThunk('fetchUrls',async ()=>{
    try {
        const response = await axios.get('/api/shortUrl');
        return response.data;
    }catch (error) {
        console.log('error ',error);
        throw error;
    }
})

export const changesSlice = createSlice({
    name:'shortUrls',
    initialState,
    reducers:{
        addUrl: addUrlHandler,
        deleteUrl: removeUrlHandler
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUrls.fulfilled,(state,action)=>{
            // state.data = action.payload;
            return action.payload;
        });
            builder.addCase(fetchUrls.rejected,(state,action)=>{
                console.log('error' ,action.payload);
            })
    }
})



export const {addUrl,deleteUrl} = changesSlice.actions;

export default changesSlice.reducer;