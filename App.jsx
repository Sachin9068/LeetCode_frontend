import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from "./AuthSlice";
import { useEffect } from "react";


function App(){

      const {isAuthenticated} = useSelector((state)=>state.auth);
      const dispatch = useDispatch();

      useEffect(()=>{
           dispatch(checkAuth());
      },[dispatch])

  return(
    <>
   <BrowserRouter>
       <Routes>
          <Route path="/" element={isAuthenticated ?<Home/> :<Navigate to="/signup"/>}/>
          <Route path="/login" element={isAuthenticated ?<Navigate to="/"/> : <Login/>}/>
          <Route path="/signup" element={isAuthenticated ?<Navigate to="/"/> : <Signup/>}/>
       </Routes>
   
   </BrowserRouter>

    </>
  )

}

export default App