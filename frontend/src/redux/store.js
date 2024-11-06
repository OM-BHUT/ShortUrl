import {configureStore} from "@reduxjs/toolkit";
import changesReducer from "@/redux/slice/changesSlice.js";
import userReducer from "@/redux/slice/userSlice.js";


export const store = configureStore({
        reducer: {
            shortUrls:changesReducer,
            user:userReducer
        }
})