import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';

function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<Home></Home>}></Route>
       <Route path='/Login' element={<Login></Login>}></Route>
        <Route path='/Signup' element={<Signup></Signup>}></Route>
    </Routes>
  </>
  )
}

export default App;