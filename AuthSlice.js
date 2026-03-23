
import {createAsyncThunk,createSlice} from '@reduxjs/toolkit';
import axiosClient from './utils/axiosClient';


export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
        console.log(userData);
       const response =  await axiosClient.post('/user/register',userData);
    //     console.log('after api call'); 
    //    console.log('Login API Response:', response.data); 
       return response.data.User;
    }catch (error) {
        console.log(" ghgf"+error);
        return rejectWithValue(error.response?.data || error.message  )
    }
}
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async (Credential , {rejectWithValue})=>{
        try{
           
        const responce = await axiosClient.post('/user/login',Credential);
        return responce.data.User;
        }
        catch (error) {
        return rejectWithValue(error.response?.data || error.message  )
    }
       
});

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, {rejectWithValue})=>{
        try{
            await axiosClient.get('/user/logout')
             return null;
        }
       catch (error) {
        return rejectWithValue(error.response?.data || error.message  )
    }
});

export const checkAuth = createAsyncThunk(
    'auth/check',
    async (_,{rejectWithValue})=>{
        try{
              const {data} = await axiosClient.get('/user/check');
              return data.user
        }
        catch (error) {
        return rejectWithValue(error.response?.data || error.message  )
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
            console.log('signup pandding...');
        })
        .addCase(registerUser.fulfilled,(state,action)=>{
            state.loading = false;
            state.isAuthenticated = !!action.payload; // true - if value exists  and false - if value is empty
            state.user = action.payload;
             console.log('Login fulfilled - user:', action.payload); // Debug log
                console.log('isAuthenticated set to:', !!action.payload); 
            
        })
        .addCase(registerUser.rejected , (state,action)=>{
            state.loading = false;
            state.error = action.payload?.message || "Somthing went wrong"
            state.isAuthenticated = false;
            state.user = null;
             console.log('Signup rejected - error:', state.error); 
        })

        //login User Case

        .addCase(loginUser.pending , (state)=>{
            state.loading = true;
            state.error = null;
             console.log('Login pending...'); // Debug log
        })
        .addCase(loginUser.fulfilled,(state,action)=>{
            state.loading = false;
            state.isAuthenticated = !!action.payload;
            state.user = action.payload;
              console.log('Login fulfilled - user:', action.payload); // Debug log
                console.log('isAuthenticated set to:', !!action.payload); 
        })
        .addCase(loginUser.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload?.message || "Somsthing went wrong";
            state.isAuthenticated = false;
            state.user = null;
            console.log('Login rejected - error:', state.error); // Debug log
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
        
        })
        
    }
});

export default authSlice.reducer;