import {configeStore} from '@reduxjs/toolkit';
import authReducer from '../AuthSlice'

export const  store = configeStore({
    reducer:{
        auth:authReducer
    }
})