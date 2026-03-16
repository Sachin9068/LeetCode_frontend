
import {createAsyncThunk,createSlice} from '@reduxjs/toolkit';
import axiosClient from './utils/axiosClient';


export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData,{rejectWithValue})=>{
        try{
             const response = await axiosClient.post('/user/register',userData);
             return response.data.user;
        }
        catch(err){
            return rejectWithValue(err);
        }

});

export const loginUser = createAsyncThunk(
    'auth/login',
    async (Credential , {rejectWithValue})=>{
        try{
        const responce = await axiosClient.post('/user/login',Credential);
        return responce.data.user;
        }
        catch(err){
            return rejectWithValue(err);
        }
       
});

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, {rejectWithValue})=>{
        try{
            await axiosClient.get('/user/logout')
             return null;
        }
        catch(err){
            return rejectWithValue(err);
        }
});

export const checkAuth = createAsyncThunk(
    'auth/check',
    async (_,{rejectWithValue})=>{
        try{
              const {data} = await axiosClient.get('/user/check');
              return data.user
        }
        catch(err){
            return rejectWithValue(err);
        }
    }
)

const authSlice = createSlice({
    name:'auth',
    initialState:{
        user:null,
        isAuthenticated:false,
        loading:false,
        error:null
    },
    reducers: {},
    extraReducers: (builder)=>{
     builder
        //Register User Cases
        .addCase(registerUser.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(registerUser.fulfilled,(state,action)=>{
            state.loading = false;
            state.isAuthenticated = !!action.payload; // true - if value exists  and false - if value is empty
            state.user = action.payload;
        })
        .addCase(registerUser.rejected , (state,action)=>{
            state.loading = false;
            state.error = action.payload?.message || "Somthing went wrong"
            state.isAuthenticated = false;
            state.user = null;
        })

        //login User Case

        .addCase(loginUser.pending , (state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(loginUser.fulfilled,(state,action)=>{
            state.loading = false;
            state.isAuthenticated = !!action.payload;
            state.user = action.payload
        })
        .addCase(loginUser.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload?.message || "Somsthing went wrong";
            state.isAuthenticated = false;
            state.user = null;
        })

        //logout User Case

        .addCase(logoutUser.pending , (state)=>{
            state.loading = true;
            state.error = null
        })
        .addCase(logoutUser.fulfilled ,(state,action)=>{
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        })
        .addCase(logoutUser.rejected ,(state,action)=>{
            state.loading = false;
            state.error = action.payload?.message;
            state.isAuthenticated = false;
            state.user = null
        })

        //check User Case 
        
        .addCase(checkAuth.pending ,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(checkAuth.fulfilled,(state,action)=>{
            state.loading = false;
            state.isAuthenticated = !!action.payload;
            state.user = action.payload;
        })
        .addCase(checkAuth.rejected ,(state,action)=>{
            state.loading = false;
            state.error = action.payload?.message || "something went wrong";
            state.isAuthenticated = false;
            state.user = null;
            s
        })
        
    }
});

export default authSlice.reducer;