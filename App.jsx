import { BrowserRouter, Route, Routes } from "react-router"
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
      },[isAuthenticated])

  return(
    <>
   <BrowserRouter>
       <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="login" element={<Login/>}/>
          <Route path="signup" element={<Signup/>}/>
       </Routes>
   
   </BrowserRouter>

    </>
  )

}

export default App