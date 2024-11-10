import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUser = createAsyncThunk('fetchUser',async (_,rejectWithValue)=>{
    try {
        const response = await axios.get(import.meta.env.VITE_BACKENDURL + '/api/users/isVerified');
        return response.data;
    }catch (e) {
        console.log('error ',e);
        return rejectWithValue(e.response ? e.response.data : 'Network error');
    }
})

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        email:'',
        name:'',
        profilePicture:'',
        userType:'normal',
        host: '',
        role:''
    },
    reducers: {
        addUser: (state, action) => {
            Object.assign(state, action.payload);
        },
        logOutUser:(state)=>{
            Object.keys(state).forEach(key => delete state[key]);
        },
        setGoogleUser: (state)=>{
            state.userType = 'google'
        },
        setOtpUser: (state)=>{
            state.userType = 'otp';
        },
        setHostName: (state,action) => {
            state.host = action.payload;
        },
        setProfilePicture:(state,action)=>{
            state.profilePicture = action.payload;
        },
        changeName:(state,action)=>{
            state.name = action.payload;
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchUser.fulfilled,(state,action)=>{
            return {...state,...action.payload};
        })
    }
});


export const {addUser,logOutUser,setGoogleUser,setHostName,setProfilePicture,changeName} = userSlice.actions;

export default userSlice.reducer;